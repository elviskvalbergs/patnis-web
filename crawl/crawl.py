"""Polite BFS crawl of patnis.lv. Saves raw HTML per URL + index.json."""
import json, re, time, hashlib, os, sys
from urllib.parse import urljoin, urlparse, urldefrag, unquote
import requests
from bs4 import BeautifulSoup

BASE = "https://patnis.lv"
HOSTS = {"patnis.lv", "www.patnis.lv"}
SKIP = re.compile(r"^/(core|profiles|admin|user|search|node/add|comment|filter|sites/default/files|modules|themes|libraries)(/|$)")
FILE_EXT = re.compile(r"\.(pdf|docx?|xlsx?|pptx?|jpe?g|png|gif|svg|webp|zip|mp4|mp3)$", re.I)
OUT = "raw"; os.makedirs(OUT, exist_ok=True)
s = requests.Session(); s.headers["User-Agent"] = "Mozilla/5.0 (site-migration-inventory)"

def norm(u):
    u, _ = urldefrag(u)
    p = urlparse(u)
    if p.netloc and p.netloc not in HOSTS: return None
    path = unquote(p.path) or "/"
    if len(path) > 1: path = path.rstrip("/")
    q = ("?" + p.query) if p.query and p.query.startswith("page=") else ""
    return path + q

queue = ["/"]; seen = set(queue); pages = []; files = set(); external = set()
while queue:
    path = queue.pop(0)
    try:
        r = s.get(BASE + path, timeout=30, allow_redirects=True)
    except Exception as e:
        pages.append({"path": path, "error": str(e)}); continue
    final = norm(r.url) if urlparse(r.url).netloc in HOSTS else r.url
    ctype = r.headers.get("content-type", "")
    rec = {"path": path, "status": r.status_code, "final": final, "ctype": ctype}
    if "html" in ctype and r.status_code == 200:
        fn = hashlib.md5(path.encode()).hexdigest() + ".html"
        open(os.path.join(OUT, fn), "w", encoding="utf-8").write(r.text)
        rec["file"] = fn
        soup = BeautifulSoup(r.text, "lxml")
        for a in soup.find_all(["a", "link"], href=True):
            h = a["href"].strip()
            if h.startswith(("mailto:", "tel:", "javascript:", "#")): continue
            full = urljoin(r.url, h)
            pu = urlparse(full)
            if pu.netloc not in HOSTS:
                if a.name == "a" and pu.scheme in ("http", "https"): external.add(full)
                continue
            n = norm(full)
            if not n: continue
            if FILE_EXT.search(n) or n.startswith("/sites/default/files"):
                if a.name == "a": files.add(n)
                continue
            if SKIP.match(n) or a.name == "link": continue
            if n not in seen:
                seen.add(n); queue.append(n)
        for tag in soup.find_all(["img", "source"]):
            for attr in ("src", "data-src"):
                if tag.get(attr):
                    n = norm(urljoin(r.url, tag[attr]))
                    if n and n.startswith("/sites/default/files"): files.add(n)
    pages.append(rec)
    print(len(pages), r.status_code, path, file=sys.stderr)
    time.sleep(0.4)
json.dump({"pages": pages, "files": sorted(files), "external": sorted(external)},
          open("index.json", "w"), ensure_ascii=False, indent=1)
print("pages", len(pages), "files", len(files), "external", len(external))
