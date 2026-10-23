/* AutoTask Planner v2 (DOM-only, bez Salesforce API). Panel žije v okně Opportunities; skenování a vyplňování běží v jednom pomocném okně (same-origin). */

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
window.__AUTOTASK_RUN = async () => { try {
  const ID = 'autotask-planner-panel';
  const existing = document.getElementById(ID);
  if (existing && !window.__AUTOTASK_AUTOLOAD) { existing.remove(); return; }
  if (existing) return;

  const PRODUCTS = ["No Product", "AI InfiniBand", "AIOps APM", "AIOps - Infrastructure (CloudIQ)", "AI Partners & ISVs", "Ansible Modules", "APEX ACP Azure", "APEX ACP OpenShift", "APEX ACP VMware", "APEX Backup Services", "APEX Block Storage", "APEX Cloud Platforms", "APEX DSS File", "APEX File Storage", "APEX Navigator", "APEX Unstructured", "AppSync", "Avamar", "Azure Stack", "BeyondEdge", "Brocade Fabric", "Canonical", "CEPH", "CI", "Cisco", "Cloud Native DP", "Cloud Strategy", "Connectrix", "Container", "CyberSense", "Data Management Frameworks", "Data Mgmt. Partner", "Data Protection Suite", "Data Science", "Data Security Partners", "DDBEA", "DDVE", "Dell AI Data Platform", "Dell AI Factory", "Dell AI Use Cases", "Dell Automation Platform", "Dell Data Lakehouse", "Dell Developer Cloud", "Dell Enterprise Hub", "Dell Enterprise SONiC", "Dell Managed Service", "DLm", "Dorado Software", "DPA", "ECS/ObjectScale", "EI - Cooling", "EI - Power", "Faction", "GPU Servers (AI Optimized)", "HYCU", "IDPA", "Infra Automation Suite", "Infrastructure as Code (IAC)", "Infrastructure Block", "iSeries (AS400)", "Mainframe", "Managed Container Services", "MetalSoft", "Metronode", "NativeEdge", "Networker", "Networking - Edge", "NSX", "Nutanix", "NVIDIA Spectrum", "OpenManage Enterprise", "Open Telecom Ecosystem Lab", "PowerEdge", "PowerFlex", "PowerMax", "PowerPath", "PowerProtect Cyber Recovery", "PowerProtect Data Domain", "PowerProtect Data Manager", "PowerProtect DM5500", "PowerScale", "PowerStore", "PowerSwitch-AI", "PowerSwitch-Core Network", "PowerSwitch-Leaf Network", "PowerVault", "Project Lightning", "RecoverPoint", "Red Hat", "RP4VMS", "SC Series", "SDP", "SDWAN", "Security Services", "SFM", "SmartFabric OS10", "SRM", "Storage Defender CDM", "Superna", "SUSE", "Unity", "Unstruct. Storage Partners", "VCF on VxRail", "VDI", "VEP Series", "VMware", "VPLEX", "VSAN Ready Node", "VxRail", "XtremIO"];
  const AUDIENCES = ['Customer In-person','Customer Remote','Partner In-person','Partner Remote','Internal'];
  const PHASES = [
    { name:'Discover', types:['Requirements Gathering','Technical Deep-Dive','Asset/Workload/Environment'] },
    { name:'Analyze', types:['Product Analysis/Assessment','Workload or App Analysis','Cloud Assessment'] },
    { name:'Design', types:['Solution Design/Validation','Presentation/Proposal Creation','Services Design/Scope','RFP or Bid response'] },
    { name:'Defend', types:['Closing Demo','Competitive/Alternative Compare','Proof of Concept (CSC)','Proposal Review/Presentation'] }
  ];
  const MIN_PER_WEEK = 3;
  let PACE = 1; const BETWEEN_TASKS = 450;

  /* panel zawsze w oknie uruchomienia; CTX = aktywny kontekst operacji (parent lub child) */
  const PDOC = document, PWIN = window;
  let CTX = { doc: document, win: window };

  const norm = s => (s||'').toLowerCase().replace(/\s+/g,' ').trim();
  const txt = (n)=>(n?(n.textContent||'').trim().replace(/\s+/g,' '):'');
  const isVisible = (e)=>!!(e && (e.offsetWidth||e.offsetHeight||(e.getClientRects&&e.getClientRects().length)));
  const el = (tag,props={},css='')=>{ const x=PDOC.createElement(tag); Object.assign(x,props); if(css)x.style.cssText=css; return x; };
  const sleep = (ms)=>new Promise(r=>((CTX.win||window).setTimeout||setTimeout)(r,ms));
  const psleep = (ms)=>new Promise(r=>((CTX.win||window).setTimeout||setTimeout)(r, ms*PACE));
  async function waitFor(fn,timeout=9000,step=200){ const t0=Date.now(); for(;;){ let v; try{v=fn();}catch{v=null;} if(v) return v; if(Date.now()-t0>timeout) return null; await sleep(step); } }
  async function pwaitFor(fn,timeout=6000,step=100){ const t0=Date.now(); while(Date.now()-t0<timeout*Math.max(1,PACE)){ let v; try{v=fn();}catch{v=null;} if(v) return v; await psleep(step); } return null; }
  function deepAll(sel, root){ root=root||CTX.doc; const out=[]; const walk=(node)=>{ let f; try{ f=node.querySelectorAll?node.querySelectorAll(sel):[]; }catch{ f=[]; } f.forEach(n=>out.push(n)); let kids; try{ kids=node.querySelectorAll?node.querySelectorAll('*'):[]; }catch{ kids=[]; } kids.forEach(k=>{ if(k.shadowRoot) walk(k.shadowRoot); }); if(node.shadowRoot) walk(node.shadowRoot); }; walk(root); return out; }
  const deepOne=(sel,root)=>deepAll(sel,root)[0]||null;
  const deepFirst=(sel,root)=>deepAll(sel,root)[0]||null;
  const deepFind=(sel,pred)=>deepAll(sel).find(pred)||null;
  const mouse=(e,type)=>{ const W=CTX.win||window; e.dispatchEvent(new (W.MouseEvent||MouseEvent)(type,{bubbles:true,cancelable:true,view:W,buttons:1})); };
  function sendEnter(e){ const W=CTX.win||window; const o={bubbles:true,cancelable:true,keyCode:13,key:'Enter',which:13}; ['keydown','keypress','keyup'].forEach(t=>e.dispatchEvent(new (W.KeyboardEvent||KeyboardEvent)(t,o))); }
  function nativeSet(input,value,events=['input','change']){ const W=input.ownerDocument&&input.ownerDocument.defaultView||CTX.win||window; const proto=input.tagName==='TEXTAREA'?W.HTMLTextAreaElement.prototype:W.HTMLInputElement.prototype; const d=Object.getOwnPropertyDescriptor(proto,'value'); if(d&&d.set) d.set.call(input,value); else input.value=value; events.forEach(t=>input.dispatchEvent(new (W.Event||Event)(t,{bubbles:true}))); }

  /* ---------- IndexedDB persistence (+ migracja z localStorage) ---------- */
  const DB_NAME='AutoTaskPlanner', STORE='kv', KEY='state', LSKEY='autotask.dom.state';
  function idbOpen(){ return new Promise((res,rej)=>{ let r; try{ r=indexedDB.open(DB_NAME,1); }catch(e){ return rej(e); } r.onupgradeneeded=()=>{ const db=r.result; if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE); }; r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); }
  async function idbGet(key){ const db=await idbOpen(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readonly'); const rq=tx.objectStore(STORE).get(key); rq.onsuccess=()=>res(rq.result); rq.onerror=()=>rej(rq.error); }); }
  async function idbSet(key,val){ const db=await idbOpen(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(val,key); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error); }); }
  let STORAGE='IndexedDB';
  async function loadState(){ let s=null; try{ s=await idbGet(KEY); }catch(e){ STORAGE='localStorage (IndexedDB unavailable)'; } if(!s){ try{ const ls=localStorage.getItem(LSKEY); if(ls){ s=JSON.parse(ls); if(s){ try{ await idbSet(KEY,s); }catch(e){} } } }catch(e){} } return s; }
  function saveState(){ const copy=JSON.parse(JSON.stringify(state)); idbSet(KEY,copy).catch(()=>{ try{ localStorage.setItem(LSKEY, JSON.stringify(copy)); }catch(e){} }); }
  let state = { worklist:[], proposals:[], existing:{}, auto:{running:false,index:0}, settings:{product:'PowerStore',audience:'Customer Remote'} };
  const saved = await loadState();
  if(saved) state = Object.assign(state, saved);
  if(!state.auto) state.auto={running:false,index:0};
  if(!state.proposals) state.proposals=[];
  if(!state.existing) state.existing={};
  if(!state.settings) state.settings={product:'PowerStore',audience:'Customer Remote'};
  if(!state.settings.pace) state.settings.pace='1';
  PACE=+state.settings.pace||1;
  if(!state.settings.lang||state.settings.lang==='pl') state.settings.lang='cs';
  let LANG=state.settings.lang||'cs';
  const L=(cs,en)=>LANG==='en'?en:cs;

  /* ---------- date helpers ---------- */
  const localIso=(d)=>{ const x=new Date(d); return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
  const monday=(d)=>{ const x=new Date(d); x.setHours(12,0,0,0); const day=x.getDay(); x.setDate(x.getDate()-(day===0?6:day-1)); return x; };
  const weekKey=(d)=>localIso(monday(new Date(d)));
  function quarterBounds(d=new Date()){ const y=d.getFullYear(),q=Math.floor(d.getMonth()/3); return {start:new Date(y,q*3,1),end:new Date(y,q*3+3,1)}; }
  function weeksForQuarter(q){ const out=[]; let x=monday(q.start); const last=q.end.getTime(); while(x.getTime()<last){ out.push(new Date(x)); x.setDate(x.getDate()+7); } return out; }
  function fiscalHalfStart(d=new Date()){ const y=d.getFullYear(); const feb=new Date(y,1,1), jul=new Date(y,6,1); if(d>=jul) return jul; if(d>=feb) return feb; return new Date(y-1,6,1); }
  function fiscalHalfBounds(d=new Date()){ const start=fiscalHalfStart(d); const end=start.getMonth()===1?new Date(start.getFullYear(),6,1):new Date(start.getFullYear()+1,1,1); return {start,end}; }
  function countInHalf(tasks){ const b=fiscalHalfBounds(); return tasks.filter(t=>t.dueDate&&t.dueDate>=b.start&&t.dueDate<b.end).length; }
  function weeksForRange(start,end){ const out=[]; let x=monday(start); const last=monday(end).getTime(); while(x.getTime()<=last){ out.push(new Date(x)); x.setDate(x.getDate()+7); } return out; }
  function parseActivityDate(s){ if(!s) return null; s=String(s).trim(); const now=new Date(); let m=s.match(/([A-Za-z]{3,})\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s*(\d{4}))?/) || s.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3,})\.?(?:,?\s*(\d{4}))?/); if(m){ let monStr,day; if(/[A-Za-z]/.test(m[1])){ monStr=m[1]; day=+m[2]; } else { day=+m[1]; monStr=m[2]; } const mon=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(monStr.slice(0,3).toLowerCase()); if(mon>=0){ const y=m[3]?+m[3]:now.getFullYear(); return new Date(y,mon,day,12,0,0); } } let iso=s.match(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/); if(iso){ return new Date(+iso[1],+iso[2]-1,+iso[3],12,0,0); } let num=s.match(/(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})/); if(num){ let a=+num[1],b=+num[2],y=+num[3]; if(y<100) y+=2000; let M,D; if(a>12){ D=a; M=b; } else if(b>12){ M=a; D=b; } else { const fmt=(state.settings&&state.settings.dateFormat)||'auto'; if(/^DD/.test(fmt)){ D=a; M=b; } else { M=a; D=b; } } return new Date(y,M-1,D,12,0,0); } const low=s.toLowerCase(); if(/today|dzi(s|ś)/.test(low)){ const d=new Date(now); d.setHours(12,0,0,0); return d; } if(/yesterday|wczoraj/.test(low)){ const d=new Date(now); d.setDate(d.getDate()-1); d.setHours(12,0,0,0); return d; } if(/tomorrow|jutro/.test(low)){ const d=new Date(now); d.setDate(d.getDate()+1); d.setHours(12,0,0,0); return d; } const d=new Date(s); return isNaN(d)?null:d; }

  const RID_RE=/\/lightning\/r\/(?:[^/]+\/)?([a-zA-Z0-9]{15,18})\/(?:view|related)/;
  function currentRecordId(){ const m=PWIN.location.pathname.match(RID_RE); return m?m[1]:null; }
  function mode(){ const p=PWIN.location.pathname; if(/\/lightning\/o\/Opportunity\/(list|home)/.test(p)) return 'list'; if(/\/lightning\/r\/.+\/(view|related)/.test(p)&&currentRecordId()) return 'record'; return 'other'; }

  /* ---------- okno potomne ---------- */
  let childWin=null;
  function childAlive(){ try{ return !!(childWin && !childWin.closed); }catch{ return false; } }
  function childRecordId(){ try{ const m=(childWin.location.pathname||'').match(RID_RE); return m?m[1]:null; }catch{ return null; } }
  let trace=()=>{};
  function ensureChild(url){ trace('okno: ensureChild '+(url||'')+' (živé: '+childAlive()+')'); if(!childAlive()){ try{ childWin=PWIN.open(url||'about:blank','autotaskChild'); }catch(e){ childWin=null; } } return childWin; }
  function focusChild(){ try{ if(childAlive()) childWin.focus(); }catch(e){} try{ wake.refresh(); }catch(e){} }
  const wake=(()=>{ let active=false; const locks=new Map();
    async function req(w){ try{ if(w&&w.navigator&&('wakeLock'in w.navigator)&&w.document&&w.document.visibilityState==='visible'&&!locks.get(w)){ const sen=await w.navigator.wakeLock.request('screen'); locks.set(w,sen); if(sen&&sen.addEventListener) sen.addEventListener('release',()=>{ if(locks.get(w)===sen) locks.delete(w); }); } }catch(e){} }
    function wins(){ const a=[PWIN]; try{ if(childAlive()&&childWin!==PWIN) a.push(childWin); }catch(e){} return a; }
    function attach(w){ try{ if(w&&w.document&&!w.__atWakeHooked){ w.__atWakeHooked=true; w.document.addEventListener('visibilitychange',()=>{ if(active&&w.document.visibilityState==='visible') req(w); }); } }catch(e){} }
    async function refresh(){ if(!active) return; for(const w of wins()){ attach(w); await req(w); } }
    return { supported:(()=>{ try{ return 'wakeLock' in navigator; }catch(e){ return false; } })(),
      async on(){ active=true; await refresh(); },
      off(){ active=false; for(const [w,sen] of locks){ try{ if(sen&&sen.release) sen.release(); }catch(e){} } locks.clear(); },
      refresh }; })();
  function navChild(url){ trace('okno: navChild '+url+' (živé: '+childAlive()+')'); try{ if(childAlive()) childWin.location.assign(url); else childWin=PWIN.open(url,'autotaskChild'); }catch(e){ childWin=PWIN.open(url,'autotaskChild'); } return childWin; }
  async function waitChildReady(expectId, timeout=25000){ const t0=Date.now(); while(Date.now()-t0<timeout){ if(!childAlive()) return null; try{ const d=childWin.document, rs=d.readyState, id=childRecordId(); if((rs==='complete'||rs==='interactive') && (!expectId||id===expectId)){ const ready=deepAll('.slds-page-header, [role="main"], one-record-home-flexipage2, h1', d).some(isVisible); if(ready){ await sleep(600); return d; } } }catch(e){} await sleep(400); } return childAlive()?childWin.document:null; }
  async function withContext(doc,win,fn){ const prev=CTX; CTX={doc,win}; try{ return await fn(); } finally{ CTX=prev; } }

  /* ---------- skanowanie ---------- */
  function scanList(){
    const rows=[],seen=new Set();
    const links=deepAll('a[href*="/lightning/r/"]', PDOC).filter(a=>/006[A-Za-z0-9]{12,15}/.test(a.getAttribute('href')||''));
    links.forEach(a=>{ const m=(a.getAttribute('href')||'').match(/(006[A-Za-z0-9]{12,15})/); if(!m) return; const id=m[1]; let row=a.closest('tr')||a.closest('[role="row"]'); let node=a; for(let i=0;i<8&&!row;i++){ node=node.parentElement||(node.getRootNode&&node.getRootNode().host); if(node&&node.closest){ row=node.closest('tr')||node.closest('[role="row"]'); } if(!node) break; } const name=txt(a)||id; let stageText='',account='',created=''; if(row){ const cell=(l)=>{ const c=deepOne(`[data-label="${l}"]`,row); return c?txt(c):''; }; const cellRe=(re)=>{ const c=deepAll('[data-label]',row).find(x=>re.test(x.getAttribute('data-label')||'')); return c?txt(c):''; }; account=cell('Account Name'); stageText=cell('Stage')||cellRe(/stage/i); created=cell('Created Date')||cellRe(/created\s*date|^created$|create\s*date/i); } const pm=stageText.match(/(\d{1,3})\s*%/); const prob=pm?+pm[1]:null; if(seen.has(id)) return; seen.add(id); rows.push({ id,name,account,stage:stageText,created,probability:prob,url:PWIN.location.origin+`/lightning/r/Opportunity/${id}/view` }); });
    return rows;
  }
  async function openActivityTab(){ const tab=deepAll('a[role="tab"], li[role="presentation"] a, lightning-tab').find(t=>/^activity$/i.test(txt(t))); if(tab){ tab.click(); await sleep(900); } const countTasks=()=>deepAll('a[href*="/lightning/r/00T"]').length;
    const bodyText=()=>{ try{ return (CTX.doc.body&&CTX.doc.body.innerText)||''; }catch(err){ return ''; } };
    const t0=Date.now(); const got=await waitFor(()=>countTasks()>0||/no past activity|no next steps|no activities to show/i.test(bodyText()),12000,300);
    await waitFor(()=>!deepAll('lightning-spinner, .slds-spinner_container, .slds-spinner').some(isVisible),8000,300);
    trace('sken: aktivity '+(got?(countTasks()>0?'nalezeny (odkazů na tasky: '+countTasks()+')':'prázdné („No past activity“)'):'NENAČTENY do 12 s')+' po '+Math.round((Date.now()-t0)/100)/10+' s');
    let prev=-1; for(let i=0;i<8;i++){ deepAll('a,button').filter(b=>/view all|show (all|more)|load more|more activities|up next|overdue/i.test(txt(b))).slice(0,8).forEach(b=>{ try{b.click();}catch(e){} }); deepAll('.timeline, [class*="activityTimeline"], .pastActivities, .upcomingActivities, .past-activity-groups, .upcoming-activity-groups, [class*="scroller"], .scrollable').forEach(c=>{ try{ c.scrollTop=c.scrollHeight; }catch(e){} }); try{ (CTX.win||window).scrollTo(0,((CTX.doc||document).body||{}).scrollHeight||0); }catch(e){} await sleep(700); const c=countTasks(); if(c===prev && i>=2) break; prev=c; } await sleep(400); return !!deepOne('.pastActivities, .past-activity-groups, .upcomingActivities, .upcoming-activity-groups, .timeline') || countTasks()>0; }
  function scanActivities(){ const tasks=[]; const seenEl=new Set(); const seenId=new Set(); const sel='.pastActivities .row.Task, .past-activity-groups .row.Task, .upcomingActivities .row.Task, .upcoming-activity-groups .row.Task, [class*="activityTimeline"] [class*="Task"], .timeline .row.Task'; const rows=deepAll(sel); deepAll('a[href*="/lightning/r/00T"]').forEach(a=>{ const r=(a.closest&&(a.closest('.row')||a.closest('li')||a.closest('.slds-timeline__item')))||a; rows.push(r); }); rows.forEach(r=>{ if(!r||seenEl.has(r)) return; seenEl.add(r); const link=deepOne('a[href*="/lightning/r/00T"], a.subjectLink',r); const href=link&&(link.getAttribute('href')||''); const idm=href&&href.match(/(00T[0-9A-Za-z]{12,15})/); const id=idm?idm[1]:null; if(id){ if(seenId.has(id)) return; seenId.add(id); } const subj=txt(deepOne('.subjectText, .subjectLink',r))||txt(link); if(!subj) return; let due=txt(deepOne('.dueDate, [class*="dueDate"], [class*="DueDate"]',r)); if(!due){ const mt=(txt(r)||'').match(/(\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}|\d{1,2}[-\/.]\d{1,2}[-\/.]\d{2,4}|[A-Za-z]{3,}\.?\s+\d{1,2}(?:,?\s*\d{4})?|\d{1,2}\s+[A-Za-z]{3,}(?:,?\s*\d{4})?)/); due=mt?mt[1]:''; } tasks.push({ id, subject:subj, due, dueDate:parseActivityDate(due) }); }); return tasks; }
  function phaseRank(subject){ const s=(subject||'').toLowerCase(); if(/requirement|deep.?dive|workload|environment|discover|lead.?in/.test(s)) return 0; if(/assess|analysis|analyz|cloud/.test(s)) return 1; if(/design|proposal|presentation|rfp|scope|validation/.test(s)) return 2; if(/demo|proof|poc|competitive|alternative|defend|review/.test(s)) return 3; return -1; }
  /* hooky pro UI */
  let onProgress=()=>{};
  function missingFields(p){ const m=[]; if(!p.date) m.push('Due Date'); if(!p.status) m.push('Status'); if(!p.phase) m.push('Category'); if(!p.type) m.push('Task Type'); if(!p.audience) m.push('Audience'); if(!p.product) m.push('Product'); if(!p.priority) m.push('Priority'); if(!(p.subject||'').trim()) m.push('Subject'); return m; }
  const mkId=()=>'m-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  const STATUSES=['Completed','Not Started','In Progress','Waiting on someone else','Deferred'];
  function mergeProposals(oppId, props){ const keep=state.proposals.filter(p=>p.oppId===oppId&&p.manual&&!p.created); state.proposals=state.proposals.filter(p=>p.oppId!==oppId).concat(props,keep); }
  function buildProposals(opp, existingTasks){ const startIso=state.settings.rangeStart||localIso(fiscalHalfStart()); const endIso=state.settings.rangeEnd||localIso(new Date()); const perWeek=Math.max(1,+state.settings.perWeek||3); const weeks=weeksForRange(new Date(startIso+'T12:00:00'), new Date(endIso+'T12:00:00')); let maxRank=-1; existingTasks.forEach(t=>{ const r=phaseRank(t.subject); if(r>maxRank) maxRank=r; }); let planIndex=maxRank+1; const out=[]; weeks.forEach((w,wi)=>{ const key=weekKey(w); const count=existingTasks.filter(t=>t.dueDate&&weekKey(t.dueDate)===key).length; const need=Math.max(0,perWeek-count); const phase=PHASES[Math.min(planIndex+wi,PHASES.length-1)]; for(let slot=0;slot<need;slot++){ const date=new Date(w); date.setDate(date.getDate()+Math.min(4,slot+1)); let di=localIso(date); if(di<startIso) di=startIso; if(di>endIso) di=endIso; const type=phase.types[slot%phase.types.length]; out.push({ id:'p-'+opp.id+'-'+di+'-'+slot, oppId:opp.id, oppName:opp.name, week:key, date:di, phase:phase.name, type, subject:phase.name+' - '+type, product:state.settings.product, audience:state.settings.audience, status:state.settings.status||'Completed', priority:state.settings.priority||'Normal' }); } }); return out; }

  /* ---------- kreator Global Presales Task (Aura; dziala na CTX) ---------- */
  function menuOpen(){ return deepAll('a.select[aria-expanded="true"], div.uiMenuList.visible').some(isVisible); }
  function composerOpen(){ return deepAll('input[aria-label="Subject"]').some(isVisible); }
  function findSaveButton(){ return deepAll('button').find(b=>isVisible(b)&&/^save$/i.test(((b.getAttribute&&b.getAttribute('title'))||b.textContent||'').trim())); }
  function diag(){ try{ const bs=deepAll('button').filter(isVisible).map(b=>((b.getAttribute&&b.getAttribute('title'))||b.textContent||'').trim().replace(/\s+/g,' ')).filter(Boolean).slice(0,40); return '\n   DIAG url='+((CTX.win||window).location.pathname)+'\n   viditelná tlačítka: '+bs.join(' ; '); }catch(err){ return ''; } }
  async function openForm(logfn){ try{ return await openFormRaw(logfn); }catch(err){ err.message+=diag(); throw err; } }
  async function openFormRaw(logfn){ try{ if(CTX.win&&CTX.win!==PWIN) CTX.win.focus(); }catch(e){} const menuBtn=await pwaitFor(()=>deepFirst('button[title="More Standard Task Actions"]'),4000); if(!menuBtn) throw new Error(L('Nenalezeno „More Standard Task Actions" (otevřete opty se záložkou Activity).','"More Standard Task Actions" not found (open an opportunity with the Activity tab).')); menuBtn.focus(); menuBtn.click(); const item=await pwaitFor(()=>deepFind('a[role="menuitem"]',a=>a.textContent.includes('Global Presales Task')),4000); if(!item) throw new Error(L('V menu nebyla nalezena položka „Global Presales Task".','"Global Presales Task" item not found in the menu.')); item.focus(); item.click(); await waitForFormReady(); const max=deepFirst('button[title="Maximize"]'); if(max){ max.focus(); max.click(); await psleep(500); await waitForFormReady(); } if(logfn) logfn(L('Formulář otevřen.','Form opened.')); }
  async function waitForFormReady(){ const subj=await pwaitFor(()=>deepFind('input[aria-label="Subject"]',isVisible),8000); if(!subj) throw new Error(L('Formulář se nevykreslil (chybí pole Subject).','Form did not render (no Subject field).')); await pwaitFor(()=>deepAll('a.select').some(a=>['Not Started','Completed'].includes(a.textContent.trim())&&isVisible(a)),6000); await pwaitFor(()=>!deepAll('lightning-spinner, .slds-spinner_container, .slds-spinner').some(isVisible),8000); await psleep(600); }
  function setSubject(text){ const input=deepFirst('input[aria-label="Subject"]'); if(!input) throw new Error('Chybí pole Subject.'); nativeSet(input,text,['input','change']); }
  function dueDateEl(){ const label=[...CTX.doc.querySelectorAll('label')].find(l=>l.textContent.includes('Due Date')); const container=label&&label.closest('.slds-form-element'); return (container&&container.querySelector('input.slds-input'))||CTX.doc.querySelector('lightning-datepicker input.slds-input')||null; }
  function fmtFromHelperText(iso){ const parts=String(iso).split('-'); if(parts.length!==3) return null; const [Y,M,D]=parts; const el=dueDateEl(); const cont=el&&el.closest&&el.closest('.slds-form-element'); const t=cont?txt(cont):''; let m=t.match(/Format:\s*31([^\d])12\1(\d{4})/); if(m) return D+m[1]+M+m[1]+Y; m=t.match(/Format:\s*12([^\d])31\1(\d{4})/); if(m) return M+m[1]+D+m[1]+Y; m=t.match(/Format:\s*(\d{4})([^\d])12\2\s*31/); if(m) return Y+m[2]+M+m[2]+D; return null; }
  function fmtGuessFromPlaceholder(iso){ const parts=String(iso).split('-'); if(parts.length!==3) return null; const [Y,M,D]=parts; const fh=fmtFromHelperText(iso); if(fh) return fh; const el=dueDateEl(); let ph=(el&&(el.getAttribute('placeholder')||el.placeholder)||'').trim(); if(!ph) return null; const low=ph.toLowerCase(); const sepM=ph.match(/[^A-Za-z0-9]/); const sep=sepM?sepM[0]:'/'; const iD=low.indexOf('d'), iM=low.indexOf('m'), iY=low.indexOf('y'); const order=[['d',iD],['m',iM],['y',iY]].filter(x=>x[1]>=0).sort((a,b)=>a[1]-b[1]).map(x=>x[0]); if(order.length!==3) return null; const map={d:D,m:M,y:Y}; return order.map(k=>map[k]).join(sep); }
  function fmtForPicker(iso){ const parts=String(iso).split('-'); if(parts.length!==3) return iso; const [Y,M,D]=parts; const fmt=(state.settings&&state.settings.dateFormat)||'auto'; if(fmt!=='auto'){ switch(fmt){ case 'MM/DD/YYYY': return M+'/'+D+'/'+Y; case 'DD/MM/YYYY': return D+'/'+M+'/'+Y; case 'YYYY-MM-DD': return Y+'-'+M+'-'+D; case 'DD.MM.YYYY': return D+'.'+M+'.'+Y; case 'DD-MM-YYYY': return D+'-'+M+'-'+Y; default: break; } } const g=fmtGuessFromPlaceholder(iso); return g||(M+'/'+D+'/'+Y); }
  function dateCandidates(iso){ const parts=String(iso).split('-'); if(parts.length!==3) return [iso]; const [Y,M,D]=parts; const all={'MM/DD/YYYY':M+'/'+D+'/'+Y,'DD/MM/YYYY':D+'/'+M+'/'+Y,'YYYY-MM-DD':Y+'-'+M+'-'+D,'DD.MM.YYYY':D+'.'+M+'.'+Y,'DD-MM-YYYY':D+'-'+M+'-'+Y}; const fmt=(state.settings&&state.settings.dateFormat)||'auto'; if(fmt!=='auto'&&all[fmt]) return [all[fmt]]; const g=fmtGuessFromPlaceholder(iso); const order=[g,all['YYYY-MM-DD'],all['MM/DD/YYYY'],all['DD/MM/YYYY'],all['DD.MM.YYYY'],all['DD-MM-YYYY']].filter(Boolean); return [...new Set(order)]; }
  function dueFormatError(){ const el=dueDateEl(); if(!el) return false; const cont=el.closest&&el.closest('.slds-form-element'); if(cont){ if(/slds-has-error/.test(cont.className||'')){ const err=cont.querySelector('.slds-form-element__help, [role="alert"]'); if(err&&/match|format|pasuje|niepoprawn|invalid|poprawn/i.test(txt(err))) return true; } } if(el.getAttribute&&/match|format|invalid/i.test(el.getAttribute('aria-errormessage')||'')) return true; return false; }
  function formatIso(iso, fmtStr){ const parts=String(iso).split('-'); if(parts.length!==3) return null; const [Y,M,D]=parts; return fmtStr.replace(/YYYY/,Y).replace(/DD/,D).replace(/MM/,M); }
  function fmtFromErrorExample(){ const el=dueDateEl(); if(!el) return null; const cont=el.closest&&el.closest('.slds-form-element'); const errEl=cont&&cont.querySelector('.slds-form-element__help, [role="alert"]'); const msg=errEl?txt(errEl):''; if(!msg) return null; const m=msg.match(/(\d{1,4})([^0-9A-Za-z])(\d{1,2})\2(\d{1,4})/); if(!m) return null; const strs=[m[1],m[3],m[4]]; const nums=strs.map(Number); const sep=m[2]; let yi=strs.findIndex(s=>s.length===4); if(yi<0) yi=nums.findIndex(n=>n>31); if(yi<0) return null; let di=[0,1,2].find(i=>i!==yi&&nums[i]>12); if(di==null) di=[0,1,2].find(i=>i!==yi); const mi=[0,1,2].find(i=>i!==yi&&i!==di); const tok={}; tok[yi]='YYYY'; tok[di]='DD'; tok[mi]='MM'; return [tok[0],tok[1],tok[2]].join(sep); }
  function applyDue(input,str){ const W=input.ownerDocument&&input.ownerDocument.defaultView||CTX.win||window; input.focus(); nativeSet(input,'',['input']); nativeSet(input,str,['input','change']); const ko={bubbles:true,cancelable:true,keyCode:13,key:'Enter',which:13,view:W}; ['keydown','keyup'].forEach(t=>input.dispatchEvent(new (W.KeyboardEvent||KeyboardEvent)(t,ko))); input.dispatchEvent(new (W.Event||Event)('change',{bubbles:true})); input.dispatchEvent(new (W.Event||Event)('blur',{bubbles:true})); }
  function setDueDate(value){ const input=dueDateEl(); if(!input) throw new Error(L('Chybí pole Due Date.','Due Date field not found.')); applyDue(input, fmtForPicker(value)); return input; }
  async function ensureDueDate(value, logfn){ const input=dueDateEl(); if(!input){ if(logfn) logfn(L('Chybí pole Due Date.','Due Date field not found.')); return false; } let cands=dateCandidates(value); const tried=new Set(); let i=0; while(i<cands.length && tried.size<8){ const cand=cands[i++]; if(cand==null||tried.has(cand)) continue; tried.add(cand); applyDue(input, cand); await psleep(450); const v=(input.value||'').trim(); const err=dueFormatError(); if(v && !err){ if(logfn && tried.size>1) logfn(L('  Due Date — přijatý formát: ','  Due Date — accepted format: ')+cand); return true; } const efmt=fmtFromErrorExample(); if(efmt){ const ec=formatIso(value, efmt); if(ec && !tried.has(ec)){ cands.splice(i,0,ec); if(logfn) logfn(L('  Due Date — SF vyžaduje formát ','  Due Date — SF expects format ')+efmt+' → '+ec); continue; } } if(logfn) logfn(L('  Due Date odmítnut (','  Due Date rejected (')+cand+'): '+(err?L('špatný formát','bad format'):L('prázdné','empty'))); } const el2=dueDateEl(); return !!(el2&&(el2.value||'').trim()) && !dueFormatError(); }
  function clearReminder(){ for(const host of deepAll('lightning-primitive-input-checkbox')){ const lbl=deepFirst('span.slds-form-element__label',host.shadowRoot||host); if(!lbl||lbl.textContent.trim()!=='Reminder Set') continue; const cb=(host.shadowRoot||host).querySelector('input[type="checkbox"]'); if(cb&&(cb.checked||host.hasAttribute('checked'))){ const W=CTX.win||window; cb.checked=false; host.removeAttribute('checked'); cb.dispatchEvent(new (W.Event||Event)('change',{bubbles:true,composed:true})); cb.dispatchEvent(new (W.Event||Event)('click',{bubbles:true,composed:true})); } return; } }
  async function changeDropdown(from,to,logfn){ const findLink=(label)=>deepAll('a.select').find(a=>a.textContent.trim()===label&&isVisible(a)); for(let attempt=1;attempt<=3;attempt++){ const link=await pwaitFor(()=>findLink(from),5000); if(!link) return !!findLink(to); ['mousedown','mouseup','click'].forEach(t=>mouse(link,t)); await psleep(500); const node=await pwaitFor(()=>deepFind('a, li, span, div, [role="menuitem"], [role="option"]',e=>e.textContent.trim()===to&&isVisible(e)&&e!==link),3000); if(node){ const target=node.closest('a, li, [role="menuitem"], [role="option"]')||node; ['pointerover','pointerenter','mouseover','mouseenter','mousemove'].forEach(t=>mouse(target,t)); await psleep(200); ['mousedown','mouseup','click'].forEach(t=>mouse(target,t)); await psleep(500); if(!findLink(to)&&menuOpen()){ sendEnter((CTX.doc&&CTX.doc.activeElement)||link); await psleep(500); } } if(menuOpen()){ const open=deepAll('a.select[aria-expanded="true"]').find(isVisible); if(open) ['mousedown','mouseup','click'].forEach(t=>mouse(open,t)); await psleep(300); } const ok=await pwaitFor(()=>findLink(to),1500); if(logfn) logfn(L(`  [${from} → ${to}] pokus ${attempt}: ${ok?'nastaveno':'NE'}`,`  [${from} -> ${to}] attempt ${attempt}: ${ok?'set':'NO'}`)); if(ok&&!menuOpen()) return true; await psleep(500); } return false; }
  async function moveInDualListbox(text){ const W=CTX.win||window; const opts=deepAll('div[role="option"]').filter(isVisible); const opt=opts.find(o=>o.textContent.trim()===text)||opts.find(o=>o.textContent.trim().includes(text)); if(!opt) return false; opt.focus(); await psleep(300); opt.focus(); opt.dispatchEvent(new (W.KeyboardEvent||KeyboardEvent)('keydown',{bubbles:true,cancelable:true,view:W,ctrlKey:true,keyCode:39,key:'ArrowRight',which:39})); await psleep(300); return true; }
  async function fillOneTask(p, logfn){ await openForm(logfn); clearReminder(); await psleep(500); await ensureDueDate(p.date, logfn); await psleep(300); setSubject(p.subject); await psleep(500); logfn(L('Reminder, Due Date, Subject: OK','Reminder, Due Date, Subject: OK')); const wantSt=p.status||'Completed'; if(wantSt!=='Not Started'){ const st=await changeDropdown('Not Started', wantSt, logfn); logfn('Status -> '+wantSt+': '+(st?'OK':L('NE','NO'))); if(!st) throw new Error(L('Nepodařilo se nastavit status: ','Could not set status: ')+wantSt); } const cat=await changeDropdown('--None--', p.phase, logfn); logfn('Category -> '+p.phase+': '+(cat?'OK':L('NE','NO'))); if(!cat) throw new Error(L('Nepodařilo se nastavit Category: ','Could not set Category: ')+p.phase); const tt=await changeDropdown('--None--', p.type, logfn); logfn('Task Type -> '+p.type+': '+(tt?'OK':L('NE','NO'))); if(!tt) throw new Error(L('Nepodařilo se nastavit Task Type: ','Could not set Task Type: ')+p.type); const au=await moveInDualListbox(p.audience); logfn('Audience -> '+p.audience+': '+(au?'OK':L('NE','NO'))); const pr=await moveInDualListbox(p.product); logfn('Product -> '+p.product+': '+(pr?'OK':L('NE','NO'))); const wantPr=p.priority||'Normal'; if(wantPr!=='Normal'){ const pri=await changeDropdown('Normal', wantPr, logfn); logfn('Priority -> '+wantPr+': '+(pri?'OK':L('NE','NO'))); if(!pri) throw new Error(L('Nepodařilo se nastavit Priority: ','Could not set Priority: ')+wantPr); }
    if(p.comment){ try{ const host=deepAll('.slds-form-element').find(x=>/Actions\s*\/\s*Comments/i.test(txt(x))&&deepOne('textarea',x)); const ta=host&&deepOne('textarea',host); if(ta){ nativeSet(ta,p.comment,['input','change']); logfn('Comments: OK'); } else logfn('Comments: '+L('pole nenalezeno','field not found')); }catch(err){ logfn('Comments: '+err.message); } } return {audience:au, product:pr}; }
  async function fillAndSave(p, autosave, logfn){ await fillOneTask(p, logfn); const ddEl=dueDateEl(); const ddOk=!!(ddEl&&(ddEl.value||'').trim())&&!dueFormatError(); logfn(L('Due Date před uložením: ','Due Date before save: ')+(ddOk?'OK ('+p.date+')':L('CHYBÍ!','MISSING!'))); await psleep(300); if(autosave){ if(!ddOk){ logfn(L('Automatické ukládání přerušeno — Due Date je prázdné.','Auto-save aborted — Due Date empty.')); return false; } const s=findSaveButton(); if(s){ s.click();
      const toastTxt=()=>{ try{ return deepAll('.slds-notify_toast, .toastContainer, [role="alertdialog"], lightning-toast').filter(isVisible).map(txt).join(' | '); }catch(err){ return ''; } };
      const errTxt=()=>{ try{ return deepAll('.slds-has-error .slds-form-element__help, .pageLevelErrors, .errorsList, [role="alert"], .slds-form-element__help[class*="error"]').filter(isVisible).map(txt).filter(Boolean).join(' | '); }catch(err){ return ''; } };
      let res='unknown', info=''; const t0=Date.now();
      while(Date.now()-t0<18000*Math.max(1,PACE)){ await psleep(250);
        const tt=toastTxt(); if(/was created|byl.? vytvo|created/i.test(tt)){ res='ok'; info=tt; break; }
        if(!composerOpen()){ res='ok'; info=tt||'formulář se zavřel'; break; }
        const et=errTxt(); if(et&&!deepAll('lightning-spinner, .slds-spinner_container, .slds-spinner').some(isVisible)){ res='error'; info=et; break; } }
      await pwaitFor(()=>!deepAll('lightning-spinner, .slds-spinner_container, .slds-spinner').some(isVisible),8000);
      if(res==='ok'){ logfn(L('Uloženo ✓ — ','Saved ✓ — ')+p.subject+(info?'  ['+info.slice(0,120)+']':'')); return true; }
      if(res==='error'){ logfn(L('Save selhal – chyba ve formuláři: ','Save failed – form error: ')+info.slice(0,300)); const e2=new Error(L('Save selhal: ','Save failed: ')+info.slice(0,200)); e2.noRetry=true; throw e2; }
      logfn(L('Save kliknut, výsledek nelze potvrdit (formulář zůstal otevřený, bez chyby ani potvrzení). Zkontrolujte v Salesforce, zda task vznikl. Toast: ','Save clicked, outcome unconfirmed (form still open, no error, no toast). Check in Salesforce whether the task exists. Toast: ')+(toastTxt()||'—')); const e3=new Error(L('Výsledek uložení nelze potvrdit – zkontrolujte v Salesforce.','Save outcome unconfirmed – check Salesforce.')); e3.noRetry=true; throw e3; } logfn(L('Tlačítko Save nenalezeno — uložte ručně.','No Save button — save manually.')); return false; } logfn(L('Zkontrolujte a klikněte na Save v otevřeném okně...','Review and click Save in the open window...')); const closed=await pwaitFor(()=>!composerOpen(),120000); return closed; }

  /* ---------- orkiestracja przez okno potomne ---------- */
  let scanRunning=false, batchRunning=false;
  async function scanOppInChild(opp){ navChild(opp.url); if(!childAlive()) throw new Error(L('Pomocné okno je zablokované (popup).','Child window blocked (popup).')); const d=await waitChildReady(opp.id); if(!d) throw new Error(L('Okno nenačetlo optu.','Window did not load the opportunity.')); focusChild(); return withContext(childWin.document, childWin, async()=>{ await openActivityTab(); await sleep(400); const tasks=scanActivities(); const props=buildProposals({id:opp.id,name:opp.name}, tasks); mergeProposals(opp.id, props); state.existing[opp.id]={ name:opp.name, halfCount:countInHalf(tasks), tasks:tasks.map(t=>({subject:t.subject, due:t.due||'', week:t.dueDate?weekKey(t.dueDate):'', dueIso:t.dueDate?localIso(t.dueDate):''})) }; const w=state.worklist.find(x=>x.id===opp.id); if(w) w.done=true; saveState(); return { count:tasks.length, props:props.length }; }); }
  async function scanQueueInChild(){ if(!state.worklist.length){ alert(L('Fronta je prázdná. Naskenujte seznam a přidejte opty.','Queue is empty. Scan the list and add opportunities.')); return; } scanRunning=true; let ok=0,fail=0; await wake.on(); for(let i=0;i<state.worklist.length;i++){ if(!scanRunning){ log(L('Skenování přerušeno.','Scan interrupted.')); break; } const opp=state.worklist[i]; setStatus(L(`Skenuji v pomocném okně ${i+1}/${state.worklist.length}: ${opp.name}`,`Scanning in child window ${i+1}/${state.worklist.length}: ${opp.name}`)); try{ const r=await scanOppInChild(opp); log(L(`${opp.name}: tasků ${r.count}, návrhů ${r.props}.`,`${opp.name}: tasks ${r.count}, proposals ${r.props}.`)); ok++; }catch(e){ fail++; log(L('CHYBA (','ERROR (')+opp.name+'): '+e.message); } renderQueue(); onProgress(i+1,state.worklist.length,ok,fail); } scanRunning=false; wake.off(); setStatus(L(`Skenování dokončeno. OK: ${ok}, chyby: ${fail}. Návrhů: ${scopedProposals().length}. Zkontrolujte plán a vytvořte tasky.`,`Scan complete. OK: ${ok}, errors: ${fail}. Proposals: ${scopedProposals().length}. Select tasks and "Fill selected".`)); try{ gotoTab('plan'); }catch(e){} renderAll(); }
  async function createTaskOnce(p, autosave, logfn){ if(mode()==='list'){ if(childRecordId()!==p.oppId){ navChild(PWIN.location.origin+`/lightning/r/Opportunity/${p.oppId}/view`); if(!childAlive()) throw new Error('Pomocné okno je zablokované (popup).'); await waitChildReady(p.oppId); } if(!childAlive()) throw new Error('Pomocné okno je zablokované (popup).'); focusChild(); await psleep(150); return withContext(childWin.document, childWin, ()=>fillAndSave(p, autosave, logfn)); } return fillAndSave(p, autosave, logfn); }
  async function createTaskForProposal(p, autosave, logfn){ for(let a=0;;a++){ try{ return await createTaskOnce(p, autosave, logfn); }catch(e){ if(e.noRetry||a>=1||!batchRunning&&!p.__single) throw e; logfn(L('↻ Chyba, zkouším znovu: ','↻ Error, retrying: ')+e.message); if(mode()==='list'&&childAlive()){ navChild(PWIN.location.origin+`/lightning/r/Opportunity/${p.oppId}/view`); await waitChildReady(p.oppId); } } } }
  async function fillSelected(chosen, autosave, logfn, setStatusFn){ batchRunning=true; let ok=0, fail=0; await wake.on(); chosen.sort((a,b)=>(a.oppId+a.date).localeCompare(b.oppId+b.date)); for(let i=0;i<chosen.length;i++){ if(!batchRunning){ logfn(L('Zastaveno uživatelem.','Stopped by user.')); break; } const p=chosen[i]; setStatusFn(L(`Vyplňuji ${i+1}/${chosen.length}: ${p.oppName} — ${p.subject}`,`Filling ${i+1}/${chosen.length}: ${p.oppName} — ${p.subject}`)); try{ p.error=''; const okk=await createTaskForProposal(p, autosave, logfn); if(okk){ ok++; p.created=true; } else fail++; saveState(); }catch(e){ fail++; p.error=e.message; saveState(); logfn(L('CHYBA: ','ERROR: ')+e.message); if(e.noRetry){ logfn(L('Dávka zastavena kvůli chybě uložení – formulář nechávám otevřený.','Batch stopped due to a save error – form left open.')); batchRunning=false; } } onProgress(i+1,chosen.length,ok,fail); if(i<chosen.length-1 && batchRunning){ await psleep(BETWEEN_TASKS); } } batchRunning=false; wake.off(); setStatusFn(L(`Hotovo. OK: ${ok}, chyby/přeskočeno: ${fail}.`,`Done. OK: ${ok}, errors/skipped: ${fail}.`)); }
  async function processCurrentRecord(){ const rid=currentRecordId(); if(!rid) return null; await openActivityTab(); await sleep(400); const tasks=scanActivities(); const w=state.worklist.find(x=>x.id===rid); const opp={ id:rid, name:(w&&w.name)||txt(deepOne('h1, lightning-formatted-text'))||rid }; const props=buildProposals(opp,tasks); mergeProposals(rid, props); state.existing[rid]={ name:opp.name, halfCount:countInHalf(tasks), tasks:tasks.map(t=>({subject:t.subject, due:t.due||'', week:t.dueDate?weekKey(t.dueDate):'', dueIso:t.dueDate?localIso(t.dueDate):''})) }; if(w) w.done=true; saveState(); return { count:tasks.length, props:props.length }; }

  /* ======================================================================
     GRAFICKÉ ROZHRANÍ  (karty, záložky, hromadné úpravy, přehled týdnů)
     ====================================================================== */
  const ACCENT = '#0176d3';
  const css = `
  #${ID}{--ac:${ACCENT};--dk:#032d60;--bg:#f3f6fb;--card:#fff;--bd:#d8dde6;--tx:#172b4d;--mu:#5b6b7f;--ok:#2e844a;--wa:#dd7a01;--er:#ba0517;
    position:fixed;inset:2.5vh 2.5vw;max-width:1500px;margin:0 auto;z-index:2147483647;background:var(--bg);color:var(--tx);border-radius:14px;
    box-shadow:0 12px 48px rgba(3,45,96,.45);display:flex;flex-direction:column;font:13px/1.4 -apple-system,"Segoe UI",Roboto,Arial,sans-serif;overflow:hidden;text-align:left}
  #${ID}.mini{inset:auto 18px 18px auto;width:360px;max-width:92vw}
  #${ID}.mini .at-tabs,#${ID}.mini .at-main,#${ID}.mini .at-log,#${ID}.mini .at-chips{display:none}
  #${ID} *{box-sizing:border-box;font-family:inherit}
  #${ID} .at-head{background:linear-gradient(90deg,var(--dk),#0b5cab);color:#fff;padding:10px 16px;display:flex;align-items:center;gap:14px}
  #${ID} .at-logo{font-weight:700;font-size:16px;letter-spacing:.2px;display:flex;align-items:center;gap:8px}
  #${ID} .at-logo i{font-style:normal;background:#fff;color:var(--dk);border-radius:6px;padding:1px 7px;font-size:13px}
  #${ID} .at-chips{display:flex;gap:8px;flex:1;flex-wrap:wrap}
  #${ID} .at-chip{background:rgba(255,255,255,.14);border-radius:14px;padding:3px 10px;font-size:12px;white-space:nowrap}
  #${ID} .at-chip b{font-size:13px}
  #${ID} .at-hbtn{background:rgba(255,255,255,.14);border:0;color:#fff;border-radius:6px;min-width:30px;height:28px;cursor:pointer;font-size:15px;padding:0 8px}
  #${ID} .at-hbtn:hover{background:rgba(255,255,255,.28)}
  #${ID} .at-head select{background:rgba(255,255,255,.14);color:#fff;border:0;border-radius:6px;height:28px;padding:0 6px}
  #${ID} .at-head select option{color:#000}
  #${ID} .at-tabs{display:flex;gap:4px;padding:10px 16px 0;background:var(--card);border-bottom:1px solid var(--bd)}
  #${ID} .at-tab{border:0;background:none;padding:9px 16px;font-size:14px;font-weight:600;color:var(--mu);cursor:pointer;border-bottom:3px solid transparent;display:flex;align-items:center;gap:8px}
  #${ID} .at-tab .n{background:#e5e9ef;color:var(--tx);border-radius:10px;font-size:11px;padding:0 7px}
  #${ID} .at-tab.on{color:var(--ac);border-color:var(--ac)}
  #${ID} .at-tab.on .n{background:var(--ac);color:#fff}
  #${ID} .at-main{flex:1;overflow:auto;padding:16px}
  #${ID} .card{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:14px;margin-bottom:14px}
  #${ID} .card>h3{margin:0 0 10px;font-size:14px;display:flex;align-items:center;gap:8px}
  #${ID} .card>h3 .sub{font-weight:400;color:var(--mu);font-size:12px}
  #${ID} .row{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end}
  #${ID} .fld{display:flex;flex-direction:column;gap:3px;font-size:11px;font-weight:600;color:var(--mu)}
  #${ID} input[type=text],#${ID} input[type=date],#${ID} input[type=number],#${ID} select{border:1px solid #b7c1ce;border-radius:6px;padding:6px 8px;background:#fff;color:var(--tx);font-size:12.5px;min-width:0;height:32px}
  #${ID} input:focus,#${ID} select:focus{outline:2px solid #9ccbf3;border-color:var(--ac)}
  #${ID} .btn{border:1px solid transparent;border-radius:7px;padding:0 13px;height:32px;font-weight:600;font-size:12.5px;cursor:pointer;background:var(--ac);color:#fff;white-space:nowrap}
  #${ID} .btn:hover{filter:brightness(1.08)}
  #${ID} .btn.sec{background:#fff;color:var(--dk);border-color:#9eb9d6}
  #${ID} .btn.ok{background:var(--ok)} #${ID} .btn.bad{background:var(--er)} #${ID} .btn.sm{height:26px;padding:0 9px;font-size:12px}
  #${ID} .btn.ico{padding:0;width:28px;height:28px;background:#fff;color:var(--mu);border-color:var(--bd)}
  #${ID} .btn.ico:hover{color:var(--ac);border-color:var(--ac)}
  #${ID} .btn:disabled{opacity:.5;cursor:not-allowed}
  #${ID} .tw{overflow:auto;border:1px solid var(--bd);border-radius:8px;max-height:48vh}
  #${ID} table{border-collapse:collapse;width:100%;font-size:12.5px}
  #${ID} th{position:sticky;top:0;background:#eef2f8;text-align:left;padding:7px 8px;font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:var(--mu);z-index:1;white-space:nowrap}
  #${ID} td{padding:5px 8px;border-top:1px solid #edf0f5;vertical-align:middle}
  #${ID} tr:hover td{background:#f7fafe}
  #${ID} tr.done td{background:#e9f6ec;color:#3f6b4b} #${ID} tr.exist td{background:#f1f8f3;color:#6a7f70}
  #${ID} tr.err td{background:#fdecee}
  #${ID} td select,#${ID} td input[type=text],#${ID} td input[type=date]{width:100%;height:28px;padding:3px 6px}
  #${ID} .pill{display:inline-block;border-radius:10px;padding:1px 9px;font-size:11px;font-weight:600;background:#e5e9ef}
  #${ID} .pill.g{background:#d6f0dc;color:#1b5e20} #${ID} .pill.o{background:#ffefd1;color:#8a4b08} #${ID} .pill.r{background:#fcd9dd;color:#8c0a16}
  #${ID} .mu{color:var(--mu)} #${ID} .hint{color:var(--mu);font-size:12px;margin:2px 0 8px}
  #${ID} .bulk{position:sticky;top:-16px;z-index:3;background:#fff8e6;border:1px solid #f0d58a;border-radius:10px;padding:10px 12px;margin-bottom:14px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
  #${ID} .bulk .ttl{font-weight:700;margin-bottom:6px;display:flex;gap:10px;align-items:center}
  #${ID} .week{display:flex;gap:2px;flex-wrap:wrap}
  #${ID} .wk{width:15px;height:22px;border-radius:3px;background:#e5e9ef;position:relative}
  #${ID} .wk.l{background:#fbd38d} #${ID} .wk.f{background:#6cc08b} #${ID} .wk.x{background:#4a90d9}
  #${ID} .wk.p{background-image:repeating-linear-gradient(45deg,transparent 0 3px,rgba(255,255,255,.55) 3px 6px)}
  #${ID} .legend span{display:inline-flex;align-items:center;gap:4px;margin-right:12px;font-size:11px;color:var(--mu)} #${ID} .legend i{width:12px;height:12px;border-radius:3px;display:inline-block}
  #${ID} .at-foot{background:var(--card);border-top:1px solid var(--bd);padding:10px 16px;display:flex;flex-direction:column;gap:6px}
  #${ID} .at-prog{height:9px;background:#e5e9ef;border-radius:6px;overflow:hidden} #${ID} .at-prog>div{height:100%;width:0;background:linear-gradient(90deg,#0b5cab,#1fb5ad);transition:width .25s}
  #${ID} .at-frow{display:flex;gap:10px;align-items:center}
  #${ID} .at-stat{flex:1;color:var(--tx);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #${ID} .at-log{min-height:40px}
  #${ID} .at-log{white-space:pre-wrap;background:#0f1b2d;color:#c7d6ea;border-radius:8px;padding:8px 10px;max-height:110px;overflow:auto;font:11.5px/1.45 Consolas,monospace}
  #${ID} .seg{display:inline-flex;border:1px solid #9eb9d6;border-radius:7px;overflow:hidden}
  #${ID} .seg button{border:0;background:#fff;color:var(--dk);padding:0 13px;height:32px;cursor:pointer;font-weight:600;border-right:1px solid #d3deea}
  #${ID} .seg button:last-child{border:0} #${ID} .seg button.on{background:var(--ac);color:#fff}
  #${ID} .grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:14px}
  #${ID} .sw{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:var(--tx);cursor:pointer}
  #${ID} .btn.big{height:40px;font-size:14px;padding:0 22px}
  #${ID} .steps{display:flex;gap:10px;margin-bottom:14px}
  #${ID} .step{flex:1;background:#fff;border:1px solid var(--bd);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;color:var(--mu);font-weight:600}
  #${ID} .step b{width:26px;height:26px;border-radius:50%;background:#e5e9ef;color:var(--tx);display:flex;align-items:center;justify-content:center}
  #${ID} .step.on{border-color:var(--ac);color:var(--ac)} #${ID} .step.on b{background:var(--ac);color:#fff}
  #${ID} .step.ok b{background:var(--ok);color:#fff}
  #${ID} .empty{padding:28px;text-align:center;color:var(--mu)}
  `;
  PDOC.head.appendChild(el('style', { textContent: css }));

  /* ---------- malé pomocné funkce ---------- */
  const h = (tag, props, ...kids) => {
    const x = PDOC.createElement(tag);
    if (props) for (const k in props) {
      const v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') x.className = v;
      else if (k === 'style') x.style.cssText = v;
      else if (k.slice(0, 2) === 'on') x[k] = v;
      else if (k in x) { try { x[k] = v; } catch (e) { x.setAttribute(k, v); } }
      else x.setAttribute(k, v);
    }
    kids.flat(Infinity).forEach(c => { if (c == null || c === false) return; x.append(c.nodeType ? c : PDOC.createTextNode(String(c))); });
    return x;
  };
  const optList = (opts) => opts.map(o => Array.isArray(o) ? o : [o, o]);
  const sel = (opts, value, onchange, props) => {
    const s = h('select', props || {});
    optList(opts).forEach(([v, t]) => s.append(h('option', { value: v }, t)));
    s.value = value == null ? '' : value;
    if (onchange) s.onchange = () => onchange(s.value);
    return s;
  };
  const fld = (label, control, style) => h('label', { class: 'fld', style }, label, control);
  const btn = (text, cls, onclick, props) => h('button', Object.assign({ class: 'btn ' + (cls || ''), onclick }, props || {}), text);
  const isoShift = (iso, days) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + days); return localIso(d); };
  const wkOf = (iso) => weekKey(new Date(iso + 'T12:00:00'));
  const typesFor = (phase) => { const ph = PHASES.find(x => x.name === phase); return ph ? ph.types : []; };
  const autoSubject = (p) => p.phase + ' - ' + p.type;
  const S = state.settings;
  const cleanName = (n) => String(n || '').replace(/^\s*Opportunity\s*/i, '').replace(/\s*\|\s*Opportunity\s*$/i, '').trim();
  state.worklist.forEach(w => { w.name = cleanName(w.name); });
  state.proposals.forEach(p => { p.oppName = cleanName(p.oppName); });
  if (S.autosave == null) S.autosave = true;
  if (S.readExisting == null) S.readExisting = true;
  if (!S.status) S.status = 'Completed';
  if (!S.priority) S.priority = 'Normal';
  const PRIORITIES = ['Normal', 'High', 'Low'];
  state.proposals.forEach(p => { if (!p.priority) p.priority = 'Normal'; if (!p.status) p.status = 'Completed'; if (!p.audience) p.audience = S.audience; });
  if (S.minProb == null) S.minProb = 60;
  if (!S.audience) S.audience = 'Customer Remote';
  const PACES = () => [['0.5', 'Turbo', L('Nejrychlejší – na stabilní lince', 'Fastest – for a stable connection')], ['1', L('Rychle', 'Fast'), L('Doporučeno', 'Recommended')], ['2', L('Klidně', 'Calm'), L('Když SF zahazuje volby v menu', 'If SF drops menu choices')], ['3', L('Velmi pomalu', 'Very slow'), L('Poslední záchrana', 'Last resort')]];
  const DATEFMTS = ['auto', 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY', 'DD-MM-YYYY'];
  PACE = +S.pace || 1;

  /* ---------- kostra panelu ---------- */
  let TAB = 'opty';
  let VIEW = S.view === 'adv' ? 'adv' : 'simple';
  const panel = el('div', { id: ID });
  const selScan = new Set(), queueSel = new Set(), proposalSel = new Set();
  let scanned = [], busy = false, showCreated = true, filterOpp = '', showExisting = false;
  const chipsEl = h('div', { class: 'at-chips' });
  const langSel = sel([['cs', 'Čeština'], ['en', 'English']], LANG, v => { LANG = v; S.lang = v; saveState(); renderAll(); }, {});
  const miniBtn = h('button', { class: 'at-hbtn', title: L('Zmenšit / zvětšit', 'Minimize / restore'), onclick: () => panel.classList.toggle('mini') }, '▁');
  const viewBtn = h('button', { class: 'at-hbtn', style: 'font-size:12px;padding:0 10px', onclick: () => { VIEW = VIEW === 'simple' ? 'adv' : 'simple'; S.view = VIEW; saveState(); renderAll(); } });
  const closeBtn = h('button', { class: 'at-hbtn', title: L('Zavřít', 'Close'), onclick: () => { batchRunning = scanRunning = false; panel.remove(); } }, '✕');
  const tabsEl = h('div', { class: 'at-tabs' });
  const mainEl = h('div', { class: 'at-main' });
  const progBar = h('div'), statEl = h('div', { class: 'at-stat' }), logEl = h('div', { class: 'at-log' });
  const copyBtn = btn(L('📋 Kopírovat log', '📋 Copy log'), 'sec sm', () => { const t = fullLog(); try { navigator.clipboard.writeText(t); setStatus(L('Log zkopírován do schránky.', 'Log copied.')); } catch (e) { const ta = h('textarea', { value: t }); PDOC.body.append(ta); ta.select(); PDOC.execCommand('copy'); ta.remove(); } });
  const dlBtn = btn(L('⬇ Stáhnout log', '⬇ Download log'), 'sec sm', () => { const a = h('a', { href: URL.createObjectURL(new Blob([fullLog()], { type: 'text/plain' })), download: 'autotask-log-' + Date.now() + '.txt' }); PDOC.body.append(a); a.click(); a.remove(); });
  const clrBtn = btn('🗑', 'sec sm', () => { try { localStorage.removeItem(LOGKEY); } catch (err) {} logEl.textContent = ''; }, { title: L('Smazat log', 'Clear log') });
  const runBtn = btn('', 'ok', () => runSelected());
  const stopBtn = btn('■ Stop', 'bad', () => { batchRunning = false; scanRunning = false; log(L('Zastavuji po dokončení aktuálního kroku…', 'Stopping after the current step…')); });
  panel.append(
    h('div', { class: 'at-head' }, h('div', { class: 'at-logo' }, h('i', null, 'AT'), 'AutoTask Planner'), chipsEl, viewBtn, langSel, miniBtn, closeBtn),
    tabsEl, mainEl,
    h('div', { class: 'at-foot' }, h('div', { class: 'at-prog' }, progBar), h('div', { class: 'at-frow' }, statEl, copyBtn, dlBtn, clrBtn, stopBtn, runBtn), logEl)
  );
  PDOC.body.append(panel);

  const LOGKEY = 'autotask.log';
  const stamp = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0'); };
  const persist = (line) => { try { const a = JSON.parse(localStorage.getItem(LOGKEY) || '[]'); a.push(line); localStorage.setItem(LOGKEY, JSON.stringify(a.slice(-800))); } catch (err) {} };
  const log = (s) => { const line = '[' + stamp() + '] ' + s; logEl.textContent += (logEl.textContent ? '\n' : '') + line; logEl.scrollTop = logEl.scrollHeight; persist(line); try { console.log('[AutoTask]', s); } catch (err) {} };
  trace = log;
  const fullLog = () => { let a = []; try { a = JSON.parse(localStorage.getItem(LOGKEY) || '[]'); } catch (err) {} return '=== AutoTask Planner log · ' + new Date().toISOString() + ' · ' + PWIN.location.href + ' · ' + navigator.userAgent + '\n' + a.join('\n'); };
  const setStatus = (s) => { statEl.textContent = s; statEl.title = s; };
  onProgress = (i, n) => { progBar.style.width = Math.round(100 * i / Math.max(1, n)) + '%'; };
  function gotoTab(t) { if (VIEW === 'simple') { if (t === 'plan' && WZ.step === 2) WZ.step = 3; renderAll(); return; } TAB = t; renderAll(); }
  function renderQueue() { renderAll(); }
  function renderProposalsTable() { renderAll(); }
  function scopedProposals() { const ids = new Set(state.worklist.map(w => w.id)); return state.proposals.filter(p => ids.has(p.oppId)); }
  const todo = () => scopedProposals().filter(p => !p.created);

  /* ---------- hlavní render ---------- */
  function renderAll() {
    viewBtn.textContent = VIEW === 'simple' ? L('⚙ Pokročilý režim', '⚙ Advanced mode') : L('✨ Jednoduchý režim', '✨ Simple mode');
    stopBtn.style.display = (busy || VIEW === 'adv') ? '' : 'none';
    mainEl.textContent = '';
    if (VIEW === 'simple') { renderSimple(); modeHint(); return; }
    runBtn.style.display = '';
    const pr = scopedProposals();
    const created = pr.filter(p => p.created).length;
    chipsEl.textContent = '';
    chipsEl.append(
      h('span', { class: 'at-chip' }, L('Opty ve frontě: ', 'Queued opps: '), h('b', null, state.worklist.length)),
      h('span', { class: 'at-chip' }, L('Naplánováno: ', 'Planned: '), h('b', null, pr.length - created)),
      h('span', { class: 'at-chip' }, L('Vytvořeno: ', 'Created: '), h('b', null, created)),
      h('span', { class: 'at-chip' }, L('Zvoleno k vytvoření: ', 'Selected: '), h('b', null, pr.filter(p => !p.created && proposalSel.has(p.id)).length)));
    tabsEl.textContent = '';
    [['opty', '① ' + L('Opportunities', 'Opportunities'), state.worklist.length], ['plan', '② ' + L('Plán tasků', 'Task plan'), pr.length - created], ['set', '③ ' + L('Nastavení', 'Settings'), null]].forEach(([k, t, n]) =>
      tabsEl.append(h('button', { class: 'at-tab' + (TAB === k ? ' on' : ''), onclick: () => gotoTab(k) }, t, n != null ? h('span', { class: 'n' }, n) : null)));
    ({ opty: tabOpty, plan: tabPlan, set: tabSettings })[TAB]();
    const n = pr.filter(p => !p.created && proposalSel.has(p.id)).length;
    runBtn.textContent = L(`▶ Vytvořit vybrané (${n})`, `▶ Create selected (${n})`);
    runBtn.disabled = !n || busy;
    modeHint();
  }
  function modeHint() { if (mode() === 'other' && !statEl.textContent) setStatus(L('Otevřete seznam Opportunities (/lightning/o/Opportunity/list) a spusťte nástroj tam.', 'Open the Opportunities list and launch the tool there.')); }

  /* sdílená kontrolní tabulka (jednoduchý režim) – všechna povinná pole formuláře */
  function reviewTable(open, showOpp) {
    const head = h('input', { type: 'checkbox', checked: open.length > 0 && open.every(p => proposalSel.has(p.id)), onchange: e => { open.forEach(p => e.target.checked ? proposalSel.add(p.id) : proposalSel.delete(p.id)); renderAll(); } });
    const th = (t) => h('th', null, t);
    return h('div', { class: 'tw', style: 'max-height:46vh' }, h('table', null,
      h('thead', null, h('tr', null, th(head), showOpp ? th('Opportunity') : null, th(L('Datum*', 'Date*')), th(L('Fáze* (Category)', 'Phase* (Category)')), th('Task Type'), th(L('Předmět', 'Subject')), th('Product*'), th('Audience*'), th('Status*'), th('Priority*'), th())),
      h('tbody', null, open.map(p => {
        const dis = false; const miss = missingFields(p);
        const subj = h('input', { type: 'text', value: p.subject, title: p.error || '', oninput: e => { p.subject = e.target.value; p.customSubject = e.target.value !== autoSubject(p); saveState(); } });
        const tySel = sel(typesFor(p.phase), p.type, v => { p.type = v; if (!p.customSubject) { p.subject = autoSubject(p); subj.value = p.subject; } saveState(); });
        const phSel = sel(PHASES.map(x => x.name), p.phase, v => { p.phase = v; tySel.textContent = ''; typesFor(v).forEach(t => tySel.append(h('option', { value: t }, t))); p.type = typesFor(v)[0]; tySel.value = p.type; if (!p.customSubject) { p.subject = autoSubject(p); subj.value = p.subject; } saveState(); });
        return h('tr', { class: (p.error || miss.length) ? 'err' : '', title: miss.length ? L('Chybí: ', 'Missing: ') + miss.join(', ') : '' },
          h('td', null, h('input', { type: 'checkbox', checked: proposalSel.has(p.id), onchange: e => { e.target.checked ? proposalSel.add(p.id) : proposalSel.delete(p.id); renderAll(); } })),
          showOpp ? h('td', { style: 'min-width:140px' }, h('b', null, p.oppName)) : null,
          h('td', { style: 'min-width:128px' }, h('input', { type: 'date', value: p.date, onchange: e => { if (e.target.value) setP(p, { date: e.target.value }); } })),
          h('td', { style: 'min-width:100px' }, phSel), h('td', { style: 'min-width:170px' }, tySel), h('td', { style: 'min-width:200px' }, subj),
          h('td', { style: 'min-width:140px' }, sel(PRODUCTS, p.product, v => { p.product = v; saveState(); })),
          h('td', { style: 'min-width:150px' }, sel(AUDIENCES, p.audience || S.audience, v => { p.audience = v; saveState(); })),
          h('td', { style: 'min-width:110px' }, sel(STATUSES, p.status || 'Completed', v => { p.status = v; saveState(); })),
          h('td', { style: 'min-width:80px' }, sel(PRIORITIES, p.priority || 'Normal', v => { p.priority = v; saveState(); })),
          h('td', null, btn('✕', 'ico', () => { state.proposals = state.proposals.filter(x => x.id !== p.id); proposalSel.delete(p.id); saveState(); renderAll(); }, { title: L('Odebrat', 'Remove') })));
      }))));
  }

  /* ---------- JEDNODUCHÝ REŽIM (průvodce ve 3 krocích) ---------- */
  const todayIso = () => localIso(new Date());
  const isoWeek = (iso) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7)); const w1 = new Date(d.getFullYear(), 0, 4); return 1 + Math.round(((d - w1) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7); };
  const dm = (iso) => { const [y, m, d] = iso.split('-'); return +d + '.' + +m + '.'; };
  const weekRange = (mon, n) => { const end = isoShift(mon, 7 * n - 1); return dm(mon) + ' – ' + dm(end) + end.slice(0, 4); };
  const thisMonday = () => localIso(monday(new Date()));
  const WZ = { step: 1, week: thisMonday(), weeks: 1, from: thisMonday(), to: isoShift(thisMonday(), 6), perWeek: 5, sel: new Set(), msg: '', init: false };
  const stepper = (n) => h('div', { class: 'steps' }, [1, 2, 3].map(i => h('div', { class: 'step' + (i === n ? ' on' : i < n ? ' ok' : '') }, h('b', null, i < n ? '✓' : i), [L('Opty', 'Opps'), L('Kdy a kolik', 'When & how many'), L('Kontrola', 'Review')][i - 1])));
  function wzOpts() {
    const map = new Map();
    state.worklist.forEach(w => map.set(w.id, w));
    scanned.forEach(o => { if (!map.has(o.id)) map.set(o.id, { id: o.id, name: cleanName(o.name), account: o.account, created: o.created, stage: o.stage, url: o.url, done: false }); });
    return [...map.values()];
  }
  function renderSimple() {
    chipsEl.textContent = ''; tabsEl.textContent = '';
    if (mode() === 'record') { renderRecordSimple(); return; }
    const st = WZ.step;
    const wrap = h('div', { style: 'max-width:1280px;margin:0 auto' }, stepper(st));
    if (st === 1) {
      const opts = wzOpts();
      if (!WZ.init) { state.worklist.forEach(w => WZ.sel.add(w.id)); WZ.init = true; }
      const c = h('div', { class: 'card' }, h('h3', null, L('Krok 1 ze 3 · Vyberte opportunities', 'Step 1 of 3 · Pick opportunities')));
      if (mode() !== 'list') c.append(h('div', { class: 'hint' }, L('Otevřete seznam Opportunities a spusťte nástroj tam.', 'Open the Opportunities list and launch the tool there.')));
      c.append(h('div', { class: 'row', style: 'margin-bottom:10px' },
        btn(L('🔍 Načíst opty ze seznamu', '🔍 Load opps from the list'), '', () => {
          scanned = scanList().filter(o => o.probability == null ? true : o.probability >= (+S.minProb || 0));
          scanned.forEach(o => { if (!state.worklist.some(w => w.id === o.id)) WZ.sel.add(o.id); });
          setStatus(L(`Nalezeno ${scanned.length} opt. Seznam je virtuální – posuňte ho a načtěte znovu pro další.`, `Found ${scanned.length} opps. The list is virtual – scroll and load again for more.`)); renderAll();
        }, { disabled: mode() !== 'list' })));
      if (!opts.length) c.append(h('div', { class: 'empty' }, L('Klikněte na „Načíst opty ze seznamu“.', 'Click “Load opps from the list”.')));
      else {
        c.append(h('div', { class: 'tw', style: 'max-height:45vh' }, h('table', null,
          h('thead', null, h('tr', null, h('th'), h('th', null, 'Opportunity'), h('th', null, 'Account'), h('th', null, 'Stage'))),
          h('tbody', null, opts.map(o => h('tr', null,
            h('td', null, h('input', { type: 'checkbox', checked: WZ.sel.has(o.id), onchange: e => { e.target.checked ? WZ.sel.add(o.id) : WZ.sel.delete(o.id); renderAll(); } })),
            h('td', null, h('b', null, o.name)), h('td', { class: 'mu' }, o.account || '—'), h('td', null, o.stage || '—')))))));
      }
      c.append(h('div', { class: 'row', style: 'margin-top:12px;justify-content:flex-end' },
        h('span', { class: 'mu', style: 'align-self:center' }, L(`Vybráno: ${WZ.sel.size}`, `Selected: ${WZ.sel.size}`)),
        btn(L('Pokračovat →', 'Continue →'), 'ok big', () => {
          const prev = new Map(state.worklist.map(w => [w.id, w]));
          state.worklist = wzOpts().filter(o => WZ.sel.has(o.id)).map(o => prev.get(o.id) || o);
          saveState(); WZ.step = 2; renderAll();
        }, { disabled: !WZ.sel.size })));
      wrap.append(c);
    } else if (st === 2) {
      const syncRange = () => { WZ.from = WZ.week; WZ.to = isoShift(WZ.week, 7 * WZ.weeks - 1); };
      syncRange();
      const mondays = []; for (let i = -6; i <= 14; i++) mondays.push(isoShift(thisMonday(), 7 * i));
      const weekSel = sel(mondays.map(m => [m, `${L('Týden', 'Week')} ${isoWeek(m)} · ${weekRange(m, 1)}${m === thisMonday() ? ' ' + L('(tento)', '(this)') : ''}`]), WZ.week, v => { WZ.week = v; syncRange(); renderAll(); }, { style: 'min-width:300px' });
      const nwI = h('input', { type: 'number', min: 1, max: 26, value: WZ.weeks, style: 'width:80px', onchange: e => { WZ.weeks = Math.max(1, Math.min(26, +e.target.value || 1)); e.target.value = WZ.weeks; syncRange(); renderAll(); } });
      const pwI = h('input', { type: 'number', min: 1, max: 50, value: WZ.perWeek, style: 'width:80px', onchange: e => { WZ.perWeek = Math.max(1, Math.min(50, +e.target.value || 5)); e.target.value = WZ.perWeek; } });
      wrap.append(h('div', { class: 'card' }, h('h3', null, L('Krok 2 ze 3 · Kolik tasků a kdy', 'Step 2 of 3 · How many tasks and when')),
        h('div', { class: 'hint' }, L(S.readExisting ? `Vybráno ${state.worklist.length} opt. Přečtu jejich existující tasky a doplním jen to, co do cíle chybí.` : `Vybráno ${state.worklist.length} opt. Pro každou se vytvoří zadaný počet nových tasků.`, S.readExisting ? `${state.worklist.length} opps selected. Existing tasks are read and only the missing ones are added.` : `${state.worklist.length} opps selected. The given number of new tasks is created for each.`)),
        h('div', { class: 'row' }, fld(L('Týden', 'Week'), weekSel), fld(S.readExisting ? L('Cíl tasků v týdnu', 'Target tasks in the week') : L('Počet tasků na optu', 'Tasks per opportunity'), pwI),
          fld('Product', sel(PRODUCTS, S.product, v => { S.product = v; saveState(); })), fld('Audience', sel(AUDIENCES, S.audience, v => { S.audience = v; saveState(); }))),
        h('div', { style: 'margin-top:10px;font-weight:600' }, '📅 ' + L('Tasky se naplánují od ', 'Tasks will be planned from ') + WZ.from.split('-').reverse().join('.') + L(' do ', ' to ') + WZ.to.split('-').reverse().join('.')),
        h('label', { class: 'sw', style: 'margin-top:10px' }, h('input', { type: 'checkbox', checked: !!S.readExisting, onchange: e => { S.readExisting = e.target.checked; saveState(); renderAll(); } }), L('Přečíst existující tasky a doplnit jen chybějící', 'Read existing tasks and add only the missing ones')),
        WZ.msg ? h('div', { class: 'hint', style: 'color:var(--er);margin-top:8px' }, WZ.msg) : null,
        h('div', { class: 'row', style: 'margin-top:14px;justify-content:space-between' },
          btn(L('← Zpět', '← Back'), 'sec', () => { WZ.step = 1; renderAll(); }),
          btn(L('Připravit tasky →', 'Prepare tasks →'), 'ok big', async () => {
            if (!WZ.from || !WZ.to || WZ.to < WZ.from) { WZ.msg = L('Vyberte týden.', 'Pick a week.'); renderAll(); return; }
            WZ.msg = ''; proposalSel.clear();
            if (S.readExisting) { S.rangeStart = WZ.week; S.rangeEnd = isoShift(WZ.week, 6); S.perWeek = WZ.perWeek; saveState(); await runScan(); todo().forEach(p => proposalSel.add(p.id)); }
            else { state.worklist.forEach(w => genProposals(w.id, w.name, WZ.perWeek, WZ.week)); saveState(); log(L(`Připraveno ${WZ.perWeek} tasků × ${state.worklist.length} opt.`, `Prepared ${WZ.perWeek} tasks × ${state.worklist.length} opps.`)); }
            WZ.step = 3; renderAll();
          }, { disabled: busy }))));
      if (busy) wrap.append(h('div', { class: 'hint', style: 'text-align:center' }, L('Načítám existující tasky v pomocném okně… neklikejte do něj.', 'Reading existing tasks in the helper window… don’t click in it.')));
    } else {
      const all = scopedProposals().sort((a, b) => (a.oppName + a.date).localeCompare(b.oppName + b.date));
      const open = all.filter(p => !p.created), done = all.filter(p => p.created);
      const nSel = open.filter(p => proposalSel.has(p.id)).length;
      const c = h('div', { class: 'card' }, h('h3', null, L('Krok 3 ze 3 · Zkontrolujte a vytvořte', 'Step 3 of 3 · Review and create'), h('span', { class: 'sub' }, `${L('Týden', 'Week')} ${isoWeek(WZ.from)} · ${weekRange(WZ.from, WZ.weeks)}`)));
      if (done.length && !open.length) {
        c.append(h('div', { class: 'empty' }, h('div', { style: 'font-size:34px' }, '✅'), h('b', null, L(`Hotovo – vytvořeno ${done.length} tasků.`, `Done – ${done.length} tasks created.`))),
          h('div', { class: 'row', style: 'justify-content:center' }, btn(L('Začít znovu', 'Start over'), '', () => { state.proposals = state.proposals.filter(p => !p.created); saveState(); WZ.step = 1; WZ.init = false; WZ.sel.clear(); renderAll(); })));
      } else if (!open.length) {
        c.append(h('div', { class: 'empty' }, L('Pro zvolené období není co doplnit (cíl je splněn) nebo se tasky nenačetly.', 'Nothing to add for this period (target met) or tasks failed to load.')), h('div', { class: 'row', style: 'justify-content:center' }, btn(L('← Zpět', '← Back'), 'sec', () => { WZ.step = 2; renderAll(); })));
      } else {
        c.append(h('div', { class: 'hint' }, L('Pole označená * jsou ve formuláři povinná. Assigned To zůstává přihlášený uživatel, Reminder se vypíná. Vše lze přepsat v řádku, tasky odškrtnout.', 'Fields marked * are required in the form. Assigned To stays the logged-in user, Reminder is turned off. Everything is editable inline.')),
          reviewTable(open, true),
          h('div', { class: 'row', style: 'margin-top:12px;justify-content:space-between' },
            h('div', { class: 'row' }, btn(L('← Zpět', '← Back'), 'sec', () => { WZ.step = 2; renderAll(); }),
              h('label', { class: 'sw', style: 'height:32px' }, h('input', { type: 'checkbox', checked: !!S.autosave, onchange: e => { S.autosave = e.target.checked; saveState(); renderAll(); } }), L('Ukládat automaticky (Save)', 'Save automatically'))),
            btn(L(`▶ Vytvořit ${nSel} tasků`, `▶ Create ${nSel} tasks`), 'ok big', () => runSelected(), { disabled: !nSel || busy })));
        if (!S.autosave) c.append(h('div', { class: 'hint' }, L('Automatické ukládání je vypnuté – u každého tasku sami zkontrolujete formulář a kliknete na Save.', 'Auto-save is off – review each form and click Save yourself.')));
      }
      wrap.append(c);
    }
    mainEl.append(wrap);
    runBtn.style.display = 'none';
  }

  /* ---------- REŽIM „OTEVŘENÁ OPPORTUNITA“: spustit na záznamu a vytvořit N tasků ---------- */
  const RW = { n: 5, week: thisMonday(), rid: null, ready: false, read: true };
  function recName() {
    const w = state.worklist.find(x => x.id === currentRecordId()); if (w && w.name) return w.name;
    const t = txt(deepOne('h1 lightning-formatted-text, h1 .slds-page-header__title, h1'));
    return cleanName(t) || currentRecordId();
  }
  function genProposals(oppId, name, n, weekMon) {
    state.proposals = state.proposals.filter(p => p.oppId !== oppId || p.created);
    const flat = PHASES.flatMap(ph => ph.types.map(t => ({ phase: ph.name, type: t })));
    let start = 0;
    if (S.readExisting) { const ex = (state.existing[oppId] && state.existing[oppId].tasks) || []; let mr = -1; ex.forEach(t => { const rk = phaseRank(t.subject); if (rk > mr) mr = rk; }); const si = flat.findIndex(x => x.phase === PHASES[Math.min(mr + 1, PHASES.length - 1)].name); start = si < 0 ? 0 : si; }
    for (let i = 0; i < n; i++) {
      const f = flat[(start + i) % flat.length], date = isoShift(weekMon, (i % 4) + 1);
      const p = { id: mkId(), oppId, oppName: name, week: wkOf(date), date, phase: f.phase, type: f.type, subject: f.phase + ' - ' + f.type, product: S.product, audience: S.audience, status: S.status || 'Completed', priority: S.priority || 'Normal', manual: true, created: false, error: '' };
      state.proposals.push(p); proposalSel.add(p.id);
    }
  }
  async function recPrepare() {
    const rid = currentRecordId(); busy = true; renderAll();
    if (!state.worklist.some(x => x.id === rid)) state.worklist.push({ id: rid, name: recName(), account: '', url: PWIN.location.origin + `/lightning/r/Opportunity/${rid}/view`, done: true });
    try { if (S.readExisting) { setStatus(L('Čtu existující aktivity…', 'Reading existing activities…')); const rr = await processCurrentRecord(); log(L(`Existujících tasků: ${rr ? rr.count : 0}.`, `Existing tasks: ${rr ? rr.count : 0}.`)); } } catch (err) { log(L('CHYBA čtení: ', 'Read ERROR: ') + err.message); }
    busy = false;
    proposalSel.clear(); genProposals(rid, (state.worklist.find(x => x.id === rid) || {}).name || recName(), RW.n, RW.week);
    RW.ready = true; RW.rid = rid; saveState();
    log(L(`Připraveno ${RW.n} nových tasků.`, `${RW.n} new tasks prepared.`)); renderAll();
  }
  function renderRecordSimple() {
    chipsEl.textContent = ''; tabsEl.textContent = '';
    const rid = currentRecordId();
    if (RW.rid !== rid) { RW.ready = false; RW.rid = rid; }
    const wrap = h('div', { style: 'max-width:1280px;margin:0 auto' });
    if (/\/related\//.test(PWIN.location.pathname)) {
      wrap.append(h('div', { class: 'card' }, h('h3', null, L('Jste na vedlejší záložce opty', 'You are on a related list')),
        h('div', { class: 'hint' }, L('Formulář tasku je na hlavní stránce opty (sekce Activity). Otevřete ji tlačítkem níže a nástroj pak bude pokračovat.', 'The task form is on the main opportunity page (Activity section). Open it with the button below.')),
        h('div', { class: 'row', style: 'margin-top:10px' }, btn(L('Otevřít hlavní stránku opty', 'Open main opportunity page'), 'ok big', () => { PWIN.location.assign(PWIN.location.origin + '/lightning/r/Opportunity/' + rid + '/view'); }))));
      mainEl.append(wrap); runBtn.style.display = 'none'; return;
    }
    const mine = state.proposals.filter(p => p.oppId === rid);
    const open = mine.filter(p => !p.created), done = mine.filter(p => p.created);
    if (RW.ready && done.length && !open.length) {
      wrap.append(h('div', { class: 'card' }, h('h3', null, recName()), h('div', { class: 'empty' }, h('div', { style: 'font-size:34px' }, '✅'), h('b', null, L(`Hotovo – vytvořeno ${done.length} tasků.`, `Done – ${done.length} tasks created.`))),
        h('div', { class: 'row', style: 'justify-content:center' }, btn(L('Vytvořit další', 'Create more'), '', () => { state.proposals = state.proposals.filter(p => p.oppId !== rid); RW.ready = false; saveState(); renderAll(); }))));
    } else if (!RW.ready) {
      const mondays = []; for (let i = -6; i <= 14; i++) mondays.push(isoShift(thisMonday(), 7 * i));
      const nI = h('input', { type: 'number', min: 1, max: 50, value: RW.n, style: 'width:80px', onchange: e => { RW.n = Math.max(1, Math.min(50, +e.target.value || 5)); e.target.value = RW.n; } });
      wrap.append(h('div', { class: 'card' }, h('h3', null, L('Vytvořit tasky v této opportunitě', 'Create tasks in this opportunity')),
        h('div', { style: 'font-size:15px;font-weight:700;margin-bottom:10px' }, recName()),
        h('div', { class: 'row' },
          fld(L('Počet tasků', 'Number of tasks'), nI),
          fld(L('Týden', 'Week'), sel(mondays.map(m => [m, `${L('Týden', 'Week')} ${isoWeek(m)} · ${weekRange(m, 1)}${m === thisMonday() ? ' ' + L('(tento)', '(this)') : ''}`]), RW.week, v => { RW.week = v; }, { style: 'min-width:300px' })),
          fld('Product', sel(PRODUCTS, S.product, v => { S.product = v; saveState(); })), fld('Audience', sel(AUDIENCES, S.audience, v => { S.audience = v; saveState(); }))),
        h('label', { class: 'sw', style: 'margin-top:10px' }, h('input', { type: 'checkbox', checked: !!S.readExisting, onchange: e => { S.readExisting = e.target.checked; saveState(); renderAll(); } }), L('Přečíst existující tasky a navázat na ně', 'Read existing tasks and continue from them')),
        h('div', { class: 'hint', style: 'margin-top:4px' }, S.readExisting ? L('Fáze a typy navážou na to, co už v opportunitě je. Před vytvořením je zkontrolujete.', 'Phases and types continue from what already exists. You can review them before creating.') : L('Vytvoří se nové tasky od fáze Discover. Fáze změníte v řádcích.', 'New tasks start at Discover. Change phases in the rows.')),
        h('div', { class: 'row', style: 'margin-top:12px;justify-content:flex-end' }, btn(L('Připravit tasky →', 'Prepare tasks →'), 'ok big', () => recPrepare(), { disabled: busy }))));
    } else {
      const nSel = open.filter(p => proposalSel.has(p.id)).length;
      wrap.append(h('div', { class: 'card' }, h('h3', null, recName(), h('span', { class: 'sub' }, L('Zkontrolujte a vytvořte', 'Review and create'))),
        h('div', { class: 'hint' }, L('Pole označená * jsou ve formuláři povinná. Assigned To zůstává přihlášený uživatel. Vše lze přepsat v řádku, tasky odškrtnout.', 'Fields marked * are required. Assigned To stays the logged-in user. Everything is editable inline.')),
        reviewTable(open, false),
        h('div', { class: 'row', style: 'margin-top:12px;justify-content:space-between' },
          h('div', { class: 'row' }, btn(L('← Změnit zadání', '← Change setup'), 'sec', () => { state.proposals = state.proposals.filter(p => p.oppId !== rid || p.created); RW.ready = false; saveState(); renderAll(); }),
            h('label', { class: 'sw', style: 'height:32px' }, h('input', { type: 'checkbox', checked: !!S.autosave, onchange: e => { S.autosave = e.target.checked; saveState(); renderAll(); } }), L('Ukládat automaticky (Save)', 'Save automatically'))),
          btn(L(`▶ Vytvořit ${nSel} tasků`, `▶ Create ${nSel} tasks`), 'ok big', () => runSelected(), { disabled: !nSel || busy })),
        !S.autosave ? h('div', { class: 'hint' }, L('Automatické ukládání je vypnuté – u každého tasku sami zkontrolujete formulář a kliknete na Save.', 'Auto-save is off – review each form and click Save yourself.')) : null));
    }
    mainEl.append(wrap);
    runBtn.style.display = 'none';
  }

  /* ---------- ① OPPORTUNITIES ---------- */
  function tabOpty() {
    const find = h('div', { class: 'card' }, h('h3', null, L('1. Najít opty', '1. Find opportunities'), h('span', { class: 'sub' }, L(`zobrazí se jen opty s pravděpodobností ≥ ${S.minProb} %`, `only opps with probability ≥ ${S.minProb}%`))));
    if (mode() !== 'list') find.append(h('div', { class: 'hint' }, mode() === 'record' ? L('Jste na záznamu opty. Můžete naskenovat jen tuto optu, ale doporučeno je spustit panel ze seznamu Opportunities.', 'You are on an opportunity record. Launching from the list is recommended.') : L('Otevřete seznam Opportunities a spusťte nástroj tam.', 'Open the Opportunities list and launch the tool there.')));
    const bar = h('div', { class: 'row' },
      mode() === 'record' ? btn(L('Skenovat aktivity této opty', 'Scan this opportunity'), '', async () => { setStatus(L('Čtu aktivity…', 'Reading activities…')); const r = await processCurrentRecord(); log(r ? L(`Tasků: ${r.count}, návrhů: ${r.props}.`, `Tasks: ${r.count}, proposals: ${r.props}.`) : L('Žádná data.', 'No data.')); renderAll(); }) :
        btn(L('🔍 Skenovat viditelné opty', '🔍 Scan visible opps'), '', () => {
          scanned = scanList().filter(o => o.probability == null ? true : o.probability >= (+S.minProb || 0));
          selScan.clear(); setStatus(L(`Nalezeno ${scanned.length} opt.`, `Found ${scanned.length} opps.`));
          log(L('Seznam je virtuální – posuňte ho dolů a skenujte znovu, abyste získali další.', 'The list is virtual – scroll down and scan again for more.')); renderAll();
        }),
      scanned.length ? btn(L(`＋ Přidat vybrané do fronty (${selScan.size})`, `＋ Add selected to queue (${selScan.size})`), 'ok', () => {
        const ids = new Set(state.worklist.map(w => w.id)); let add = 0;
        scanned.filter(o => selScan.has(o.id) && !ids.has(o.id)).forEach(o => { state.worklist.push({ id: o.id, name: cleanName(o.name), account: o.account, created: o.created, stage: o.stage, url: o.url, done: false }); add++; });
        saveState(); log(L(`Přidáno ${add} opt do fronty.`, `Added ${add} opps.`)); selScan.clear(); renderAll();
      }, { disabled: !selScan.size }) : null);
    find.append(bar);
    if (scanned.length) {
      const inQ = new Set(state.worklist.map(w => w.id));
      const selectable = scanned.filter(o => !inQ.has(o.id)); const all = h('input', { type: 'checkbox', checked: selectable.length > 0 && selectable.every(o => selScan.has(o.id)), onchange: e => { scanned.forEach(o => { if (!inQ.has(o.id)) e.target.checked ? selScan.add(o.id) : selScan.delete(o.id); }); renderAll(); } });
      const t = h('table', null, h('thead', null, h('tr', null, h('th', null, all), h('th', null, 'Opportunity'), h('th', null, 'Account'), h('th', null, L('Vytvořeno', 'Created')), h('th', null, 'Stage'))),
        h('tbody', null, scanned.map(o => h('tr', null,
          h('td', null, inQ.has(o.id) ? h('span', { class: 'pill g' }, '✓') : h('input', { type: 'checkbox', checked: selScan.has(o.id), onchange: e => { e.target.checked ? selScan.add(o.id) : selScan.delete(o.id); renderAll(); } })),
          h('td', null, h('b', null, o.name)), h('td', { class: 'mu' }, o.account || '—'), h('td', null, o.created || '—'), h('td', null, o.stage || '—')))));
      find.append(h('div', { class: 'tw', style: 'margin-top:10px' }, t));
    }
    mainEl.append(find);

    const q = h('div', { class: 'card' }, h('h3', null, L('2. Fronta opt', '2. Queue'), h('span', { class: 'sub' }, L('po naskenování se pro každou optu spočítá plán', 'a plan is computed for each scanned opp'))));
    if (!state.worklist.length) q.append(h('div', { class: 'empty' }, L('Fronta je prázdná. Naskenujte seznam a přidejte opty.', 'Queue is empty. Scan the list and add opps.')));
    else {
      const hb = fiscalHalfBounds(), hs = localIso(hb.start), he = localIso(hb.end);
      const cnt = (e) => (e && e.tasks) ? e.tasks.filter(t => { const d = t.dueIso || t.week || ''; return d && d >= hs && d < he; }).length : null;
      q.append(h('div', { class: 'row', style: 'margin-bottom:10px' },
        btn(L('Vybrat vše', 'Select all'), 'sec sm', () => { state.worklist.forEach(w => queueSel.add(w.id)); renderAll(); }),
        btn(L('Zrušit výběr', 'Clear'), 'sec sm', () => { queueSel.clear(); renderAll(); }),
        btn(L('▶ Skenovat frontu (existující tasky)', '▶ Scan queue (existing tasks)'), '', () => runScan(), { disabled: busy }),
        btn(L('↻ Přepočítat plán (podle nastavení)', '↻ Recompute plan'), 'sec', () => recompute(), { title: L('Znovu vygeneruje návrhy ze stávajícího skenu – bez otevírání Salesforce', 'Regenerates proposals from the last scan – no Salesforce needed') }),
        btn(L('Odebrat vybrané', 'Remove selected'), 'sec', () => { const ids = queueSel.size ? queueSel : null; if (!ids) return; state.worklist = state.worklist.filter(w => !ids.has(w.id)); ids.forEach(id => { state.proposals = state.proposals.filter(p => p.oppId !== id); delete state.existing[id]; }); queueSel.clear(); saveState(); renderAll(); })));
      const t = h('table', null, h('thead', null, h('tr', null, h('th'), h('th', null, 'Opportunity'), h('th', null, 'Stage'), h('th', null, L('Stav', 'Status')), h('th', null, L('Tasků v půlroce', 'Tasks this half-year')), h('th'))),
        h('tbody', null, state.worklist.map(w => { const c = cnt(state.existing[w.id]); return h('tr', null,
          h('td', null, h('input', { type: 'checkbox', checked: queueSel.has(w.id), onchange: e => { e.target.checked ? queueSel.add(w.id) : queueSel.delete(w.id); } })),
          h('td', null, h('b', null, w.name), h('div', { class: 'mu' }, w.account || '')), h('td', null, w.stage || '—'),
          h('td', null, w.done ? h('span', { class: 'pill g' }, L('naskenováno', 'scanned')) : h('span', { class: 'pill o' }, L('čeká', 'pending'))),
          h('td', null, c == null ? '—' : String(c)),
          h('td', { style: 'text-align:right;white-space:nowrap' }, btn(L('Otevřít', 'Open'), 'sec sm', () => { ensureChild(w.url); navChild(w.url); }), ' ',
            btn('✕', 'ico', () => { state.worklist = state.worklist.filter(x => x.id !== w.id); state.proposals = state.proposals.filter(p => p.oppId !== w.id); delete state.existing[w.id]; saveState(); renderAll(); }, { title: L('Odebrat', 'Remove') }))); })));
      q.append(h('div', { class: 'tw' }, t));
    }
    mainEl.append(q);
  }
  async function runScan() {
    if (mode() === 'list') ensureChild(state.worklist[0].url);
    busy = true; progBar.style.width = '0'; renderAll();
    try { await scanQueueInChild(); proposalSel.clear(); } finally { busy = false; renderAll(); }
  }
  function recompute() {
    let ids = [...queueSel]; if (!ids.length) ids = state.worklist.map(w => w.id);
    let ok = 0, skip = 0;
    ids.forEach(id => {
      const w = state.worklist.find(x => x.id === id), e = state.existing && state.existing[id];
      if (!e || !e.tasks) { skip++; return; }
      const tasks = e.tasks.map(t => { const iso = t.dueIso || t.week || ''; return { subject: t.subject, dueDate: iso ? new Date(iso + 'T12:00:00') : null }; });
      mergeProposals(id, buildProposals({ id, name: e.name || (w && w.name) || id }, tasks)); ok++;
    });
    saveState(); setStatus(L(`Přepočítáno ${ok} opt${skip ? `, ${skip} nenaskenovaných přeskočeno` : ''}.`, `Recomputed ${ok} opps${skip ? `, ${skip} not scanned skipped` : ''}.`)); renderAll();
  }

  /* ---------- ② PLÁN TASKŮ ---------- */
  function setP(p, patch) { Object.assign(p, patch); if (patch.date) p.week = wkOf(p.date); saveState(); }
  function addTask(oppId, from, n) {
    const w = state.worklist.find(x => x.id === oppId); if (!w) return;
    for (let i = 0; i < n; i++) {
      const base = from ? Object.assign({}, from) : { phase: PHASES[0].name, type: PHASES[0].types[0], date: localIso(new Date()), product: S.product, audience: S.audience, status: S.status, priority: S.priority };
      const p = Object.assign(base, { id: mkId(), oppId, oppName: w.name, manual: true, created: false, error: '' });
      if (from && n > 0) p.date = isoShift(from.date, from.__shift || 0);
      p.week = wkOf(p.date); p.subject = from ? from.subject : autoSubject(p);
      state.proposals.push(p); proposalSel.add(p.id);
    }
    saveState();
  }
  function weekStrip(oppId) {
    const start = S.rangeStart || localIso(fiscalHalfStart()), end = S.rangeEnd || localIso(new Date());
    const weeks = weeksForRange(new Date(start + 'T12:00:00'), new Date(end + 'T12:00:00')).slice(0, 80);
    const tgt = Math.max(1, +S.perWeek || 3), e = state.existing[oppId], map = {};
    ((e && e.tasks) || []).forEach(t => { if (t.week) (map[t.week] = map[t.week] || { ex: 0, pl: 0 }).ex++; });
    state.proposals.filter(p => p.oppId === oppId).forEach(p => { (map[p.week] = map[p.week] || { ex: 0, pl: 0 })[p.created ? 'ex' : 'pl']++; });
    return h('div', { class: 'week' }, weeks.map(w => { const k = localIso(w), m = map[k] || { ex: 0, pl: 0 }, tot = m.ex + m.pl;
      return h('div', { class: 'wk ' + (tot === 0 ? '' : tot > tgt ? 'x' : tot >= tgt ? 'f' : 'l') + (m.pl ? ' p' : ''), title: `${L('Týden', 'Week')} ${k}: ${m.ex} ${L('existuje', 'existing')} + ${m.pl} ${L('plán', 'planned')} / ${L('cíl', 'target')} ${tgt}` }); }));
  }
  function tabPlan() {
    const all = scopedProposals();
    if (!state.worklist.length) { mainEl.append(h('div', { class: 'card empty' }, L('Nejdřív přidejte opty do fronty a naskenujte je (záložka ①).', 'First add opps to the queue and scan them (tab ①).'))); return; }
    // přehled týdnů
    const ov = h('div', { class: 'card' }, h('h3', null, L('Přehled týdnů', 'Weekly overview'), h('span', { class: 'sub' }, L(`rozsah ${S.rangeStart} → ${S.rangeEnd}, cíl ${S.perWeek || 3} tasků/týden`, `range ${S.rangeStart} → ${S.rangeEnd}, target ${S.perWeek || 3}/week`))),
      h('div', { class: 'legend' }, h('span', null, h('i', { style: 'background:#e5e9ef' }), L('prázdný', 'empty')), h('span', null, h('i', { style: 'background:#fbd38d' }), L('pod cílem', 'below target')), h('span', null, h('i', { style: 'background:#6cc08b' }), L('splněno', 'met')), h('span', null, h('i', { style: 'background:#4a90d9' }), L('nad cíl', 'above')), h('span', null, h('i', { style: 'background:repeating-linear-gradient(45deg,#bbb 0 3px,#eee 3px 6px)' }), L('obsahuje plánované', 'has planned'))));
    state.worklist.forEach(w => ov.append(h('div', { style: 'display:flex;gap:12px;align-items:center;margin-top:8px' }, h('div', { style: 'width:230px;flex:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap', title: w.name }, h('b', null, w.name)), weekStrip(w.id))));
    mainEl.append(ov);

    // filtr
    let list = all.filter(p => (!filterOpp || p.oppId === filterOpp) && (showCreated || !p.created)).sort((a, b) => (a.oppName + a.date).localeCompare(b.oppName + b.date));
    const visIds = list.filter(p => !p.created).map(p => p.id);
    const selVis = () => list.filter(p => !p.created && proposalSel.has(p.id));

    // hromadné úpravy
    const B = { phase: '', type: '', product: '', audience: '', status: '', priority: '', date: '', shift: '' };
    const typeSel = sel([['', L('— beze změny —', '— no change —')]], '');
    const bPhase = sel([['', L('— beze změny —', '— no change —')], ...PHASES.map(x => x.name)], '', v => { B.phase = v; typeSel.textContent = ''; [['', L('— beze změny —', '— no change —')], ...(v ? typesFor(v) : PHASES.flatMap(x => x.types)).map(t => [t, t])].forEach(([a, b]) => typeSel.append(h('option', { value: a }, b))); B.type = ''; });
    typeSel.onchange = () => { B.type = typeSel.value; };
    PHASES.flatMap(x => x.types).forEach(t => typeSel.append(h('option', { value: t }, t)));
    const nochg = [['', L('— beze změny —', '— no change —')]];
    const bulk = h('div', { class: 'bulk' },
      h('div', { class: 'ttl' }, L('⚡ Hromadné úpravy', '⚡ Bulk edit'), h('span', { class: 'mu' }, L(`vybráno ${selVis().length} z ${visIds.length}`, `${selVis().length} of ${visIds.length} selected`)),
        btn(L('Vybrat vše', 'Select all'), 'sec sm', () => { visIds.forEach(i => proposalSel.add(i)); renderAll(); }), btn(L('Zrušit výběr', 'Clear'), 'sec sm', () => { visIds.forEach(i => proposalSel.delete(i)); renderAll(); })),
      h('div', { class: 'row' },
        fld(L('Fáze', 'Phase'), bPhase), fld('Task Type', typeSel),
        fld('Product', sel([...nochg, ...PRODUCTS], '', v => B.product = v)), fld('Audience', sel([...nochg, ...AUDIENCES], '', v => B.audience = v)),
        fld('Status', sel([...nochg, ...STATUSES], '', v => B.status = v)), fld('Priority', sel([...nochg, ...PRIORITIES], '', v => B.priority = v)),
        fld(L('Nastavit datum', 'Set date'), h('input', { type: 'date', onchange: e => B.date = e.target.value })),
        fld(L('Posunout o dní (±)', 'Shift by days (±)'), h('input', { type: 'number', style: 'width:90px', placeholder: '0', oninput: e => B.shift = e.target.value })),
        btn(L('Použít na vybrané', 'Apply to selected'), '', () => {
          const sl = selVis(); if (!sl.length) { alert(L('Nejdřív zaškrtněte tasky.', 'Tick some tasks first.')); return; }
          sl.forEach(p => {
            const patch = {};
            if (B.phase) { patch.phase = B.phase; if (!typesFor(B.phase).includes(p.type)) patch.type = typesFor(B.phase)[0]; }
            if (B.type) { const ph = PHASES.find(x => x.types.includes(B.type)); if (ph) patch.phase = ph.name; patch.type = B.type; }
            if (B.product) patch.product = B.product; if (B.audience) patch.audience = B.audience; if (B.status) patch.status = B.status; if (B.priority) patch.priority = B.priority;
            if (B.date) patch.date = B.date; else if (+B.shift) patch.date = isoShift(p.date, +B.shift);
            Object.assign(p, patch); if (patch.date) p.week = wkOf(p.date);
            if ((patch.phase || patch.type) && !p.customSubject) p.subject = autoSubject(p);
          });
          saveState(); renderAll(); setStatus(L(`Upraveno ${sl.length} tasků.`, `Edited ${sl.length} tasks.`));
        }),
        h('span', { style: 'flex:1' }),
        btn(L('⎘ Duplikovat vybrané', '⎘ Duplicate selected'), 'sec', () => { const sl = selVis(); sl.forEach(p => { const c = Object.assign({}, p, { id: mkId(), manual: true, created: false, error: '' }); state.proposals.push(c); proposalSel.add(c.id); }); saveState(); renderAll(); }),
        btn(L('🗑 Smazat vybrané', '🗑 Delete selected'), 'sec', () => { const sl = new Set(selVis().map(p => p.id)); if (!sl.size || !confirm(L(`Smazat ${sl.size} návrhů?`, `Delete ${sl.size} proposals?`))) return; state.proposals = state.proposals.filter(p => !sl.has(p.id)); sl.forEach(i => proposalSel.delete(i)); saveState(); renderAll(); })));
    mainEl.append(bulk);

    // tabulka
    const addOpp = sel(state.worklist.map(w => [w.id, w.name]), filterOpp || state.worklist[0].id);
    const addN = h('input', { type: 'number', min: 1, max: 50, value: 1, style: 'width:64px' });
    const card = h('div', { class: 'card' }, h('h3', null, L('Tasky k vytvoření', 'Tasks to create'), h('span', { class: 'sub' }, L('všechna pole lze přepsat přímo v tabulce', 'every field is editable inline'))),
      h('div', { class: 'row', style: 'margin-bottom:10px' },
        fld(L('Opportunity', 'Opportunity'), sel([['', L('Všechny', 'All')], ...state.worklist.map(w => [w.id, w.name])], filterOpp, v => { filterOpp = v; renderAll(); })),
        h('label', { class: 'sw', style: 'height:32px' }, h('input', { type: 'checkbox', checked: showCreated, onchange: e => { showCreated = e.target.checked; renderAll(); } }), L('Zobrazit i vytvořené', 'Show created too')),
        h('label', { class: 'sw', style: 'height:32px' }, h('input', { type: 'checkbox', checked: showExisting, onchange: e => { showExisting = e.target.checked; renderAll(); } }), L('Zobrazit existující z SF', 'Show existing from SF')),
        h('span', { style: 'flex:1' }),
        fld(L('Přidat vlastní tasky', 'Add custom tasks'), h('div', { class: 'row', style: 'gap:6px' }, addOpp, addN, btn(L('＋ Přidat', '＋ Add'), 'ok', () => { addTask(addOpp.value, null, Math.max(1, Math.min(50, +addN.value || 1))); renderAll(); })))));
    if (!list.length) card.append(h('div', { class: 'empty' }, L('Žádné návrhy. Naskenujte frontu nebo přidejte vlastní tasky.', 'No proposals. Scan the queue or add custom tasks.')));
    else {
      const head = h('input', { type: 'checkbox', checked: visIds.length > 0 && visIds.every(i => proposalSel.has(i)), onchange: e => { visIds.forEach(i => e.target.checked ? proposalSel.add(i) : proposalSel.delete(i)); renderAll(); } });
      const rows = list.map(p => {
        const dis = !!p.created;
        const subj = h('input', { type: 'text', value: p.subject, disabled: dis, title: p.error || '', oninput: e => { p.subject = e.target.value; p.customSubject = e.target.value !== autoSubject(p); saveState(); } });
        const tySel = sel(typesFor(p.phase), p.type, v => { p.type = v; if (!p.customSubject) { p.subject = autoSubject(p); subj.value = p.subject; } saveState(); }, { disabled: dis });
        const phSel = sel(PHASES.map(x => x.name), p.phase, v => { p.phase = v; tySel.textContent = ''; typesFor(v).forEach(t => tySel.append(h('option', { value: t }, t))); p.type = typesFor(v)[0]; tySel.value = p.type; if (!p.customSubject) { p.subject = autoSubject(p); subj.value = p.subject; } saveState(); }, { disabled: dis });
        return h('tr', { class: dis ? 'done' : (p.error ? 'err' : '') },
          h('td', null, dis ? h('span', { class: 'pill g' }, '✓') : h('input', { type: 'checkbox', checked: proposalSel.has(p.id), onchange: e => { e.target.checked ? proposalSel.add(p.id) : proposalSel.delete(p.id); renderAllSoft(); } })),
          h('td', { style: 'min-width:130px' }, h('b', null, p.oppName), p.manual ? h('div', { class: 'mu' }, L('vlastní', 'custom')) : null),
          h('td', { style: 'min-width:128px' }, h('input', { type: 'date', value: p.date, disabled: dis, onchange: e => { if (e.target.value) setP(p, { date: e.target.value }); } })),
          h('td', { style: 'min-width:112px' }, phSel), h('td', { style: 'min-width:170px' }, tySel), h('td', { style: 'min-width:190px' }, subj),
          h('td', { style: 'min-width:130px' }, sel(PRODUCTS, p.product, v => { p.product = v; saveState(); }, { disabled: dis })),
          h('td', { style: 'min-width:160px' }, sel(AUDIENCES, p.audience || S.audience, v => { p.audience = v; saveState(); }, { disabled: dis })),
          h('td', { style: 'min-width:110px' }, sel(STATUSES, p.status || 'Completed', v => { p.status = v; saveState(); }, { disabled: dis })),
          h('td', { style: 'min-width:80px' }, sel(PRIORITIES, p.priority || 'Normal', v => { p.priority = v; saveState(); }, { disabled: dis })),
          h('td', { style: 'white-space:nowrap;text-align:right' },
            dis ? h('span', { class: 'pill g' }, L('vytvořeno', 'created')) : [
              btn('▶', 'ico', () => runOne(p), { title: L('Vytvořit jen tento task', 'Create only this task'), disabled: busy }), ' ',
              btn('⎘', 'ico', () => { const c = Object.assign({}, p, { id: mkId(), manual: true, error: '' }); state.proposals.push(c); proposalSel.add(c.id); saveState(); renderAll(); }, { title: L('Duplikovat', 'Duplicate') }), ' ',
              btn('✕', 'ico', () => { state.proposals = state.proposals.filter(x => x.id !== p.id); proposalSel.delete(p.id); saveState(); renderAll(); }, { title: L('Smazat', 'Delete') })]));
      });
      card.append(h('div', { class: 'tw', style: 'max-height:56vh' }, h('table', null,
        h('thead', null, h('tr', null, h('th', null, head), h('th', null, 'Opportunity'), h('th', null, L('Datum', 'Date')), h('th', null, L('Fáze', 'Phase')), h('th', null, 'Task Type'), h('th', null, L('Předmět', 'Subject')), h('th', null, 'Product'), h('th', null, 'Audience'), h('th', null, 'Status'), h('th', null, 'Priority'), h('th'))),
        h('tbody', null, rows))));
    }
    if (showExisting) {
      const ex = []; state.worklist.filter(w => !filterOpp || w.id === filterOpp).forEach(w => ((state.existing[w.id] || {}).tasks || []).forEach(t => ex.push({ opp: w.name, t })));
      ex.sort((a, b) => (a.t.dueIso || a.t.week || '').localeCompare(b.t.dueIso || b.t.week || ''));
      card.append(h('h3', { style: 'margin:14px 0 6px' }, L(`Existující tasky v Salesforce (${ex.length})`, `Existing tasks in Salesforce (${ex.length})`)),
        h('div', { class: 'tw', style: 'max-height:30vh' }, h('table', null, h('thead', null, h('tr', null, h('th', null, 'Opportunity'), h('th', null, L('Datum', 'Date')), h('th', null, L('Předmět', 'Subject')))),
          h('tbody', null, ex.map(x => h('tr', { class: 'exist' }, h('td', null, x.opp), h('td', null, x.t.dueIso || x.t.due || '—'), h('td', null, x.t.subject)))))));
    }
    mainEl.append(card);
  }
  /* změna výběru bez překreslení celé tabulky (zachová scroll a rozeditovaná pole) */
  function renderAllSoft() {
    const pr = scopedProposals(), created = pr.filter(p => p.created).length, n = pr.filter(p => !p.created && proposalSel.has(p.id)).length;
    runBtn.textContent = L(`▶ Vytvořit vybrané (${n})`, `▶ Create selected (${n})`); runBtn.disabled = !n || busy;
    const chip = chipsEl.children[3]; if (chip) { chip.textContent = ''; chip.append(L('Zvoleno k vytvoření: ', 'Selected: '), h('b', null, n)); }
    const ttl = mainEl.querySelector('.bulk .mu'); if (ttl) ttl.textContent = L(`vybráno ${n} z ${pr.filter(p => !p.created).length}`, `${n} of ${pr.filter(p => !p.created).length} selected`);
  }

  /* ---------- ③ NASTAVENÍ ---------- */
  function tabSettings() {
    const num = (v, d) => Math.max(1, Math.min(50, +v || d));
    const seg = (items, cur, on) => h('div', { class: 'seg' }, items.map(([v, t, tip]) => h('button', { class: cur === v ? 'on' : '', title: tip || '', onclick: () => on(v) }, t)));
    mainEl.append(h('div', { class: 'grid2' },
      h('div', { class: 'card' }, h('h3', null, L('Výchozí hodnoty nových tasků', 'Defaults for new tasks')), h('div', { class: 'row' },
        fld('Product', sel(PRODUCTS, S.product, v => { S.product = v; saveState(); })), fld('Audience', sel(AUDIENCES, S.audience, v => { S.audience = v; saveState(); })),
        fld('Status', sel(STATUSES, S.status, v => { S.status = v; saveState(); })), fld('Priority', sel(PRIORITIES, S.priority, v => { S.priority = v; saveState(); }))),
        h('div', { class: 'hint', style: 'margin-top:8px' }, L('Platí pro nově generované tasky. Existující návrhy změníte v tabulce nebo hromadně v záložce ②. „Not Started“ = status se nemění.', 'Applies to newly generated tasks. Change existing proposals in tab ② (inline or bulk). “Not Started” = status is left untouched.'))),
      h('div', { class: 'card' }, h('h3', null, L('Plánování', 'Planning')), h('div', { class: 'row' },
        fld(L('Tasky od', 'Tasks from'), h('input', { type: 'date', value: S.rangeStart, onchange: e => { S.rangeStart = e.target.value; saveState(); } })),
        fld(L('Tasky do', 'Tasks to'), h('input', { type: 'date', value: S.rangeEnd, onchange: e => { S.rangeEnd = e.target.value; saveState(); } })),
        fld(L('Tasků týdně', 'Tasks / week'), h('input', { type: 'number', min: 1, max: 50, value: S.perWeek || 3, style: 'width:80px', onchange: e => { S.perWeek = num(e.target.value, 3); e.target.value = S.perWeek; saveState(); } })),
        fld(L('Min. pravděpodobnost opty (%)', 'Min. probability (%)'), h('input', { type: 'number', min: 0, max: 100, value: S.minProb, style: 'width:90px', onchange: e => { S.minProb = +e.target.value || 0; saveState(); } })),
        btn(L('↻ Přepočítat plán', '↻ Recompute plan'), '', () => { recompute(); gotoTab('plan'); }))),
      h('div', { class: 'card' }, h('h3', null, L('Rychlost vyplňování', 'Filling speed')),
        seg(PACES(), String(S.pace || '1'), v => { S.pace = v; PACE = +v; saveState(); renderAll(); }),
        h('div', { class: 'hint', style: 'margin-top:8px' }, PACES().find(x => x[0] === String(S.pace || '1'))[2] + L('. Kroky se čekají jen tak dlouho, jak je potřeba; při chybě se task automaticky zkusí ještě jednou.', '. Steps wait only as long as needed; a failed task is retried once.'))),
      h('div', { class: 'card' }, h('h3', null, L('Ukládání a datum', 'Saving & date')),
        h('label', { class: 'sw' }, h('input', { type: 'checkbox', checked: !!S.autosave, onchange: e => { S.autosave = e.target.checked; saveState(); } }), L('Automaticky klikat na Save', 'Click Save automatically')),
        h('div', { class: 'row', style: 'margin-top:10px' }, fld(L('Formát data (Due Date)', 'Date format (Due Date)'), sel(DATEFMTS.map(f => [f, f === 'auto' ? L('Auto (zjistit z pole)', 'Auto (detect)') : f]), S.dateFormat || 'auto', v => { S.dateFormat = v; saveState(); }))),
        h('div', { class: 'hint', style: 'margin-top:8px' }, L('Pamět: ', 'Storage: ') + STORAGE + L(' · Nic se neodesílá mimo prohlížeč.', ' · Nothing leaves your browser.'))),
      h('div', { class: 'card' }, h('h3', null, L('Údržba', 'Maintenance')), h('div', { class: 'row' },
        btn(L('Smazat vytvořené z plánu', 'Clear created from plan'), 'sec', () => { state.proposals = state.proposals.filter(p => !p.created); saveState(); renderAll(); }),
        btn(L('Vymazat všechna data', 'Reset all data'), 'sec', () => { if (confirm(L('Smazat frontu, plán i nastavení?', 'Delete queue, plan and settings?'))) { state.worklist = []; state.proposals = []; state.existing = {}; saveState(); renderAll(); } })))));
  }

  /* ---------- spouštění vytváření ---------- */
  async function runSelected() {
    const chosen = todo().filter(p => proposalSel.has(p.id)); if (!chosen.length || busy) return;
    const bad = chosen.filter(p => missingFields(p).length);
    if (bad.length) { bad.forEach(p => { p.error = L('Chybí: ', 'Missing: ') + missingFields(p).join(', '); }); saveState(); alert(L(`U ${bad.length} tasků chybí povinná pole (označeno červeně). Doplňte je.`, `${bad.length} tasks have missing required fields (marked red).`)); renderAll(); return; }
    const auto = !!S.autosave;
    if (!confirm(L(`Vytvořit ${chosen.length} tasků${auto ? ' a automaticky je ULOŽIT (Save)?' : ' (Save klikáte ručně u každého)?'}`, `Create ${chosen.length} tasks${auto ? ' and SAVE them automatically?' : ' (you click Save manually)?'}`))) return;
    if (mode() === 'list') ensureChild(PWIN.location.origin + `/lightning/r/Opportunity/${chosen[0].oppId}/view`);
    busy = true; progBar.style.width = '0'; renderAll();
    try { await fillSelected(chosen, auto, log, setStatus); } finally { busy = false; chosen.forEach(p => { if (p.created) proposalSel.delete(p.id); }); renderAll(); }
  }
  async function runOne(p) {
    if (busy) return;
    if (mode() === 'list') ensureChild(PWIN.location.origin + `/lightning/r/Opportunity/${p.oppId}/view`);
    busy = true; p.__single = true; renderAll(); setStatus(L('Vyplňuji: ', 'Filling: ') + p.subject); wake.on();
    try { p.error = ''; const ok = await createTaskForProposal(p, !!S.autosave, log); if (ok) { p.created = true; proposalSel.delete(p.id); } log(L('Hotovo — ', 'Done — ') + p.subject); }
    catch (e) { p.error = e.message; log(L('CHYBA: ', 'ERROR: ') + e.message); }
    finally { delete p.__single; busy = false; wake.off(); saveState(); renderAll(); }
  }

  /* ---------- start ---------- */
  if (!S.rangeStart) S.rangeStart = localIso(fiscalHalfStart());
  if (!S.rangeEnd) S.rangeEnd = localIso(new Date());
  if (!S.dateFormat) S.dateFormat = 'auto';
  if (!PRODUCTS.includes(S.product)) S.product = 'PowerStore';
  if (!S.pace) S.pace = '1';
  saveState();
  if (state.proposals.length && mode() === 'list') TAB = 'plan';
  setStatus(L('Připraveno.', 'Ready.'));
  log(L('AutoTask Planner spuštěn. Režim: ', 'AutoTask Planner started. Mode: ') + mode() + ' · ' + PWIN.location.pathname + ' · ' + L('formát data: ', 'date format: ') + (S.dateFormat || 'auto'));
  renderAll();
  let lastHref = PWIN.location.href;
  const navTimer = setInterval(() => { if (!PDOC.body.contains(panel)) { clearInterval(navTimer); return; } if (PWIN.location.href !== lastHref) { lastHref = PWIN.location.href; if (!busy) renderAll(); } }, 800);
} catch (e) { __atFatal(e); } };
