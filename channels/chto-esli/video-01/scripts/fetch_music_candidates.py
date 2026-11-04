"""Downloads candidate music tracks (Openverse -> Jamendo, CC BY / CC0) into assets/audio/candidates/ and cuts
30 s preview excerpts (previews/<slot><n>.mp3). Writes assets/audio/candidates/candidates.json.
Run from video-01: python -X utf8 scripts/fetch_music_candidates.py"""
import json, os, subprocess, urllib.request
UA={'User-Agent':'Mozilla/5.0'}
C={ # slot -> openverse ids (the first one is the default pick)
 'A':['efdf66fb-f850-4ee0-9d3f-ee9091cacd99','150e8d3f-5e77-4108-8dd6-69321873e025','e446ed90-aaa4-4c74-9422-4b75bc6b4471','01555a6f-43b3-4f72-8b48-8d075a98bf1a'],
 'B':['87e75668-f507-44df-9643-c4a0a6c6cf66','c71b29fa-8bc0-44f6-8a75-6591832ce014','2b8ff9a5-00f0-44af-b7f0-18cf94b502ff','311ba94a-3222-4289-80a3-97edc841ebda'],
 'C':['f4acf1a0-a859-44ed-bf36-eef42801f8dd','09bcfdef-d355-4a10-a309-5455d271b94b','ccb49152-9cb0-40b0-ac0c-cb5caeb5ed52','49043d7c-5761-4976-adf6-b77bcb96e7eb'],
 'D':['965aef91-6b5e-476f-98dc-42e115cb30c6','4e1bdf56-6ddd-4d60-9ff3-9eaf39e30fb3','abc86c68-4705-423c-b144-2f3834f352f7','2e034bd5-229b-46c1-84bd-fb8ddeb1833c'],
 'E':['ff858600-04e4-4a79-9fe6-03e278fccace','5d7a84a5-f700-4aeb-93db-b039673e7acc','a5aebbe2-c681-41aa-8f87-3c9b064adede','bf2b6597-2d08-4183-b11e-e2b93a1b0634'],
}
os.makedirs('assets/audio/candidates/previews',exist_ok=True)
out=[]
for slot,ids in C.items():
    for n,i in enumerate(ids,1):
        m=json.load(urllib.request.urlopen(urllib.request.Request(f'https://api.openverse.org/v1/audio/{i}/',headers=UA),timeout=60))
        key=f'{slot}{n}'; path=f'assets/audio/candidates/{key}.mp3'
        if not os.path.exists(path):
            subprocess.run(['curl','-sSL','-A',UA['User-Agent'],'-o',path,m['url']],check=True)  # python's ssl lacks the Jamendo issuer on this machine
        dur=(m.get('duration') or 0)/1000
        ss=max(0,min(dur*.3,dur-32))
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(ss),'-t','30','-i',path,'-af','loudnorm=I=-20:TP=-2,afade=t=in:d=1,afade=t=out:st=28:d=2','-ac','1','-ar','32000','-b:a','72k',f'assets/audio/candidates/previews/{key}.mp3'],check=True)
        rec={'key':key,'slot':slot,'id':i,'title':m['title'],'creator':m.get('creator'),'license':m['license'],'version':m.get('license_version'),
             'license_url':m.get('license_url'),'page':m.get('foreign_landing_url'),'seconds':round(dur,1),'genres':m.get('genres'),'tags':[t['name'] for t in (m.get('tags') or [])][:8]}
        out.append(rec);print(key,rec['title'],'|',rec['creator'],'|',rec['license'],rec['seconds'])
json.dump(out,open('assets/audio/candidates/candidates.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
