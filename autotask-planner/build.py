#!/usr/bin/env python3
"""Sestaví dist/autotask-core.js, dist/bookmarklet.txt a dist/autotask-bookmarks.html ze src/."""
import os, urllib.parse
here=os.path.dirname(os.path.abspath(__file__))
rd=lambda f: open(os.path.join(here,'src',f),encoding='utf8').read()
core=rd('engine.js')+rd('ui.js')
FATAL = r"""
function __atFatal(e){
  try{ console.error('[AutoTask] FATAL', e); }catch(_){}
  try{
    var msg=(e&&e.stack)||String(e);
    try{ var a=JSON.parse(localStorage.getItem('autotask.log')||'[]'); a.push('[FATAL] '+msg); localStorage.setItem('autotask.log',JSON.stringify(a.slice(-800))); }catch(_){}
    var d=document.createElement('div');
    d.style.cssText='position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#ba0517;color:#fff;font:13px/1.4 Arial;padding:10px 14px;white-space:pre-wrap;max-height:40vh;overflow:auto';
    d.textContent='AutoTask Planner – chyba při spuštění:\n'+msg;
    var c=document.createElement('button'); c.textContent='Kopírovat chybu / Copy'; c.style.cssText='display:block;margin-top:8px;padding:5px 10px;cursor:pointer';
    c.onclick=function(){ try{ navigator.clipboard.writeText(msg); }catch(_){} }; d.appendChild(c);
    var x=document.createElement('button'); x.textContent='✕'; x.style.cssText='position:absolute;top:6px;right:8px;cursor:pointer'; x.onclick=function(){ d.remove(); }; d.appendChild(x);
    document.body.appendChild(d);
  }catch(_){ alert('AutoTask Planner chyba: '+e); }
}
"""

head="/* AutoTask Planner v2 (DOM-only, bez Salesforce API). Panel žije v okně Opportunities; skenování a vyplňování běží v jednom pomocném okně (same-origin). */\n"
os.makedirs(os.path.join(here,'dist'),exist_ok=True)
wrapped=head+FATAL+'(async () => { try { await '+core[core.index('(async () => {'):].rstrip()[:-1]+'; } catch (e) { __atFatal(e); } })();\n'
open(os.path.join(here,'dist','autotask-core.js'),'w',encoding='utf8').write(wrapped)
url='javascript:'+urllib.parse.quote(wrapped,safe="()!~*'")
open(os.path.join(here,'dist','bookmarklet.txt'),'w',encoding='utf8').write(url)
open(os.path.join(here,'dist','autotask-bookmarks.html'),'w',encoding='utf8').write(
 '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n    <DT><A HREF="%s">AutoTask Planner</A>\n</DL><p>\n'%url)
print('core',len(wrapped),'bookmarklet',len(url))


# ---------- rozšíření pro Chrome (Manifest V3) ----------
import json, struct, zlib, shutil
ext=os.path.join(here,'dist','extension')
shutil.rmtree(ext,ignore_errors=True); os.makedirs(ext)
body=core.rstrip()
i0=body.index('(async () => {'); assert body.endswith('})();')
open(os.path.join(ext,'core.js'),'w',encoding='utf8').write(head+FATAL+'window.__AUTOTASK_RUN = async () => { try {'+body[i0+len('(async () => {'):-len('})();')]+'} catch (e) { __atFatal(e); } };\n')
open(os.path.join(ext,'launcher.js'),'w',encoding='utf8').write("""(() => {
  if (window.name === 'autotaskChild' || window.top !== window) return;
  const mk = () => {
    if (document.getElementById('autotask-launcher') || !document.body) return;
    const b = document.createElement('button');
    b.id = 'autotask-launcher'; b.textContent = 'AT'; b.title = 'AutoTask Planner';
    b.style.cssText = 'position:fixed;left:14px;bottom:14px;z-index:2147483000;width:42px;height:42px;border-radius:50%;border:0;background:#0176d3;color:#fff;font:700 14px Arial;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.35)';
    b.onclick = () => { try { window.__AUTOTASK_RUN(); } catch (e) { alert('AutoTask Planner: ' + e.message); } };
    document.body.appendChild(b);
  };
  mk(); setInterval(mk, 2000);
})();
""")
open(os.path.join(ext,'background.js'),'w',encoding='utf8').write("""chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({ target: { tabId: tab.id }, world: 'MAIN', func: () => { if (window.__AUTOTASK_RUN) window.__AUTOTASK_RUN(); else alert('AutoTask Planner: otevřete Salesforce (lightning.force.com).'); } });
});
""")
matches=['https://*.lightning.force.com/*']+(os.environ.get('AT_TEST_MATCH','').split(',') if os.environ.get('AT_TEST_MATCH') else [])
json.dump({'manifest_version':3,'name':'AutoTask Planner','version':'2.2','description':'Pomocník pro hromadné vytváření Global Presales Tasků v Salesforce.',
 'permissions':['scripting','activeTab'],'host_permissions':['https://*.lightning.force.com/*'],
 'background':{'service_worker':'background.js'},'action':{'default_title':'AutoTask Planner','default_icon':{'48':'icon48.png'}},
 'icons':{'16':'icon16.png','48':'icon48.png','128':'icon128.png'},
 'content_scripts':[{'matches':matches,'js':['core.js','launcher.js'],'world':'MAIN','run_at':'document_idle','all_frames':False}]},
 open(os.path.join(ext,'manifest.json'),'w',encoding='utf8'),indent=2,ensure_ascii=False)
