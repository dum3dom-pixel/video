"""Build the local before/after review and verify installed source files."""
import html
import json
import hashlib
from pathlib import Path
from PIL import Image
import sasha_redesign_inventory as inv

def run():
 d=inv.create();inv.refresh(d);cards=[];checks=[]
 for e in d['entries']:
  before=str((inv.BACKUP/Path(e['source']).relative_to('assets')).relative_to(inv.ROOT)).replace('\\','/')
  after=e.get('selected',e['source'])
  ready=e['status']=='installed'
  label='Готово' if ready else 'В очереди'
  cards.append(f'<article data-ready="{str(ready).lower()}"><h2>{html.escape(e["id"])} <small>{label}</small></h2><p>{html.escape(e["group"])}</p><div class="pair"><figure><a href="{before}"><img loading="lazy" src="{before}" alt="До"></a><figcaption>Исходник</figcaption></figure><figure><a href="{after}"><img loading="lazy" src="{after}" alt="После"></a><figcaption>{"Новый бумажный образ" if ready else "Исходник, замена в очереди"}</figcaption></figure></div></article>')
  if ready:
   for dest in e['destinations']:
    path=inv.ROOT/dest
    with Image.open(path) as im: im.verify()
    with Image.open(path) as im: size=list(im.size)
    digest=hashlib.sha256(path.read_bytes()).hexdigest()
    assert digest==e['verification']['sha256'],dest
    backup=inv.BACKUP/Path(dest).relative_to('assets');assert backup.exists(),backup
    checks.append({'file':dest,'size':size,'bytes':path.stat().st_size,'sha256':digest,'backup':str(backup.relative_to(inv.ROOT)).replace('\\','/')})
 count=d['counts']
 page='''<!doctype html><html lang="ru"><meta charset="utf-8"><title>Саша — бумажный редизайн</title><style>body{margin:30px;background:#f1e6cf;color:#393b31;font:16px system-ui}h1{font-size:28px}nav{position:sticky;top:0;padding:14px;background:#f1e6cf;display:flex;gap:12px}button{padding:9px 16px;border:1px solid #7a7f3f;background:#fff8e8;cursor:pointer}article{padding:18px;margin:20px 0;background:#fff8e8;border-radius:12px}h2{font-size:18px;margin:0}small{float:right}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}img{width:100%;display:block}figcaption{margin:6px 0;color:#636653}a{color:#315f60}</style><h1>Саша: новый образ, единый бумажно-картонный стиль</h1>'''
 page+=f'<p>Готово {count["installed"]} из {count["compositions"]} композиций. Файлов с версиями и дублями: {count["files"]}.</p>'
 page+='<p>Эталон материала и внешности — <a href="assets/sheets/sasha_sheet-paper-v1.png">основной бумажный лист</a>. Старые MP4 и обложки в эту миграцию не входят. Все исходники сохранены.</p><nav><button onclick="filter(\'all\')">Все</button><button onclick="filter(\'true\')">Готовые</button><button onclick="filter(\'false\')">Очередь</button><a href="SASHA-REDESIGN.md">Полный перечень</a></nav>'
 page+=''.join(cards)+'''<script>function filter(v){document.querySelectorAll('article').forEach(el=>el.hidden=v!=='all'&&el.dataset.ready!==v)}</script></html>'''
 (inv.ROOT/'sasha-redesign-review.html').write_text(page,encoding='utf-8')
 inv.dump(inv.ROOT/'spec/sasha-paper-file-verification.json',{'counts':count,'checked_files':len(checks),'checks':checks})
 print(json.dumps({'counts':count,'checked_files':len(checks)},ensure_ascii=True))

if __name__=='__main__':run()
