import { createHash, randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdir, open, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const storage = join(process.env.LOCALAPPDATA, 'ShortsPublisher');
const api = 'https://www.googleapis.com/youtube/v3';
const mediaApi = 'https://www.googleapis.com/upload/youtube/v3';
const credentialsPath = join(storage, 'google-client.json');
const tokenPath = join(storage, 'google-token.json');
const studioUrl = id => `https://studio.youtube.com/video/${id}/edit`;

async function readJson(path) {
    return JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, ''));
}

async function readOptional(path) {
    try {
        return await readJson(path);
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        return null;
    }
}

async function save(path, value) {
    const temp = `${path}.${randomBytes(8).toString('hex')}.tmp`;
    await writeFile(temp, JSON.stringify(value, null, 2));
    await rename(temp, path);
}

function windows(command, value) {
    const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', command], {
        env: { ...process.env, SHORTS_DIALOG_VALUE: value },
        stdio: 'inherit',
    });
    if (result.error) throw result.error;
    return result.status;
}

function openBrowser(url) {
    if (windows('Start-Process -FilePath $env:SHORTS_DIALOG_VALUE', url) !== 0) {
        throw new Error('Не удалось открыть браузер.');
    }
}

function confirmUpload(message) {
    return windows(
        "Add-Type -AssemblyName System.Windows.Forms; if ([Windows.Forms.MessageBox]::Show($env:SHORTS_DIALOG_VALUE, 'YouTube Shorts', 'OKCancel', 'Question') -ne 'OK') { exit 1 }",
        message,
    ) === 0;
}

function desktopClient(data) {
    const client = data.installed;
    if (!client?.client_id || !client.client_secret) {
        throw new Error('Нужен JSON клиента Google OAuth типа Desktop app.');
    }
    return client;
}

async function tokenRequest(client, fields) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: client.client_id,
            client_secret: client.client_secret,
            ...fields,
        }),
        signal: AbortSignal.timeout(30_000),
    });
    const data = await response.json();
    if (!response.ok) {
        const error = new Error(`Google OAuth: ${data.error || response.status}`);
        error.oauthCode = data.error;
        throw error;
    }
    return data;
}

async function authorize(client, scope) {
    const state = randomBytes(32).toString('base64url');
    const verifier = randomBytes(48).toString('base64url');
    const server = createServer();
    await new Promise((done, fail) => {
        server.once('error', fail);
        server.listen(0, '127.0.0.1', done);
    });
    const redirectUri = `http://127.0.0.1:${server.address().port}/callback`;
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.search = new URLSearchParams({
        client_id: client.client_id,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope,
        access_type: 'offline',
        prompt: 'consent select_account',
        state,
        code_challenge: createHash('sha256').update(verifier).digest('base64url'),
        code_challenge_method: 'S256',
    });

    let timer;
    try {
        const code = await new Promise((done, fail) => {
            timer = setTimeout(() => fail(new Error('Время ожидания входа в Google истекло.')), 300_000);
            server.on('request', (request, response) => {
                const callback = new URL(request.url, redirectUri);
                if (callback.pathname !== '/callback' || callback.searchParams.get('state') !== state) {
                    response.writeHead(404).end();
                    return;
                }
                const code = callback.searchParams.get('code');
                response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                response.end('Вернись в окно загрузки Shorts.');
                if (code) done(code);
                else fail(new Error('Доступ к YouTube не был подтверждён.'));
            });
            openBrowser(url.href);
        });
        return await tokenRequest(client, {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: verifier,
        });
    } finally {
        clearTimeout(timer);
        server.close();
    }
}

async function accessToken(needsPlaylist) {
    const client = desktopClient(await readJson(credentialsPath));
    const scope = needsPlaylist
        ? 'https://www.googleapis.com/auth/youtube'
        : 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly';
    const saved = await readOptional(tokenPath);
    const compatible = saved?.clientId === client.client_id
        && (saved.scope === scope || saved.scope === 'https://www.googleapis.com/auth/youtube');
    if (compatible && saved.refreshToken) {
        try {
            const refreshed = await tokenRequest(client, {
                grant_type: 'refresh_token',
                refresh_token: saved.refreshToken,
            });
            if (refreshed.refresh_token) {
                await save(tokenPath, { ...saved, refreshToken: refreshed.refresh_token });
            }
            return refreshed.access_token;
        } catch (error) {
            if (error.oauthCode !== 'invalid_grant') throw error;
        }
    }
    const tokens = await authorize(client, scope);
    const granted = (tokens.scope ?? '').split(' ');
    if (!scope.split(' ').every(permission => granted.includes(permission))) {
        throw new Error('Google не выдал все разрешения, необходимые для загрузки.');
    }
    if (tokens.refresh_token) {
        await save(tokenPath, { clientId: client.client_id, scope, refreshToken: tokens.refresh_token });
    }
    return tokens.access_token;
}

