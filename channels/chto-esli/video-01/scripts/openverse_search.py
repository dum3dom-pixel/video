"""Search human-made audio on Openverse (public API, no key) and list candidates.
Usage: python -X utf8 scripts/openverse_search.py "<query>" [source=freesound|jamendo|...] [license=cc0] [n=10] [length=short|medium|long]
Prints id | title | creator | license | seconds | source | direct url."""
import json, sys, urllib.parse, urllib.request
q=sys.argv[1]; src=sys.argv[2] if len(sys.argv)>2 else ''; lic=sys.argv[3] if len(sys.argv)>3 else 'cc0'
n=int(sys.argv[4]) if len(sys.argv)>4 else 10; length=sys.argv[5] if len(sys.argv)>5 else ''
p={'q':q,'license':lic,'page_size':n,'mature':'false'}
if src: p['source']=src
if length: p['length']=length
req=urllib.request.Request('https://api.openverse.org/v1/audio/?'+urllib.parse.urlencode(p),headers={'User-Agent':'Mozilla/5.0'})
d=json.load(urllib.request.urlopen(req,timeout=60))
print(f'## {q} [{src} {lic}] {d.get("result_count")} results')
for r in d['results']:
    print(f"{r['id']} | {r['title'][:45]!r} | {r.get('creator')} | {r['license']} | {round((r.get('duration') or 0)/1000,1)}s | {r['source']} | {r.get('url')}")
