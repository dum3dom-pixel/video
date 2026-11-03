"""Finalize provenance, manifests and final visual-review contact sheets."""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageDraw
import sasha_redesign_inventory as inv

ROOT=inv.ROOT
GEN=ROOT/'spec/identity-generation'/inv.REV

def run():
 data=inv.create()
 assert data['counts']['installed']==data['counts']['compositions']==74
 original_jobs={j['id']:j for j in json.loads((ROOT/'spec/sasha-paper-jobs.json').read_text(encoding='utf-8'))}
 selected_prompts=[]
 for entry in data['entries']:
  asset_id=entry['id'];source=Path(entry['generated_source'])
  prompt_file=None
  for version in [3,2,1]:
   result_file=GEN/f'{asset_id}-paper-v{version}-result.json'
   if result_file.exists():
    r=json.loads(result_file.read_text(encoding='utf-8'))
    if Path(r['source']).resolve()==source.resolve():
     prompt_file=GEN/f'{asset_id}-paper-v{version}.json'
     break
  if prompt_file is None:
   prompt_file=GEN/f'{asset_id}-paper-v1.json'
  assert prompt_file.exists(),prompt_file
  job=json.loads(prompt_file.read_text(encoding='utf-8'))
  # First batch original prompts are also preserved intact in sasha-paper-jobs.json.
  for ref in job['references']:assert Path(ref).exists(),ref
  entry['prompt_file']=str(prompt_file.relative_to(ROOT)).replace('\\','/')
  entry['review']='Accepted after visual comparison with the approved paper sheet and original scene; checked Sasha identity/age, costume, pose, other cast, props, framing and absence of unwanted text/effects.'
  selected_prompts.append({'id':asset_id,'selected':entry['selected'],'generator':'built-in image_gen','prompt_file':entry['prompt_file'],'prompt':job['prompt'],'references':job['references'],'source':entry['generated_source']})
  failure=GEN/f'{asset_id}-failure.json'
  if failure.exists():
   f=json.loads(failure.read_text(encoding='utf-8'));f['resolved']=True;f['selected_source']=entry['generated_source'];inv.dump(failure,f)
 inv.dump(ROOT/'spec/sasha-paper-final-prompts.json',selected_prompts)
 inv.refresh(data)
 # Update the source-asset manifest without changing unrelated raster assets.
 manifest_file=ROOT/'spec/assets-manifest.json'
 manifest=json.loads(manifest_file.read_text(encoding='utf-8-sig'))
 records={r['file']:r for r in manifest}
 for e in data['entries']:
  for dest in e['destinations']+[e['selected']]:
   rel=str(Path(dest).relative_to('assets')).replace('\\','/')
   path=ROOT/dest
   with Image.open(path) as im:
    records[rel]={'file':rel,'width':im.width,'height':im.height,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
 inv.dump(manifest_file,list(records.values()))
 snapshot=json.loads((ROOT/'spec/sasha-paper-unrelated-before.json').read_text(encoding='utf-8'))
 changed=[name for name,digest in snapshot.items() if hashlib.sha256((ROOT/name).read_bytes()).hexdigest()!=digest]
 assert not changed,changed
 contacts=[];out=ROOT/'assets/identity-review'/inv.REV
 for start in range(0,len(data['entries']),24):
  page=Image.new('RGB',(1440,6*190),'#f1e6cf');draw=ImageDraw.Draw(page)
  for i,e in enumerate(data['entries'][start:start+24]):
   with Image.open(ROOT/e['selected']) as im:
    im=im.convert('RGB');im.thumbnail((352,165))
    x=(i%4)*360;y=(i//4)*190
    page.paste(im,(x+(352-im.width)//2,y));draw.text((x+4,y+167),e['id'],fill='#333333')
  dest=out/f'final-contact-{start//24+1}.jpg';page.save(dest,quality=91)
  contacts.append(str(dest.relative_to(ROOT)).replace('\\','/'))
 final={'revision':inv.REV,'generator':'built-in image_gen','status':'complete','counts':data['counts'],'native_generation':True,'local_upscale':False,'image_generation_retries':'Transient network errors for workshop/graduation resolved with built-in image_gen. Rejected visual variants retained separately.','reviewed_compositions':74,'verified_aliases':103,'unrelated_source_files_verified_unchanged':len(snapshot),'unrelated_changes':changed,'contacts':contacts,'inventory':'SASHA-REDESIGN.md','comparison':'sasha-redesign-review.html','prompts':'spec/sasha-paper-final-prompts.json','source_backup':'assets/identity-review/before/'+inv.REV,'existing_mp4':'Not re-rendered; source PNG replacement is active for future preview/render.'}
 inv.dump(ROOT/'spec/sasha-paper-final-review.json',final)
 overall_file=ROOT/'spec/identity-review.json';overall=json.loads(overall_file.read_text(encoding='utf-8-sig'));overall['sasha_redesign_2026_11_03']=final;inv.dump(overall_file,overall)
 review_file=ROOT/'identity-review.html';page=review_file.read_text(encoding='utf-8')
 link='<p><a href="sasha-redesign-review.html">Саша: новый образ в бумажно-картонном стиле — все 74 композиции, сравнения до/после</a></p>'
 if link not in page:
  import re
  if re.search(r'<body[^>]*>',page,flags=re.I):
   page=re.sub(r'(<body[^>]*>)',lambda m:m.group(1)+link,page,count=1,flags=re.I)
  else:
   page=page.replace('</style>','</style>'+link,1)
  review_file.write_text(page,encoding='utf-8')
 # Verify every local gallery image link resolves.
 from html.parser import HTMLParser
 class Images(HTMLParser):
  def handle_starttag(self,tag,attrs):
   if tag=='img':
    src=dict(attrs).get('src');assert src and (ROOT/src).exists(),src
 check=Images();check.feed((ROOT/'sasha-redesign-review.html').read_text(encoding='utf-8'))
 print(json.dumps({'status':final['status'],'counts':data['counts'],'unrelated_unchanged':len(snapshot),'contacts':contacts},ensure_ascii=True))

if __name__=='__main__':run()