async function loadPackage(file) {
    const data = await readJson(file);
    for (const key of ['video', 'thumbnail', 'title', 'description', 'categoryId', 'language']) {
        if (typeof data[key] !== 'string' || !data[key].trim()) {
            throw new Error(`В паспорте ролика заполни поле ${key}.`);
        }
    }
    if (!Array.isArray(data.tags) || data.tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
        throw new Error('Поле tags должно быть списком непустых строк.');
    }
    if (data.title.length > 100 || Buffer.byteLength(data.description, 'utf8') > 5000
        || data.tags.map(tag => tag.includes(' ') ? `"${tag}"` : tag).join(',').length > 500) {
        throw new Error('Проверь лимиты YouTube для заголовка, описания и тегов.');
    }
    if (typeof data.madeForKids !== 'boolean' || typeof data.containsSyntheticMedia !== 'boolean'
        || (data.playlist !== undefined && (typeof data.playlist !== 'string' || !data.playlist.trim()))) {
        throw new Error('Проверь поля madeForKids, containsSyntheticMedia и playlist.');
    }
    const folder = dirname(resolve(file));
    const video = resolve(folder, data.video);
    const thumbnail = resolve(folder, data.thumbnail);
    const videoFile = await stat(video);
    const thumbnailFile = await stat(thumbnail);
    if (!videoFile.isFile() || !videoFile.size || !video.toLowerCase().endsWith('.mp4')
        || !thumbnailFile.isFile() || !thumbnailFile.size || !thumbnail.toLowerCase().endsWith('.png')
        || thumbnailFile.size > 50_000_000) {
        throw new Error('Нужны непустой MP4 и PNG-обложка до 50 МБ.');
    }
    return { ...data, video, thumbnail, videoSize: videoFile.size };
}

function youtube(token) {
    return async (url, options = {}, allowed = []) => {
        const response = await fetch(url, {
            ...options,
            headers: { Authorization: `Bearer ${token}`, ...options.headers },
            signal: AbortSignal.timeout(options.duplex ? 900_000 : 45_000),
            redirect: 'manual',
        });
        if (!response.ok && !allowed.includes(response.status)) {
            const body = await response.json().catch(() => ({}));
            const message = body.error?.message || `HTTP ${response.status}`;
            throw new Error(`YouTube: ${message}`);
        }
        return response;
    };
}

function jsonBody(method, data) {
    return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
}

async function findPlaylist(request, title) {
    if (!title) return null;
    const matches = [];
    let pageToken;
    do {
        const query = new URLSearchParams({ part: 'snippet', mine: 'true', maxResults: '50' });
        if (pageToken) query.set('pageToken', pageToken);
        const page = await (await request(`${api}/playlists?${query}`)).json();
        matches.push(...page.items.filter(item => item.snippet.title === title));
        pageToken = page.nextPageToken;
    } while (pageToken);
    if (matches.length !== 1) throw new Error(`На канале должен быть один плейлист «${title}».`);
    return matches[0].id;
}

function validatedSession(location) {
    const url = new URL(location);
    if (url.origin !== 'https://www.googleapis.com' || !url.pathname.startsWith('/upload/youtube/')) {
        throw new Error('Google вернул неизвестный адрес сеанса загрузки.');
    }
    return url.href;
}

