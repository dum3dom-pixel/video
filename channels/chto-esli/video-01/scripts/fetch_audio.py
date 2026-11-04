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
 ('sfx','bed-creak','8dca0ef3-aaca-4244-87f7-3f8175ee0ca2'),
 ('sfx','bed-frame-creak','c36572c5-950f-43d3-909f-a56777119367'),
 ('sfx','footsteps-socks-wood','bcb24eae-a835-4882-8c01-e3db9153093f'),
 ('sfx','footsteps-leaves','f381d736-5e5e-4908-892e-02d3b17165de'),
 ('sfx','leaves-rustle-wind','5f77b2f9-7acd-4e45-ada2-01d4e95ad954'),
 ('sfx','zipper-backpack','a75a795f-301e-4139-882a-726072b6dceb'),
 ('sfx','zipper-bag','94c7c24e-4016-4861-842c-794fb4610e3f'),
 ('sfx','cup-stir','0f3d91ab-4c8c-4fcf-8a0d-0f22347d4b02'),
 ('sfx','light-switch','8cfeb6dc-d11f-4d3e-ae03-05d0b119f4f5'),
 ('sfx','cassette-case','0a1b7b6e-5314-4f1e-b828-3aaf9c5cce53'),
 ('sfx','kitchen-ambience','c7046bde-6de8-4087-82f5-95d7e9cb4a7f'),
 ('sfx','pan-frying','a8a076c6-1c8b-4cae-8b0b-b3c8bed256db'),
 ('sfx','stairs-steps','d457f31a-d4b9-46c3-8bd7-37dbca3f0e56'),
 ('sfx','market-crowd','7928c8a2-410a-44ad-9b5d-7d160aa0fb42'),
 ('sfx','hard-drive','493382df-d633-49af-a841-4e6b30c00f94'),
 ('sfx','mouse-click','31af539c-a760-411e-accc-f2017a490eca'),
 ('sfx','coin-jar','c91d4fed-0fa2-4b5b-8dbf-bae82b1f22a5'),
 ('sfx','car-door','05a3b3da-5443-44ec-810d-d8531ac6e0d8'),
 ('sfx','fork-plate','3cf5c75e-319b-441e-a1b0-df9549bb579f'),
 ('sfx','modem','1c01ec52-df7e-4883-b36c-cbfaebc9c436'),
 ('sfx','hammer-wood','00c29d68-612f-4067-b90c-aec8937d076a'),
 ('sfx','fire-crackle','166449d3-2ad9-4f48-bbc1-e15887464a56'),
 ('sfx','birds-spring','b08ac690-4664-4a72-8e02-cac4c61badc9'),
 ('sfx','cup-saucer','1b7aa1d2-6b00-41c9-aa72-67bfc5b4e523'),
 ('sfx','dishes-washing','2f8c5f0a-ffcf-4a2e-8528-9cf7bf5de38e'),
 ('sfx','train-station','f852d34d-161d-4fec-9d5c-a2e33aa4c562'),
 ('sfx','fridge-hum','caab533a-1608-4c2a-8e44-7d5c45ba15c2'),
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
