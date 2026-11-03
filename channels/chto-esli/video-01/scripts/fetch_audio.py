"""Downloads the chosen human-made music/SFX from Openverse (Freesound, Jamendo) into assets/audio/{music,sfx}
and writes assets/audio/credits.json + credits.txt (attribution lines for CC BY tracks).
Run from video-01: python -X utf8 scripts/fetch_audio.py"""
import json, os, urllib.request
UA={'User-Agent':'Mozilla/5.0'}
ITEMS=[  # (kind, slug, openverse id)
 ('music','twilight-poem','9986a093-992a-4b2c-8413-a03732dc77e0'),
 ('music','leaf-fall','95e2c450-a554-4203-a8c0-d9bf2d5dd5dc'),
 ('music','back-home','83dd97a1-98c1-42a3-badc-f4dbac8130d0'),
 ('music','late-spring','8e0018a0-7265-4d09-9062-bc66a1ff05f4'),
 ('music','piano-improvisation-2','332645c6-8c9d-4a0a-8633-7cfc2fd9d453'),
 ('sfx','page-turn-02','82f0a358-0106-49af-a2f5-0cac64efa811'),
 ('sfx','page-turn-04','9837be9e-2067-423c-bbcb-91d4097c596a'),
 ('sfx','paper-rustle','910aa4c0-33ae-4002-ac78-f52b449a870c'),
 ('sfx','page-turn-1','62466ac3-4f52-47d3-a30e-a35c8d7881bf'),
 ('sfx','button-press','e293f82c-10e9-4471-b622-2b631ff59c8f'),
 ('sfx','cassette-play-button','44d2e988-b97c-4d85-94a2-aee4fc9fc602'),
 ('sfx','cassette-insert','7ac1b4ef-1926-4871-b7a8-3e153ebe4b33'),
 ('sfx','tape-hiss','41e6aaae-e3f8-46fa-b095-01b20d1e86cb'),
 ('sfx','phone-ring','21918b9a-dcd6-4230-a8bd-bfd5a7a96db4'),
 ('sfx','phone-vibrate','c9ed7654-c3c4-4e87-9e74-1e64f33b802f'),
 ('sfx','door-open-close','79104615-111c-44c9-86ac-a7fc5ae99dbf'),
 ('sfx','door-knock','608a1da4-be8c-4071-a1b3-f1e84a4fd1e8'),
 ('sfx','clock-ticking','890ef7f9-3157-4545-9528-4430d1b11434'),
 ('sfx','pencil-writing-long','956f1105-141d-451d-a7c4-3b90281fb57c'),
 ('sfx','pencil-writing-short','02a527ba-734b-4eec-8720-df530b75167e'),
 ('sfx','marker-scribble','1ab52f07-2303-43ab-af6e-4d9c94de2d98'),
 ('sfx','chalk-write','6960e6bd-4c46-4a4a-9d09-0e6e48740053'),
]
out=[];lines=[]
for kind,slug,i in ITEMS:
    os.makedirs(f'assets/audio/{kind}',exist_ok=True)
    m=json.load(urllib.request.urlopen(urllib.request.Request(f'https://api.openverse.org/v1/audio/{i}/',headers=UA),timeout=60))
    path=f'assets/audio/{kind}/{slug}.mp3'
    if not os.path.exists(path):
        open(path,'wb').write(urllib.request.urlopen(urllib.request.Request(m['url'],headers=UA),timeout=180).read())
    rec={'kind':kind,'slug':slug,'file':path,'title':m['title'],'creator':m.get('creator'),'license':m['license'],'version':m.get('license_version'),
         'license_url':m.get('license_url'),'page':m.get('foreign_landing_url'),'source':m['source'],'seconds':round((m.get('duration') or 0)/1000,1),'bytes':os.path.getsize(path)}
    out.append(rec);print(slug,rec['license'],rec['seconds'],rec['bytes'])
    if m['license']!='cc0':lines.append(f"«{m['title']}» — {m.get('creator')}, {m['license'].upper()} {m.get('license_version')} ({m.get('license_url')}), {m.get('foreign_landing_url')}")
json.dump(out,open('assets/audio/credits.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
open('assets/audio/credits.txt','w',encoding='utf-8').write('Музыка:\n'+'\n'.join(lines)+'\n\nЗвуковые эффекты: Freesound.org, лицензия CC0 (подпись не требуется).\n')
