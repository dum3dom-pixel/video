// Builds compositions/film-<part>.html from spec/timeline-<part>.json + spec/film-<part>-shots.json.
// Run from this folder: node build-film.mjs v5a
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const part = process.argv[2] || 'v5a';
const timeline = JSON.parse(fs.readFileSync(path.join(root, `spec/timeline-${part}.json`), 'utf8'));
const shotList = JSON.parse(fs.readFileSync(path.join(root, `spec/film-${part}-shots.json`), 'utf8'));
const duration = Math.ceil(timeline.total * 24) / 24;
fs.writeFileSync(path.join(root, `engine/data-film-${part}.js`), `window.FILM = ${JSON.stringify({...timeline, shots: shotList.shots, duration})};\n`);
const html = `<!doctype html>
<html lang="ru" data-resolution="landscape"><head><meta charset="UTF-8">
<meta name="viewport" content="width=1920, height=1080">
<style>
@font-face{font-family:PilotSans;src:url('../assets/fonts/arial-bold.ttf');font-weight:700}
@font-face{font-family:PilotSerif;src:url('../assets/fonts/georgia.ttf')}
@font-face{font-family:PilotSerif;src:url('../assets/fonts/georgia-bold.ttf');font-weight:700}
*{box-sizing:border-box;margin:0}html,body{width:1920px;height:1080px;overflow:hidden;background:#a59b8c}
#stage{position:absolute;inset:0;width:1920px;height:1080px}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${duration}" data-width="1920" data-height="1080" data-fps="24" data-no-timeline>
<canvas id="stage" width="1920" height="1080" data-layout-allow-overflow></canvas>
<audio id="master" class="clip" data-start="0" data-duration="${timeline.total}" data-track-index="2" data-volume="1" src="../assets/master-${part}.wav"></audio>
</div>
<script>window.PILOT_ASSET_BASE='../assets/';</script>
<script src="../engine/data-film-${part}.js"></script><script src="../engine/paper.js"></script><script src="../engine/film.js"></script>
<script>
const ready=Promise.all([document.fonts.load('700 68px PilotSans'),document.fonts.load('700 150px PilotSerif'),document.fonts.load('40px PilotSerif'),PILOT_ENGINE.load()]).then(()=>PILOT_ENGINE.render(0));
window.__hf=window.__hf||{};window.__hf.buildReady=window.__hf.buildReady||{};window.__hf.buildReady.main=ready;
window.addEventListener('hf-seek',e=>PILOT_ENGINE.render(e.detail.time));
</script></body></html>`;
fs.mkdirSync(path.join(root, 'compositions'), {recursive: true});
fs.writeFileSync(path.join(root, `compositions/film-${part}.html`), html);
console.log(`Built film-${part}: ${duration}s, ${shotList.shots.length} shots`);
