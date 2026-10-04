import json,requests,time
from urllib.parse import quote
d=json.load(open('index.json')); s=requests.Session(); out={}
for p in d['files']:
    try:
        r=s.head('https://patnis.lv'+quote(p,safe='/%?=&'),timeout=20,allow_redirects=True)
        out[p]={'status':r.status_code,'bytes':int(r.headers.get('content-length',0)),'type':r.headers.get('content-type','')}
    except Exception as e: out[p]={'error':str(e)}
    time.sleep(0.1)
json.dump(out,open('files.json','w'),ensure_ascii=False,indent=1)
