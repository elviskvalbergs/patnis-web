import json,sys,re
from bs4 import BeautifulSoup
d=json.load(open('index.json'))
f={p['path']:p['file'] for p in d['pages'] if 'file' in p}
def show(path,n=3500):
    s=BeautifulSoup(open('raw/'+f[path],encoding='utf-8'),'lxml')
    main=s.find(id='block-bootstrap-patnis-content') or s.find('main')
    for t in main(['script','style','svg']): t.decompose()
    # compact structure: tag + classes, text snippets
    out=[]
    def walk(el,depth):
        for c in el.children:
            if getattr(c,'name',None) is None:
                t=c.strip()
                if t: out.append('  '*depth+'"'+t[:80]+'"')
                continue
            cls=' '.join(x for x in c.get('class',[]) if re.match(r'(node|field|paragraph|layout|block|views|webform)',x))[:110]
            attrs=''
            if c.name=='a': attrs=' href='+c.get('href','')[:70]
            if c.name=='img': attrs=' src='+c.get('src','')[:70]
            out.append('  '*depth+'<'+c.name+(' .'+cls if cls else '')+attrs+'>')
            walk(c,depth+1)
    walk(main,0)
    txt='\n'.join(out); print(txt[:n])
show(sys.argv[1], int(sys.argv[2]) if len(sys.argv)>2 else 3500)