def png(n):
    rows=b''
    for y in range(n):
        row=b'\x00'
        for x in range(n):
            cx=abs(x-n/2); cy=abs(y-n/2)
            inside=(cx**2+cy**2)<(n/2)**2
            row+=bytes((1,118,211,255)) if inside else bytes((0,0,0,0))
        rows+=row
    def ch(t,d): c=struct.pack('>I',len(d))+t+d; return c+struct.pack('>I',zlib.crc32(t+d)&0xffffffff)
    return b'\x89PNG\r\n\x1a\n'+ch(b'IHDR',struct.pack('>IIBBBBB',n,n,8,6,0,0,0))+ch(b'IDAT',zlib.compress(rows))+ch(b'IEND',b'')
for n in (16,48,128): open(os.path.join(ext,'icon%d.png'%n),'wb').write(png(n))
print('extension built')


# ---------- krátké varianty bookmarkletu (minifikace + gzip) ----------
import subprocess, gzip, base64, re as _re
terser=os.environ.get('AT_TERSER') or shutil.which('terser')
src=open(os.path.join(here,'dist','autotask-core.js'),encoding='utf8').read()
if terser:
    mini=subprocess.run([terser,'-c','-m','--comments','false'],input=src,capture_output=True,text=True,check=True).stdout
else:
    mini=src; print('terser nenalezen – bez minifikace')
open(os.path.join(here,'dist','autotask-snippet.js'),'w',encoding='utf8').write(mini)
light='javascript:'+_re.sub(r'[%#\n\r]|[^\x00-\x7f]',lambda m:urllib.parse.quote(m.group(0)),mini)
open(os.path.join(here,'dist','bookmarklet-mini.txt'),'w',encoding='utf8').write(light)
b64=base64.b64encode(gzip.compress(mini.encode('utf8'),9)).decode()
loader=("(async()=>{try{const b=Uint8Array.from(atob('%s'),c=>c.charCodeAt(0));"
 "const s=await new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('gzip'))).text();"
 "try{(0,eval)(s)}catch(e1){const u=URL.createObjectURL(new Blob([s],{type:'text/javascript'}));const t=document.createElement('script');"
 "t.src=u;t.onerror=()=>alert('AutoTask: stránka blokuje spuštění skriptu (CSP).');document.body.appendChild(t)}}catch(e){alert('AutoTask chyba: '+e.message)}})()")%b64
open(os.path.join(here,'dist','bookmarklet-kratky.js'),'w',encoding='utf8').write(loader)
open(os.path.join(here,'dist','bookmarklet-kratky.txt'),'w',encoding='utf8').write('javascript:'+loader)
open(os.path.join(here,'dist','autotask-bookmarks-kratky.html'),'w',encoding='utf8').write(
 '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n    <DT><A HREF="javascript:%s">AutoTask Planner</A>\n</DL><p>\n'%urllib.parse.quote(loader,safe="()!~*'"))
print('mini',len(mini),'bookmarklet-mini',len(light),'bookmarklet-kratky',len(loader)+11)
