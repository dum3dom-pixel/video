"""Builds assets/audio/candidates/music-variants.html: one self-contained page with 30 s players for every candidate track.
Run from video-01: python -X utf8 scripts/build_music_page.py"""
import base64, html, json
C = json.load(open('assets/audio/candidates/candidates.json', encoding='utf-8'))
SLOTS = {'A': ('0:00–2:32', 'Просыпаешься в 12 лет, план, три правила'),
         'B': ('2:26–6:34', 'Кухня 2005-го, первые месяцы, три попытки, кассеты'),
         'C': ('6:28–10:21', '2008–2011: поломка плана, дед, гараж'),
         'D': ('10:15–12:59', '2011–2024: годы идут, Лена, терраса'),
         'E': ('12:53–14:11', 'Осень 2026-го: брат, последняя кассета')}
out = ['''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Варианты музыки</title><style>
:root{--bg:#F1E6CF;--fg:#2b2118;--card:#fbf5e6;--mu:#6b5a47;--ac:#8C4A32;--ln:#d8c9a8}
@media (prefers-color-scheme:dark){:root{--bg:#1d1812;--fg:#efe4cf;--card:#2a231a;--mu:#a89a84;--ac:#D9A441;--ln:#3d3427}}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.45 system-ui,sans-serif;padding:20px 16px 60px;max-width:760px;margin:auto}
h1{font-size:24px;margin:0 0 4px}p.s{color:var(--mu);margin:0 0 22px}h2{font-size:18px;margin:28px 0 2px;color:var(--ac)}
.w{color:var(--mu);font-size:14px;margin:0 0 10px}.c{background:var(--card);border:1px solid var(--ln);border-radius:10px;padding:10px 12px;margin:8px 0}
.t{font-weight:600}.m{color:var(--mu);font-size:13px}audio{width:100%;margin-top:6px}b.d{background:var(--ac);color:var(--bg);border-radius:4px;padding:0 6px;font-size:12px;margin-left:6px}
</style></head><body><h1>Варианты музыки</h1>
<p class="s">Каждый трек: 30 секунд из середины, выровнено по громкости. Все с лицензией CC BY или CC0, сделаны людьми. Метка «сейчас» — что стоит в сборке по умолчанию. Ответь кодами, например: A2, B1, C3, D1, E4.</p>''']
for slot, (rng, what) in SLOTS.items():
    out.append(f'<h2>Кусок {slot} · {rng}</h2><p class="w">{what}</p>')
    for c in (x for x in C if x['slot'] == slot):
        b64 = base64.b64encode(open(f"assets/audio/candidates/previews/{c['key']}.mp3", 'rb').read()).decode()
        mins = f"{int(c['seconds'] // 60)}:{int(c['seconds'] % 60):02d}"
        tags = ', '.join(c['tags'][:5])
        out.append(f'<div class="c"><div class="t">{c["key"]} · {html.escape(c["title"])}{"<b class=d>сейчас</b>" if c["key"].endswith("1") else ""}</div>'
                   f'<div class="m">{html.escape(c["creator"])} · {c["license"].upper()} · {mins} · {html.escape(tags)}</div>'
                   f'<audio controls preload="none" src="data:audio/mpeg;base64,{b64}"></audio></div>')
out.append('</body></html>')
open('assets/audio/candidates/music-variants.html', 'w', encoding='utf-8').write('\n'.join(out))
print('ok')