async function uploadVideo(request, pkg, state, statePath) {
    let start = 0;
    if (state.session) {
        const response = await request(validatedSession(state.session), {
            method: 'PUT',
            headers: { 'Content-Length': '0', 'Content-Range': `bytes */${pkg.videoSize}` },
        }, [308, 404, 410]);
        if (response.ok) return (await response.json()).id;
        if (response.status !== 308) {
            throw new Error('Сеанс загрузки истёк. Сначала проверь, появился ли ролик в Studio. Новый файл не отправлен.');
        }
        const range = response.headers.get('range');
        const match = range?.match(/^bytes=0-(\d+)$/);
        if (range && !match) throw new Error('YouTube вернул неизвестный диапазон загрузки.');
        if (match) start = Number(match[1]) + 1;
    } else {
        const response = await request(`${mediaApi}/videos?part=snippet,status&uploadType=resumable`, {
            ...jsonBody('POST', {
                snippet: {
                    title: pkg.title, description: pkg.description, tags: pkg.tags,
                    categoryId: pkg.categoryId, defaultLanguage: pkg.language,
                },
                status: {
                    privacyStatus: 'private',
                    selfDeclaredMadeForKids: pkg.madeForKids,
                    containsSyntheticMedia: pkg.containsSyntheticMedia,
                },
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-Upload-Content-Type': 'video/mp4',
                'X-Upload-Content-Length': String(pkg.videoSize),
            },
        });
        state.session = validatedSession(response.headers.get('location'));
        await save(statePath, state);
    }
    if (start >= pkg.videoSize) throw new Error('Файл уже передан. Запусти проверку повторно, чтобы получить ID.');
    console.log('Отправляю видео в YouTube…');
    const response = await request(state.session, {
        method: 'PUT',
        headers: {
            'Content-Type': 'video/mp4',
            'Content-Length': String(pkg.videoSize - start),
            'Content-Range': `bytes ${start}-${pkg.videoSize - 1}/${pkg.videoSize}`,
        },
        body: createReadStream(pkg.video, { start }),
        duplex: 'half',
    }, [308]);
    if (response.status === 308) throw new Error('Передача прервалась. Запусти тот же паспорт, чтобы продолжить.');
    return (await response.json()).id;
}

async function getVideo(request, id) {
    const response = await request(`${api}/videos?part=snippet,status,processingDetails,contentDetails&id=${id}`);
    const video = (await response.json()).items[0];
    if (!video) throw new Error(`YouTube не вернул видео ${id}.`);
    return video;
}

async function waitForProcessing(request, id) {
    console.log('Жду, пока YouTube обработает видео…');
    for (let attempt = 0; attempt < 60; attempt++) {
        const video = await getVideo(request, id);
        const status = video.processingDetails?.processingStatus;
        if (status === 'succeeded') return video;
        if ((status && status !== 'processing') || ['failed', 'rejected', 'deleted'].includes(video.status.uploadStatus)) {
            throw new Error(`Обработка завершилась со статусом ${status || video.status.uploadStatus}. ${studioUrl(id)}`);
        }
        await delay(10_000);
    }
    throw new Error(`YouTube ещё обрабатывает ролик. Запусти тот же паспорт позже. ${studioUrl(id)}`);
}

async function addToPlaylist(request, videoId, playlistId) {
    if (!playlistId) return;
    const query = new URLSearchParams({ part: 'id', playlistId, videoId });
    const existing = await (await request(`${api}/playlistItems?${query}`)).json();
    if (existing.items.length) return;
    await request(`${api}/playlistItems?part=snippet`, jsonBody('POST', {
        snippet: { playlistId, resourceId: { kind: 'youtube#video', videoId } },
    }));
}

async function publishPrivate(pkg) {
    const request = youtube(await accessToken(Boolean(pkg.playlist)));
    const channels = await (await request(`${api}/channels?part=snippet&mine=true`)).json();
    if (channels.items?.length !== 1) throw new Error('Не удалось однозначно определить канал YouTube.');
    const [channel] = channels.items;
    const playlistId = await findPlaylist(request, pkg.playlist);
    const approved = confirmUpload(
        `Канал: ${channel.snippet.title}\n\nРолик: ${pkg.title}\n\nВидимость новой загрузки: приватно.`,
    );
    if (!approved) return;

    const hash = createHash('sha256');
    for await (const chunk of createReadStream(pkg.video)) hash.update(chunk);
    const statePath = join(storage, `${channel.id}-${hash.digest('hex')}.json`);
    const lockPath = `${statePath}.lock`;
    const lock = await open(lockPath, 'wx').catch(error => {
        if (error.code !== 'EEXIST') throw error;
        throw new Error(`Для этого ролика уже запущена загрузка. Файл блокировки: ${lockPath}`);
    });
    try {
        const state = await readOptional(statePath) ?? {};
        if (!state.id) {
            const id = await uploadVideo(request, pkg, state, statePath);
            if (!/^[\w-]{11}$/.test(id ?? '')) throw new Error('YouTube не вернул корректный ID.');
            state.id = id;
            delete state.session;
            await save(statePath, state);
        }
        console.log(studioUrl(state.id));
        if (state.complete) {
            const video = await getVideo(request, state.id);
            console.log(`Этот файл уже загружен. Видимость: ${video.status.privacyStatus}.`);
        } else {
            const video = await waitForProcessing(request, state.id);
            if (video.status.privacyStatus !== 'private' || video.snippet.channelId !== channel.id) {
                throw new Error('Ролик больше не приватный или принадлежит другому каналу. Проверь его в Studio.');
            }
            await request(`${mediaApi}/thumbnails/set?videoId=${state.id}&uploadType=media`, {
                method: 'POST',
                headers: { 'Content-Type': 'image/png' },
                body: await readFile(pkg.thumbnail),
            });
            await addToPlaylist(request, state.id, playlistId);
            const verified = await getVideo(request, state.id);
            if (verified.status.privacyStatus !== 'private' || verified.snippet.title !== pkg.title
                || verified.snippet.description !== pkg.description
                || !pkg.tags.every(tag => (verified.snippet.tags ?? []).includes(tag))) {
                throw new Error('Видимость или метаданные отличаются от паспорта. Проверь ролик в Studio.');
            }
            state.complete = true;
            await save(statePath, state);
            console.log('Приватная загрузка обработана. Обложка отправлена в YouTube.');
        }
        openBrowser(studioUrl(state.id));
    } finally {
        await lock.close();
        await unlink(lockPath);
    }
}

async function main() {
    const [action, file] = process.argv.slice(2);
    if (action === 'setup') {
        const data = await readJson(file);
        desktopClient(data);
        await mkdir(storage, { recursive: true });
        await save(credentialsPath, data);
        return;
    }
    if (!['preview', 'upload'].includes(action) || !file) {
        throw new Error('Использование: node upload.mjs preview|upload паспорт.youtube.json');
    }
    const pkg = await loadPackage(file);
    if (action === 'preview') {
        console.log(JSON.stringify({
            video: pkg.video, thumbnail: pkg.thumbnail, title: pkg.title,
            tags: pkg.tags, playlist: pkg.playlist, privacy: 'private',
        }, null, 2));
        return;
    }
    await publishPrivate(pkg);
}

await main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
