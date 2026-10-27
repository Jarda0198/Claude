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
(async () => { try { await (async () => {
  const ID = 'autotask-planner-panel';
  const existing = document.getElementById(ID);
  if (existing && !window.__AUTOTASK_AUTOLOAD) { existing.remove(); return; }
  if (existing) return;

  const PRODUCTS = ["No Product", "AI InfiniBand", "AIOps APM", "AIOps - Infrastructure (CloudIQ)", "AI Partners & ISVs", "Ansible Modules", "APEX ACP Azure", "APEX ACP OpenShift", "APEX ACP VMware", "APEX Backup Services", "APEX Block Storage", "APEX Cloud Platforms", "APEX DSS File", "APEX File Storage", "APEX Navigator", "APEX Unstructured", "AppSync", "Avamar", "Azure Stack", "BeyondEdge", "Brocade Fabric", "Canonical", "CEPH", "CI", "Cisco", "Cloud Native DP", "Cloud Strategy", "Connectrix", "Container", "CyberSense", "Data Management Frameworks", "Data Mgmt. Partner", "Data Protection Suite", "Data Science", "Data Security Partners", "DDBEA", "DDVE", "Dell AI Data Platform", "Dell AI Factory", "Dell AI Use Cases", "Dell Automation Platform", "Dell Data Lakehouse", "Dell Developer Cloud", "Dell Enterprise Hub", "Dell Enterprise SONiC", "Dell Managed Service", "DLm", "Dorado Software", "DPA", "ECS/ObjectScale", "EI - Cooling", "EI - Power", "Faction", "GPU Servers (AI Optimized)", "HYCU", "IDPA", "Infra Automation Suite", "Infrastructure as Code (IAC)", "Infrastructure Block", "iSeries (AS400)", "Mainframe", "Managed Container Services", "MetalSoft", "Metronode", "NativeEdge", "Networker", "Networking - Edge", "NSX", "Nutanix", "NVIDIA Spectrum", "OpenManage Enterprise", "Open Telecom Ecosystem Lab", "PowerEdge", "PowerFlex", "PowerMax", "PowerPath", "PowerProtect Cyber Recovery", "PowerProtect Data Domain", "PowerProtect Data Manager", "PowerProtect DM5500", "PowerScale", "PowerStore", "PowerSwitch-AI", "PowerSwitch-Core Network", "PowerSwitch-Leaf Network", "PowerVault", "Project Lightning", "RecoverPoint", "Red Hat", "RP4VMS", "SC Series", "SDP", "SDWAN", "Security Services", "SFM", "SmartFabric OS10", "SRM", "Storage Defender CDM", "Superna", "SUSE", "Unity", "Unstruct. Storage Partners", "VCF on VxRail", "VDI", "VEP Series", "VMware", "VPLEX", "VSAN Ready Node", "VxRail", "XtremIO"];
  const AUDIENCES = ['Customer In-person','Customer Remote','Partner In-person','Partner Remote','Internal'];
  /* kategorie a typy tasků podle Customer_Interaction_Task_List.pdf */
  const PHASES = [
    { name:"Account Strategy and Demand", types:["Account Plan/Profile/TAP", "CSC/EBC Single Customer Event", "Customer QBR", "Product Certification", "Roadmap or Tech Update", "Solution/Blueprint/Portfolio Positioning", "Technical Workshop (2+ hour)"] },
    { name:"Discover", types:["Asset/Workload/Environment", "Early Cycle EBC/CSC", "Lead-in Demo", "Requirements Gathering", "Solution High-Level", "Technical Deep-Dive"] },
    { name:"Analyze", types:["Cloud Assessment", "Product Analysis/Assessment", "Workload or App Analysis"] },
    { name:"Design", types:["Presentation/Proposal Creation", "RFP or Bid response", "Services Design/Scope", "Solution Design/Validation"] },
    { name:"Defend", types:["Closing Demo", "Competitive/Alternative Compare", "Proof of Concept (CSC)", "Proof of Value", "Proposal Review/Presentation"] },
    { name:"Enablement", types:["Deliver Training Session", "Demo Analysis/Design", "Demo/Seed Unit Engagement", "Solution Offering Creation", "Technical/Business Event"] },
    { name:"GTO/CTO Activities (PG Interlock & Activation)", types:["Blog Contribution", "Engage CSC to Build a New Demo", "Engage PG on Documentation Creation"] },
    { name:"Post Sales", types:["Customer Satisfaction Issue", "Engage with Support on SR Escalation", "Installation/Configuration Support", "Presales Services Handover", "Welcome Kit"] }
  ];
  /* pořadí, ve kterém se tasky plánují automaticky (průběh obchodního případu) */
  const FLOW = ['Discover','Analyze','Design','Defend'].map(n=>PHASES.find(p=>p.name===n));
  const MIN_PER_WEEK = 3;
  let PACE = 1; const BETWEEN_TASKS = 450;

  /* panel zawsze w oknie uruchomienia; CTX = aktywny kontekst operacji (parent lub child) */
  const PDOC = document, PWIN = window;
  let CTX = { doc: document, win: window };

  const norm = s => (s||'').toLowerCase().replace(/\s+/g,' ').trim();
  const txt = (n)=>(n?(n.textContent||'').trim().replace(/\s+/g,' '):'');
  const isVisible = (e)=>{ if(!(e && (e.offsetWidth||e.offsetHeight||(e.getClientRects&&e.getClientRects().length)))) return false; try{ if(e.checkVisibility && !e.checkVisibility({visibilityProperty:true,contentVisibilityAuto:true})) return false; }catch(err){} return true; };
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
    const scrollAll=()=>{ try{ deepAll('.timeline, [class*="activityTimeline"], .pastActivities, .upcomingActivities, .past-activity-groups, .upcoming-activity-groups, [class*="scroller"], .scrollable, .windowViewMode-normal, .oneContent, .slds-scrollable_y').forEach(c=>{ try{ c.scrollTop=c.scrollHeight; }catch(err){} }); (CTX.win||window).scrollTo(0,((CTX.doc||document).body||{}).scrollHeight||99999); }catch(err){} };
    const t0=Date.now(); const got=await waitFor(()=>{ scrollAll(); return countTasks()>0||/no past activity|no next steps|no activities to show|no upcoming|nothing planned|get started by logging/i.test(bodyText()); },14000,400);
    await waitFor(()=>!deepAll('lightning-spinner, .slds-spinner_container, .slds-spinner').some(isVisible),8000,300);
    trace('sken: aktivity '+(got?(countTasks()>0?'nalezeny (odkazů na tasky: '+countTasks()+')':'prázdné („No past activity“)'):'NENAČTENY do 14 s')+' po '+Math.round((Date.now()-t0)/100)/10+' s');
    let prev=-1; for(let i=0;i<8;i++){ deepAll('a,button').filter(b=>/view all|show (all|more)|load more|more activities|up next|overdue/i.test(txt(b))).slice(0,8).forEach(b=>{ try{b.click();}catch(e){} }); deepAll('.timeline, [class*="activityTimeline"], .pastActivities, .upcomingActivities, .past-activity-groups, .upcoming-activity-groups, [class*="scroller"], .scrollable').forEach(c=>{ try{ c.scrollTop=c.scrollHeight; }catch(e){} }); try{ (CTX.win||window).scrollTo(0,((CTX.doc||document).body||{}).scrollHeight||0); }catch(e){} await sleep(700); const c=countTasks(); if(c===prev && i>=2) break; prev=c; } await sleep(400); return !!deepOne('.pastActivities, .past-activity-groups, .upcomingActivities, .upcoming-activity-groups, .timeline') || countTasks()>0; }
  function scanActivities(){ const tasks=[]; const seenEl=new Set(); const seenId=new Set(); const sel='.pastActivities .row.Task, .past-activity-groups .row.Task, .upcomingActivities .row.Task, .upcoming-activity-groups .row.Task, [class*="activityTimeline"] [class*="Task"], .timeline .row.Task'; const rows=deepAll(sel); deepAll('a[href*="/lightning/r/00T"]').forEach(a=>{ const r=(a.closest&&(a.closest('.row')||a.closest('li')||a.closest('.slds-timeline__item')))||a; rows.push(r); }); rows.forEach(r=>{ if(!r||seenEl.has(r)) return; seenEl.add(r); const link=deepOne('a[href*="/lightning/r/00T"], a.subjectLink',r); const href=link&&(link.getAttribute('href')||''); const idm=href&&href.match(/(00T[0-9A-Za-z]{12,15})/); const id=idm?idm[1]:null; if(id){ if(seenId.has(id)) return; seenId.add(id); } const subj=txt(deepOne('.subjectText, .subjectLink',r))||txt(link); if(!subj) return; let due=txt(deepOne('.dueDate, [class*="dueDate"], [class*="DueDate"]',r)); if(!due){ const mt=(txt(r)||'').match(/(\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}|\d{1,2}[-\/.]\d{1,2}[-\/.]\d{2,4}|[A-Za-z]{3,}\.?\s+\d{1,2}(?:,?\s*\d{4})?|\d{1,2}\s+[A-Za-z]{3,}(?:,?\s*\d{4})?)/); due=mt?mt[1]:''; } tasks.push({ id, subject:subj, due, dueDate:parseActivityDate(due) }); }); return tasks; }
  function phaseRank(subject){ const s=(subject||'').toLowerCase(); const pm=s.match(/^\s*(discover|analyze|design|defend)\b/); if(pm) return ['discover','analyze','design','defend'].indexOf(pm[1]); if(/requirement|deep.?dive|workload|environment|discover|lead.?in/.test(s)) return 0; if(/assess|analysis|analyz|cloud/.test(s)) return 1; if(/design|proposal|presentation|rfp|scope|validation/.test(s)) return 2; if(/demo|proof|poc|competitive|alternative|defend|review/.test(s)) return 3; return -1; }
  /* hooky pro UI */
  let onProgress=()=>{};
  let recordRootFn=null; /* UI nastaví: vrací kořen aktivní stránky záznamu (v konzoli je v DOM víc záložek) */
  function missingFields(p){ const m=[]; if(!p.date) m.push('Due Date'); if(!p.status) m.push('Status'); if(!p.phase) m.push('Category'); if(!p.type) m.push('Task Type'); if(!p.audience) m.push('Audience'); if(!p.product) m.push('Product'); if(!p.priority) m.push('Priority'); if(!(p.subject||'').trim()) m.push('Subject'); return m; }
  const mkId=()=>'m-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  const STATUSES=['Completed','Not Started','In Progress','Waiting on someone else','Deferred'];
  function mergeProposals(oppId, props){ const keep=state.proposals.filter(p=>p.oppId===oppId&&p.manual&&!p.created); state.proposals=state.proposals.filter(p=>p.oppId!==oppId).concat(props,keep); }
  function buildProposals(opp, existingTasks){ const startIso=state.settings.rangeStart||localIso(fiscalHalfStart()); const endIso=state.settings.rangeEnd||localIso(new Date()); const perWeek=Math.max(1,+state.settings.perWeek||3); const weeks=weeksForRange(new Date(startIso+'T12:00:00'), new Date(endIso+'T12:00:00')); let maxRank=-1; existingTasks.forEach(t=>{ const r=phaseRank(t.subject); if(r>maxRank) maxRank=r; }); let planIndex=maxRank+1; const out=[]; weeks.forEach((w,wi)=>{ const key=weekKey(w); const count=existingTasks.filter(t=>t.dueDate&&weekKey(t.dueDate)===key).length; const need=Math.max(0,perWeek-count); const phase=FLOW[Math.min(planIndex+wi,FLOW.length-1)]; for(let slot=0;slot<need;slot++){ const date=new Date(w); date.setDate(date.getDate()+Math.min(4,slot+1)); let di=localIso(date); if(di<startIso) di=startIso; if(di>endIso) di=endIso; const type=phase.types[slot%phase.types.length]; out.push({ id:'p-'+opp.id+'-'+di+'-'+slot, oppId:opp.id, oppName:opp.name, week:key, date:di, phase:phase.name, type, subject:phase.name+' - '+type, product:state.settings.product, audience:state.settings.audience, status:state.settings.status||'Completed', priority:state.settings.priority||'Normal' }); } }); return out; }

  /* ---------- kreator Global Presales Task (Aura; dziala na CTX) ---------- */
  function menuOpen(){ return deepAll('a.select[aria-expanded="true"], div.uiMenuList.visible').some(isVisible); }
  function composerOpen(){ return deepAll('input[aria-label="Subject"]').some(isVisible); }
  function findSaveButton(){ return deepAll('button').find(b=>isVisible(b)&&/^save$/i.test(((b.getAttribute&&b.getAttribute('title'))||b.textContent||'').trim())); }
  function formScope(){ try{ const sub=deepAll('input[aria-label="Subject"]').find(isVisible); const m=sub&&sub.closest&&sub.closest('[role="dialog"], section.slds-modal, .modal-container, .uiModal'); return m||CTX.doc; }catch(err){ return CTX.doc; } }
  async function closeAnyForm(logfn){ let n=0; for(let i=0;i<6&&composerOpen();i++){ const sc=formScope(); const btns=deepAll('button',sc).filter(isVisible); const lab=b=>((b.getAttribute&&(b.getAttribute('title')||b.getAttribute('aria-label')))||b.textContent||'').trim(); const cancel=btns.find(b=>/^(cancel|zrušit)$/i.test(lab(b))); const x=btns.find(b=>/^(close|zavřít)$/i.test(lab(b))); const t=cancel||x; if(!t) break; t.click(); n++; await psleep(700); const disc=deepAll('button').filter(isVisible).find(b=>/^(discard|discard changes|don.?t save|zahodit)/i.test(txt(b))); if(disc){ disc.click(); await psleep(500); } } if(n&&logfn) logfn(L('Zavřen nedokončený formulář ('+n+'×).','Closed an unfinished form ('+n+'×).')); }
  function diag(){ try{ const bs=deepAll('button').filter(isVisible).map(b=>((b.getAttribute&&b.getAttribute('title'))||b.textContent||'').trim().replace(/\s+/g,' ')).filter(Boolean).slice(0,40); return '\n   DIAG url='+((CTX.win||window).location.pathname)+'\n   viditelná tlačítka: '+bs.join(' ; '); }catch(err){ return ''; } }
  async function openForm(logfn,p){ try{ return await openFormRaw(logfn,p); }catch(err){ err.message+=diag(); throw err; } }
  /* tlačítka „More Standard Task Actions“; ta ve viditelné části okna mají přednost (v konzoli bývá víc záložek) */
  function candBtns(){ let root=null; try{ root=recordRootFn?recordRootFn():null; }catch(err){} let all=deepAll('button[title="More Standard Task Actions"]',root||CTX.doc).filter(isVisible); if(!all.length&&root) all=deepAll('button[title="More Standard Task Actions"]').filter(isVisible); const inView=(b)=>{ try{ const r=b.getBoundingClientRect(); const W=(CTX.win||window); return r.width>0&&r.height>0&&r.bottom>0&&r.top<(W.innerHeight||800)&&r.right>0&&r.left<(W.innerWidth||1200); }catch(err){ return false; } }; return all.map((b,i)=>({b,i,v:inView(b)?0:1})).sort((x,y)=>x.v-y.v||x.i-y.i).map(x=>x.b); }
  function relatedInfo(p){ try{ if(!p||!p.oppName) return {ok:true,found:''}; const sc=formScope(); const t=(sc.innerText||sc.textContent||'').replace(/\s+/g,' '); const m=t.match(/Related To[^]{0,120}?Current Selection:\s*(.+?)\s*\((?:Opportunity)\)/i); if(!m) return {ok:true,found:''}; const found=m[1].trim(); const n=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,''); const a=n(found); const names=[p.oppName].concat(p.oppAlt||[]).map(n).filter(Boolean); const okk=!a||!names.length||names.some(b=>a.includes(b)||b.includes(a)); return {ok:okk,found}; }catch(err){ return {ok:true,found:''}; } }
  async function openFormRaw(logfn,p){
    let lastFound='';
    for(let skip=0; skip<8; skip++){
      await openFormOnce(logfn,skip);
      const ri=relatedInfo(p); if(ri.ok){ if(ri.found&&logfn) logfn('Related To: '+ri.found); return; }
      lastFound=ri.found; if(logfn) logfn(L('Formulář patří jiné opportunity („'+ri.found+'“), ne „'+p.oppName+'“ – zkouším další tlačítko…','Form belongs to another opportunity („'+ri.found+'“), not „'+p.oppName+'“ – trying the next button…'));
      await closeAnyForm(logfn); await psleep(500);
      if(candBtns().length<=skip+1) break;
    }
    const er=new Error(L('Nepodařilo se otevřít formulář pro opportunity „'+(p&&p.oppName)+'“ (nalezen jen formulář pro „'+lastFound+'“). Zavřete ostatní záložky/opportunity a zkuste znovu.','Could not open the form for „'+(p&&p.oppName)+'“ (only found one for „'+lastFound+'“). Close other tabs/opportunities and retry.')); er.noRetry=true; throw er;
  }
  async function openFormOnce(logfn,skip){ await closeAnyForm(logfn); try{ if(CTX.win&&CTX.win!==PWIN) CTX.win.focus(); }catch(e){} const menuBtn=await pwaitFor(()=>candBtns()[skip||0],4000); if(!menuBtn) throw new Error(L('Nenalezeno „More Standard Task Actions" (otevřete opty se záložkou Activity).','"More Standard Task Actions" not found (open an opportunity with the Activity tab).')); menuBtn.focus(); menuBtn.click(); const item=await pwaitFor(()=>deepFind('a[role="menuitem"]',a=>a.textContent.includes('Global Presales Task')&&isVisible(a)),4000); if(!item) throw new Error(L('V menu nebyla nalezena položka „Global Presales Task".','"Global Presales Task" item not found in the menu.')); item.focus(); item.click(); await waitForFormReady(); const max=deepFirst('button[title="Maximize"]'); if(max){ max.focus(); max.click(); await psleep(500); await waitForFormReady(); } if(logfn) logfn(L('Formulář otevřen.','Form opened.')); }
  async function waitForFormReady(){ const subj=await pwaitFor(()=>deepFind('input[aria-label="Subject"]',isVisible),8000); if(!subj) throw new Error(L('Formulář se nevykreslil (chybí pole Subject).','Form did not render (no Subject field).')); await pwaitFor(()=>deepAll('a.select').some(a=>['Not Started','Completed'].includes(a.textContent.trim())&&isVisible(a)),6000); await pwaitFor(()=>!deepAll('lightning-spinner, .slds-spinner_container, .slds-spinner').some(isVisible),8000); await psleep(600); }
  function setSubject(text){ const input=deepFirst('input[aria-label="Subject"]'); if(!input) throw new Error('Chybí pole Subject.'); nativeSet(input,text,['input','change']); }
  function dueDateEl(){ const label=[...CTX.doc.querySelectorAll('label')].find(l=>l.textContent.includes('Due Date')); const container=label&&label.closest('.slds-form-element'); return (container&&container.querySelector('input.slds-input'))||CTX.doc.querySelector('lightning-datepicker input.slds-input')||null; }
  function dueScope(){ const el0=dueDateEl(); let n=el0; for(let i=0;i<8&&n;i++){ n=n.parentElement||(n.getRootNode&&n.getRootNode().host); if(!n) break; const t=(n.innerText||n.textContent||''); if(/Due Date/i.test(t)&&t.length<600) return n; } return null; }
  function dueScopeText(){ try{ const s=dueScope(); return s?(s.innerText||s.textContent||''):''; }catch(err){ return ''; } }
  function fmtFromHelperText(iso){ const parts=String(iso).split('-'); if(parts.length!==3) return null; const [Y,M,D]=parts; const el=dueDateEl(); const t=dueScopeText().replace(/\s+/g,' '); let m=t.match(/format:?\s*31([^\d])12\1(\d{4})/i); if(m) return D+m[1]+M+m[1]+Y; m=t.match(/format:?\s*12([^\d])31\1(\d{4})/i); if(m) return M+m[1]+D+m[1]+Y; m=t.match(/format:?\s*(\d{4})([^\d])12\2\s*31/i); if(m) return Y+m[2]+M+m[2]+D; return null; }
  function fmtGuessFromPlaceholder(iso){ const parts=String(iso).split('-'); if(parts.length!==3) return null; const [Y,M,D]=parts; const fh=fmtFromHelperText(iso); if(fh) return fh; const el=dueDateEl(); let ph=(el&&(el.getAttribute('placeholder')||el.placeholder)||'').trim(); if(!ph) return null; const low=ph.toLowerCase(); const sepM=ph.match(/[^A-Za-z0-9]/); const sep=sepM?sepM[0]:'/'; const iD=low.indexOf('d'), iM=low.indexOf('m'), iY=low.indexOf('y'); const order=[['d',iD],['m',iM],['y',iY]].filter(x=>x[1]>=0).sort((a,b)=>a[1]-b[1]).map(x=>x[0]); if(order.length!==3) return null; const map={d:D,m:M,y:Y}; return order.map(k=>map[k]).join(sep); }
  function fmtForPicker(iso){ const parts=String(iso).split('-'); if(parts.length!==3) return iso; const [Y,M,D]=parts; const fmt=(state.settings&&state.settings.dateFormat)||'auto'; if(fmt!=='auto'){ switch(fmt){ case 'MM/DD/YYYY': return M+'/'+D+'/'+Y; case 'DD/MM/YYYY': return D+'/'+M+'/'+Y; case 'YYYY-MM-DD': return Y+'-'+M+'-'+D; case 'DD.MM.YYYY': return D+'.'+M+'.'+Y; case 'DD-MM-YYYY': return D+'-'+M+'-'+Y; default: break; } } const g=fmtGuessFromPlaceholder(iso); return g||(M+'/'+D+'/'+Y); }
  function dateCandidates(iso){ const parts=String(iso).split('-'); if(parts.length!==3) return [iso]; const [Y,M,D]=parts; const all={'MM/DD/YYYY':M+'/'+D+'/'+Y,'DD/MM/YYYY':D+'/'+M+'/'+Y,'YYYY-MM-DD':Y+'-'+M+'-'+D,'DD.MM.YYYY':D+'.'+M+'.'+Y,'DD-MM-YYYY':D+'-'+M+'-'+Y}; const fmt=(state.settings&&state.settings.dateFormat)||'auto'; if(fmt!=='auto'&&all[fmt]) return [all[fmt]]; const g=fmtGuessFromPlaceholder(iso); const order=[g,all['DD.MM.YYYY'],all['MM/DD/YYYY'],all['DD/MM/YYYY'],all['DD-MM-YYYY'],all['YYYY-MM-DD']].filter(Boolean); return [...new Set(order)]; }
  function dueFormatError(){ const el=dueDateEl(); if(!el) return false; if(/does not match the allowed format|entry does not match|není ve formátu|neodpovídá/i.test(dueScopeText())) return true; const cont=el.closest&&el.closest('.slds-form-element'); if(cont){ if(/slds-has-error/.test(cont.className||'')){ const err=cont.querySelector('.slds-form-element__help, [role="alert"]'); if(err&&/match|format|pasuje|niepoprawn|invalid|poprawn/i.test(txt(err))) return true; } } if(el.getAttribute&&/match|format|invalid/i.test(el.getAttribute('aria-errormessage')||'')) return true; return false; }
  function formatIso(iso, fmtStr){ const parts=String(iso).split('-'); if(parts.length!==3) return null; const [Y,M,D]=parts; return fmtStr.replace(/YYYY/,Y).replace(/DD/,D).replace(/MM/,M); }
  function fmtFromErrorExample(){ const el=dueDateEl(); if(!el) return null; const cont=el.closest&&el.closest('.slds-form-element'); const errEl=cont&&cont.querySelector('.slds-form-element__help, [role="alert"]'); const msg=(errEl?txt(errEl):'')||dueScopeText().replace(/\s+/g,' '); if(!msg) return null; const m=msg.match(/(\d{1,4})([^0-9A-Za-z])(\d{1,2})\2(\d{1,4})/); if(!m) return null; const strs=[m[1],m[3],m[4]]; const nums=strs.map(Number); const sep=m[2]; let yi=strs.findIndex(s=>s.length===4); if(yi<0) yi=nums.findIndex(n=>n>31); if(yi<0) return null; let di=[0,1,2].find(i=>i!==yi&&nums[i]>12); if(di==null) di=[0,1,2].find(i=>i!==yi); const mi=[0,1,2].find(i=>i!==yi&&i!==di); const tok={}; tok[yi]='YYYY'; tok[di]='DD'; tok[mi]='MM'; return [tok[0],tok[1],tok[2]].join(sep); }
  function applyDue(input,str){ const W=input.ownerDocument&&input.ownerDocument.defaultView||CTX.win||window; input.focus(); nativeSet(input,'',['input']); nativeSet(input,str,['input','change']); const ko={bubbles:true,cancelable:true,keyCode:13,key:'Enter',which:13,view:W}; ['keydown','keyup'].forEach(t=>input.dispatchEvent(new (W.KeyboardEvent||KeyboardEvent)(t,ko))); input.dispatchEvent(new (W.Event||Event)('change',{bubbles:true})); input.dispatchEvent(new (W.Event||Event)('blur',{bubbles:true})); }
  function setDueDate(value){ const input=dueDateEl(); if(!input) throw new Error(L('Chybí pole Due Date.','Due Date field not found.')); applyDue(input, fmtForPicker(value)); return input; }
  async function ensureDueDate(value, logfn){ const input=dueDateEl(); if(!input){ if(logfn) logfn(L('Chybí pole Due Date.','Due Date field not found.')); return false; } let cands=dateCandidates(value); const tried=new Set(); let i=0; while(i<cands.length && tried.size<8){ const cand=cands[i++]; if(cand==null||tried.has(cand)) continue; tried.add(cand); applyDue(input, cand); await psleep(700); const v=(input.value||'').trim(); let err=dueFormatError(); if(!err){ await psleep(300); err=dueFormatError(); } if(v && !err){ if(logfn && tried.size>1) logfn(L('  Due Date — přijatý formát: ','  Due Date — accepted format: ')+cand); return true; } const efmt=fmtFromErrorExample(); if(efmt){ const ec=formatIso(value, efmt); if(ec && !tried.has(ec)){ cands.splice(i,0,ec); if(logfn) logfn(L('  Due Date — SF vyžaduje formát ','  Due Date — SF expects format ')+efmt+' → '+ec); continue; } } if(logfn) logfn(L('  Due Date odmítnut (','  Due Date rejected (')+cand+'): '+(err?L('špatný formát','bad format'):L('prázdné','empty'))); } const el2=dueDateEl(); return !!(el2&&(el2.value||'').trim()) && !dueFormatError(); }
  function clearReminder(){ for(const host of deepAll('lightning-primitive-input-checkbox')){ const lbl=deepFirst('span.slds-form-element__label',host.shadowRoot||host); if(!lbl||lbl.textContent.trim()!=='Reminder Set') continue; const cb=(host.shadowRoot||host).querySelector('input[type="checkbox"]'); if(cb&&(cb.checked||host.hasAttribute('checked'))){ const W=CTX.win||window; cb.checked=false; host.removeAttribute('checked'); cb.dispatchEvent(new (W.Event||Event)('change',{bubbles:true,composed:true})); cb.dispatchEvent(new (W.Event||Event)('click',{bubbles:true,composed:true})); } return; } }
  const eqLabel=(a,b)=>{ if(a===b) return true; const n=s=>String(s||'').toLowerCase().replace(/[\s\/\-_]+/g,''); return n(a)!==''&&n(a)===n(b); };
  async function changeDropdown(from,to,logfn){ const findLink=(label)=>deepAll('a.select', formScope()).find(a=>eqLabel(a.textContent.trim(),label)&&isVisible(a)); for(let attempt=1;attempt<=3;attempt++){ const link=await pwaitFor(()=>findLink(from),5000); if(!link) return !!findLink(to); ['mousedown','mouseup','click'].forEach(t=>mouse(link,t)); if(!(await pwaitFor(()=>menuOpen(),1200))){ ['mousedown','mouseup','click'].forEach(t=>mouse(link,t)); } await psleep(300); const optSel='a, li, span, div, [role="menuitem"], [role="option"], [role="menuitemradio"]'; const node=await pwaitFor(()=>{ const menus=deepAll('div.uiMenuList.visible, .uiMenuList, [role="menu"], [role="listbox"].slds-dropdown').filter(isVisible); for(const m of menus){ const f=deepAll(optSel,m).find(x=>eqLabel(x.textContent.trim(),to)&&isVisible(x)&&x!==link); if(f) return f; } return deepFind(optSel,x=>eqLabel(x.textContent.trim(),to)&&isVisible(x)&&x!==link&&!(x.closest&&x.closest('#'+ID))); },3000); if(node){ const target=node.closest('a, li, [role="menuitem"], [role="option"]')||node; ['pointerover','pointerenter','mouseover','mouseenter','mousemove'].forEach(t=>mouse(target,t)); await psleep(200); ['mousedown','mouseup','click'].forEach(t=>mouse(target,t)); await psleep(500); if(!findLink(to)&&menuOpen()){ sendEnter((CTX.doc&&CTX.doc.activeElement)||link); await psleep(500); } } if(menuOpen()){ const open=deepAll('a.select[aria-expanded="true"]').find(isVisible); if(open) ['mousedown','mouseup','click'].forEach(t=>mouse(open,t)); await psleep(300); } const ok=await pwaitFor(()=>findLink(to),1500); if(logfn) logfn(L(`  [${from} → ${to}] pokus ${attempt}: ${ok?'nastaveno':'NE'}`,`  [${from} -> ${to}] attempt ${attempt}: ${ok?'set':'NO'}`)); if(ok&&!menuOpen()) return true; await psleep(500); }
    try{ const link=findLink(from); if(link&&logfn){ ['mousedown','mouseup','click'].forEach(t=>mouse(link,t)); await psleep(600); const opts=deepAll('div.uiMenuList.visible a, div.uiMenuList.visible li, [role="menuitemradio"], [role="option"]').filter(isVisible).map(x=>txt(x)).filter(Boolean); logfn('   DIAG dostupné volby pro „'+to+'“: '+[...new Set(opts)].slice(0,40).join(' ; ')); ['mousedown','mouseup','click'].forEach(t=>mouse(link,t)); await psleep(300); } }catch(err){}
    return false; }
  function findOpt(text){ const opts=deepAll('div[role="option"]', formScope()).filter(isVisible); return opts.find(o=>o.textContent.trim()===text)||opts.find(o=>o.textContent.trim().includes(text)); }
  function optColumn(opt){ let n=opt; for(let i=0;i<10&&n;i++){ n=n.parentElement||(n.getRootNode&&n.getRootNode().host); if(!n) break; if(/dueling-list__column/.test(n.className||'')) return n; } return null; }
  function optIsChosen(opt){ try{ const col=optColumn(opt); if(!col) return null; const first=((col.innerText||col.textContent||'').trim().split(/\n/)[0]||'').trim(); if(/^chosen/i.test(first)) return true; if(/^available/i.test(first)) return false; return null; }catch(err){ return null; } }
  async function moveInDualListbox(text){
    const W=CTX.win||window;
    for(let attempt=1; attempt<=4; attempt++){
      let opt=findOpt(text); if(!opt){ await psleep(400); opt=findOpt(text); if(!opt) return false; }
      const st0=optIsChosen(opt); if(st0===true) return true;
      if(attempt%2===1){ opt.focus(); await psleep(300); opt.focus(); opt.dispatchEvent(new (W.KeyboardEvent||KeyboardEvent)('keydown',{bubbles:true,cancelable:true,view:W,ctrlKey:true,keyCode:39,key:'ArrowRight',which:39})); }
      else { ['mousedown','mouseup','click'].forEach(t=>mouse(opt,t)); await psleep(250); let box=opt; for(let i=0;i<10&&box;i++){ box=box.parentElement||(box.getRootNode&&box.getRootNode().host); if(box&&/slds-dueling-list(\s|$)/.test((box.className||'')+' ')) break; } const mv=deepAll('button[title*="Chosen"], button[title*="chosen"]', box||formScope()).filter(isVisible)[0]; if(mv){ ['mousedown','mouseup','click'].forEach(t=>mouse(mv,t)); } }
      await psleep(500);
      if(st0===null) return true;   /* rozložení seznamu nepoznáno → chování jako dřív (bez ověření) */
      const again=findOpt(text); const st=again?optIsChosen(again):null; if(st===true||st===null) return true;
    }
    return false;
  }

  async function checkRelated(p,logfn){ try{ const sc=formScope(); const t=(sc.innerText||sc.textContent||'').replace(/\s+/g,' '); const m=t.match(/Related To[^]{0,120}?Current Selection:\s*(.+?)\s*\((?:Opportunity)\)/i); if(!m){ logfn('Related To: '+L('nenalezeno (pojistka přeskočena)','not found (check skipped)')); return; } const found=m[1].trim(); logfn('Related To: '+found); const n=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,''); const a=n(found); const names=[p.oppName].concat(p.oppAlt||[]).map(n).filter(Boolean); if(a&&names.length&&!names.some(b=>a.includes(b)||b.includes(a))){ const er=new Error(L('Formulář je pro jinou opportunity („'+found+'“), ne pro „'+p.oppName+'“. Zavřete ostatní záložky opportunit a zkuste znovu.','The form belongs to a different opportunity („'+found+'“), not „'+p.oppName+'“. Close other opportunity tabs and retry.')); er.noRetry=true; throw er; } }catch(err){ if(err&&err.noRetry) throw err; } }
  async function fillOneTask(p, logfn){ await openForm(logfn,p); await checkRelated(p,logfn); clearReminder(); await psleep(500); await ensureDueDate(p.date, logfn); await psleep(300); setSubject(p.subject); await psleep(500); logfn(L('Reminder, Due Date, Subject: OK','Reminder, Due Date, Subject: OK')); const wantSt=p.status||'Completed'; if(wantSt!=='Not Started'){ const st=await changeDropdown('Not Started', wantSt, logfn); logfn('Status -> '+wantSt+': '+(st?'OK':L('NE','NO'))); if(!st) throw new Error(L('Nepodařilo se nastavit status: ','Could not set status: ')+wantSt); } const cat=await changeDropdown('--None--', p.phase, logfn); logfn('Category -> '+p.phase+': '+(cat?'OK':L('NE','NO'))); if(!cat) throw new Error(L('Nepodařilo se nastavit Category: ','Could not set Category: ')+p.phase); await psleep(400); const tt=await changeDropdown('--None--', p.type, logfn); logfn('Task Type -> '+p.type+': '+(tt?'OK':L('NE','NO'))); if(!tt) throw new Error(L('Nepodařilo se nastavit Task Type: ','Could not set Task Type: ')+p.type); const au=await moveInDualListbox(p.audience); logfn('Audience -> '+p.audience+': '+(au?'OK (v Chosen)':L('NE','NO'))); if(!au) throw new Error(L('Nepodařilo se vybrat Audience: ','Could not select Audience: ')+p.audience); const pr=await moveInDualListbox(p.product); logfn('Product -> '+p.product+': '+(pr?'OK (v Chosen)':L('NE','NO'))); if(!pr) throw new Error(L('Nepodařilo se vybrat Product: ','Could not select Product: ')+p.product); const wantPr=p.priority||'Normal'; if(wantPr!=='Normal'){ const pri=await changeDropdown('Normal', wantPr, logfn); logfn('Priority -> '+wantPr+': '+(pri?'OK':L('NE','NO'))); if(!pri) throw new Error(L('Nepodařilo se nastavit Priority: ','Could not set Priority: ')+wantPr); }
    if(p.comment){ try{ const host=deepAll('.slds-form-element').find(x=>/Actions\s*\/\s*Comments/i.test(txt(x))&&deepOne('textarea',x)); const ta=host&&deepOne('textarea',host); if(ta){ nativeSet(ta,p.comment,['input','change']); logfn('Comments: OK'); } else logfn('Comments: '+L('pole nenalezeno','field not found')); }catch(err){ logfn('Comments: '+err.message); } } return {audience:au, product:pr}; }
  async function fillAndSave(p, autosave, logfn){ await fillOneTask(p, logfn); const ddEl=dueDateEl(); const ddOk=!!(ddEl&&(ddEl.value||'').trim())&&!dueFormatError(); logfn(L('Due Date před uložením: ','Due Date before save: ')+(ddOk?'OK ('+p.date+')':L('CHYBÍ!','MISSING!'))); await pwaitFor(()=>!deepAll('lightning-spinner, .slds-spinner_container, .slds-spinner').some(isVisible),8000); await psleep(300); if(autosave){ if(!ddOk){ logfn(L('Automatické ukládání přerušeno — Due Date je prázdné.','Auto-save aborted — Due Date empty.')); return false; } const s=findSaveButton(); if(s){ s.click();
      const notPanel=(x)=>!(x.closest&&x.closest('#'+ID));
      const toastTxt=()=>{ try{ return deepAll('.slds-notify_toast, .toastContainer, [role="alertdialog"], lightning-toast').filter(isVisible).filter(notPanel).map(txt).join(' | '); }catch(err){ return ''; } };
      const errTxt=()=>{ try{ return deepAll('.slds-has-error .slds-form-element__help, .pageLevelErrors, .errorsList, [role="alert"], .slds-form-element__help[class*="error"]', formScope()).filter(isVisible).filter(notPanel).map(txt).filter(t=>t&&!/^\s*loading/i.test(t)&&/error|required|complete this|review the|invalid|must be|cannot|can.?t be|failed|duplicate|chyba|povinn/i.test(t)).join(' | '); }catch(err){ return ''; } };
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
  async function createTaskForProposal(p, autosave, logfn){ for(let a=0;;a++){ try{ return await createTaskOnce(p, autosave, logfn); }catch(e){ if(e.noRetry||a>=1||!batchRunning&&!p.__single) throw e; logfn(L('↻ Chyba, zkouším znovu: ','↻ Error, retrying: ')+e.message); try{ await withContext((childAlive()&&mode()==='list')?childWin.document:CTX.doc,(childAlive()&&mode()==='list')?childWin:CTX.win,()=>closeAnyForm(logfn)); }catch(err2){} if(mode()==='list'&&childAlive()){ navChild(PWIN.location.origin+`/lightning/r/Opportunity/${p.oppId}/view`); await waitChildReady(p.oppId); } } } }
  async function fillSelected(chosen, autosave, logfn, setStatusFn){ batchRunning=true; let ok=0, fail=0; await wake.on(); chosen.sort((a,b)=>(a.oppId+a.date).localeCompare(b.oppId+b.date)); for(let i=0;i<chosen.length;i++){ if(!batchRunning){ logfn(L('Zastaveno uživatelem.','Stopped by user.')); break; } const p=chosen[i]; setStatusFn(L(`Vyplňuji ${i+1}/${chosen.length}: ${p.oppName} — ${p.subject}`,`Filling ${i+1}/${chosen.length}: ${p.oppName} — ${p.subject}`)); try{ p.error=''; const okk=await createTaskForProposal(p, autosave, logfn); if(okk){ ok++; p.created=true; } else fail++; saveState(); }catch(e){ fail++; p.error=e.message; saveState(); logfn(L('CHYBA: ','ERROR: ')+e.message); if(e.noRetry){ logfn(L('Dávka zastavena kvůli chybě uložení – formulář nechávám otevřený.','Batch stopped due to a save error – form left open.')); batchRunning=false; } } onProgress(i+1,chosen.length,ok,fail); if(i<chosen.length-1 && batchRunning){ await psleep(BETWEEN_TASKS); } } batchRunning=false; wake.off(); setStatusFn(L(`Hotovo. OK: ${ok}, chyby/přeskočeno: ${fail}.`,`Done. OK: ${ok}, errors/skipped: ${fail}.`)); }
  async function processCurrentRecord(){ const rid=currentRecordId(); if(!rid) return null; await openActivityTab(); await sleep(400); const tasks=scanActivities(); const w=state.worklist.find(x=>x.id===rid); const opp={ id:rid, name:(w&&w.name)||txt(deepOne('h1, lightning-formatted-text'))||rid }; const props=buildProposals(opp,tasks); mergeProposals(rid, props); state.existing[rid]={ name:opp.name, halfCount:countInHalf(tasks), tasks:tasks.map(t=>({subject:t.subject, due:t.due||'', week:t.dueDate?weekKey(t.dueDate):'', dueIso:t.dueDate?localIso(t.dueDate):''})) }; if(w) w.done=true; saveState(); return { count:tasks.length, props:props.length }; }

  /* ======================================================================
     AutoTask – JEDNODUCHÉ ROZHRANÍ
     Otevřít opportunity → spustit → zadat jeden nebo více tasků → vytvořit.
     Product se předvybere podle produktu v opportunity.
     ====================================================================== */
  const S = state.settings;
  if (!S.audience) S.audience = 'Customer Remote';
  if (!S.dateFormat || (S.dateFormat === 'auto' && !S.dfMigrated)) { S.dateFormat = 'DD.MM.YYYY'; S.dfMigrated = true; }
  S.autosave = true; S.pace = S.pace || '1'; PACE = +S.pace || 1;

  const css = `
  #${ID}{--ac:#0176d3;--dk:#032d60;--bd:#d8dde6;--tx:#172b4d;--mu:#5b6b7f;--ok:#2e844a;--er:#ba0517;
    position:fixed;top:0;right:0;bottom:0;width:min(520px,100vw);z-index:2147483647;background:#f3f6fb;color:var(--tx);
    box-shadow:-6px 0 28px rgba(3,45,96,.35);display:flex;flex-direction:column;font:14px/1.45 -apple-system,"Segoe UI",Roboto,Arial,sans-serif;text-align:left}
  #${ID} *{box-sizing:border-box;font-family:inherit}
  #${ID} .hd{background:var(--dk);color:#fff;padding:12px 16px;display:flex;align-items:center;gap:10px}
  #${ID} .hd b{font-size:16px} #${ID} .hd .sp{flex:1}
  #${ID} .hd button{background:rgba(255,255,255,.15);border:0;color:#fff;border-radius:6px;height:30px;min-width:30px;cursor:pointer;font-size:15px}
  #${ID} .body{flex:1;overflow:auto;padding:14px}
  #${ID} .opp{font-weight:700;font-size:15px;margin-bottom:2px}
  #${ID} .info{color:var(--mu);font-size:13px;margin-bottom:12px}
  #${ID} .info b{color:var(--tx)}
  #${ID} .card{background:#fff;border:1px solid var(--bd);border-left:5px solid var(--ac);border-radius:10px;padding:12px;margin-bottom:12px}
  #${ID} .card.done{border-left-color:var(--ok);background:#eef8f0}
  #${ID} .card.bad{border-left-color:var(--er);background:#fff7f8}
  #${ID} .ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-weight:700}
  #${ID} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
  #${ID} .full{grid-column:1/-1}
  #${ID} label.f{display:flex;flex-direction:column;gap:3px;font-size:12px;font-weight:600;color:#33475b}
  #${ID} input[type=text],#${ID} input[type=date],#${ID} input[type=number],#${ID} select{width:100%;height:38px;border:1px solid #b7c1ce;border-radius:6px;padding:0 8px;font-size:14px;background:#fff;color:var(--tx)}
  #${ID} :focus-visible{outline:3px solid #ffb800;outline-offset:1px}
  #${ID} .btn{border:1px solid transparent;border-radius:7px;height:38px;padding:0 14px;font-weight:700;font-size:14px;cursor:pointer;background:var(--ac);color:#fff}
  #${ID} .btn.sec{background:#fff;color:var(--dk);border-color:#9eb9d6} #${ID} .btn.ok{background:var(--ok)} #${ID} .btn.bad{background:var(--er)}
  #${ID} .btn.sm{height:28px;font-size:12px;padding:0 10px} #${ID} .btn:disabled{opacity:.5;cursor:not-allowed}
  #${ID} .err{background:#fcd9dd;color:#8c0a16;border-radius:6px;padding:6px 10px;margin-bottom:8px;font-weight:600;font-size:13px}
  #${ID} .ft{background:#fff;border-top:1px solid var(--bd);padding:10px 14px;display:flex;flex-direction:column;gap:8px}
  #${ID} .st{font-weight:600;min-height:20px}
  #${ID} .prog{height:8px;background:#e5e9ef;border-radius:5px;overflow:hidden} #${ID} .prog>div{height:100%;width:0;background:linear-gradient(90deg,#0b5cab,#1fb5ad);transition:width .25s}
  #${ID} .logbox{white-space:pre-wrap;background:#0f1b2d;color:#c7d6ea;border-radius:8px;padding:8px 10px;max-height:160px;overflow:auto;font:11.5px/1.45 Consolas,monospace}
  #${ID} .row2{display:flex;gap:8px} #${ID} .row2>*{flex:1}
  #${ID} .ctx{border-left-color:#1fb5ad;margin-bottom:10px}
  #${ID} .kv{display:flex;justify-content:space-between;gap:10px;padding:2px 0;border-bottom:1px dashed #e3e8ee} #${ID} .kv span{color:var(--mu)}
  #${ID} .weeks{max-height:210px;overflow:auto;border:1px solid #b7c1ce;border-radius:8px;background:#fff;padding:4px}
  #${ID} .wkc{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:14px} #${ID} .wkc.on{background:#e4f1fd;font-weight:600}
  #${ID} .wkc input{width:18px;height:18px}
  #${ID} details.more{border-top:1px dashed #d8dde6;padding-top:6px} #${ID} details.more>summary{cursor:pointer;color:var(--mu);font-size:12.5px}
  #${ID} .hint{color:var(--mu);font-size:12px;margin-top:6px}
  #${ID}.run{top:auto;bottom:16px;right:16px;width:min(380px,92vw);border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.4)}
  #${ID}.run .body,#${ID}.run .hd .x{display:none}
  `;
  PDOC.head.appendChild(el('style', { textContent: css }));

  /* ---------- pomocné funkce ---------- */
  const h = (tag, props, ...kids) => {
    const x = PDOC.createElement(tag);
    if (props) for (const k in props) {
      const v = props[k]; if (v == null || v === false) continue;
      if (k === 'class') x.className = v; else if (k === 'style') x.style.cssText = v;
      else if (k.slice(0, 2) === 'on') x[k] = v; else if (k in x) { try { x[k] = v; } catch (e) { x.setAttribute(k, v); } } else x.setAttribute(k, v);
    }
    kids.flat(Infinity).forEach(c => { if (c == null || c === false) return; x.append(c.nodeType ? c : PDOC.createTextNode(String(c))); });
    return x;
  };
  const sel = (opts, value, onchange, props) => { const s = h('select', props || {}); opts.map(o => Array.isArray(o) ? o : [o, o]).forEach(([v, t]) => s.append(h('option', { value: v }, t))); s.value = value == null ? '' : value; if (onchange) s.onchange = () => onchange(s.value); return s; };
  const fld = (label, control, cls) => h('label', { class: 'f ' + (cls || '') }, label, control);
  const btn = (t, cls, fn, p) => h('button', Object.assign({ class: 'btn ' + (cls || ''), onclick: fn, type: 'button' }, p || {}), t);
  const todayIso = () => localIso(new Date());
  const isoShift = (iso, days) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + days); return localIso(d); };
  const isoWeek = (iso) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7)); const w1 = new Date(d.getFullYear(), 0, 4); return 1 + Math.round(((d - w1) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7); };
  const dmy = (iso) => { const [y, m, d] = iso.split('-'); return +d + '.' + +m + '.'; };
  const thisMonday = () => localIso(monday(new Date()));
  const defaultWeek = () => { const dow = new Date().getDay(); return (dow === 0 || dow === 6) ? isoShift(thisMonday(), 7) : thisMonday(); };
  const DADD = ['Discover', 'Analyze', 'Design', 'Defend'];
  /* omezený seznam produktů (upravte podle potřeby) */
  const LIMITED_PRODUCTS = ['PowerStore', 'PowerScale', 'PowerEdge', 'PowerProtect Data Domain', 'PowerFlex', 'PowerMax', 'PowerProtect Data Manager', 'PowerProtect Cyber Recovery', 'PowerVault', 'Dell AI Factory'];
  const ctx = { stage: '', dadd: 'Discover', daddFound: false, week: defaultWeek(), weeksSel: new Set([defaultWeek()]), perWeek: 5, product: '', productUser: false, audience: S.audience };
  const primaryWeek = () => { const a = [...ctx.weeksSel].sort(); return a[0] || ctx.week; };
  const NAME_SUFFIX = ['follow-up', 'review', 'workshop', 'checkpoint', 'summary', 'update', 'wrap-up'];
  const taskWord = (n) => n === 1 ? 'task' : (n >= 2 && n <= 4) ? 'tasky' : 'tasků';
  const typesFor = (cat) => { const ph = PHASES.find(x => x.name === cat); return ph ? ph.types : []; };
  const autoSubject = (p) => p.phase + ' - ' + p.type;

  /* ---------- log ---------- */
  const LOGKEY = 'autotask.log';
  const stamp = () => { const d = new Date(), z = n => String(n).padStart(2, '0'); return z(d.getHours()) + ':' + z(d.getMinutes()) + ':' + z(d.getSeconds()); };
  const persist = (line) => { try { const a = JSON.parse(localStorage.getItem(LOGKEY) || '[]'); a.push(line); localStorage.setItem(LOGKEY, JSON.stringify(a.slice(-800))); } catch (e) {} };
  const fullLog = () => { let a = []; try { a = JSON.parse(localStorage.getItem(LOGKEY) || '[]'); } catch (e) {} return '=== AutoTask log · ' + new Date().toISOString() + ' · ' + PWIN.location.href + ' · ' + navigator.userAgent + '\n' + a.join('\n'); };

  /* ---------- panel ---------- */
  const panel = el('div', { id: ID, role: 'dialog', 'aria-label': 'AutoTask' });
  const oppEl = h('div', { class: 'opp' }), infoEl = h('div', { class: 'info' }), listEl = h('div'), addRow = h('div');
  const body = h('div', { class: 'body' }, oppEl, infoEl, listEl, addRow);
  const statEl = h('div', { class: 'st', 'aria-live': 'polite' }), progBar = h('div'), logEl = h('div', { class: 'logbox', style: 'display:none' });
  const runBtn = btn('', 'ok', () => run()), stopBtn = btn('■ Stop', 'bad', () => { batchRunning = false; log('Zastavuji po dokončení aktuálního kroku…'); }, { style: 'display:none' });
  const fastCb = h('input', { type: 'checkbox', checked: String(S.pace) === '0.6', onchange: e => { S.pace = e.target.checked ? '0.6' : '1'; PACE = +S.pace; saveState(); } });
  const logBtn = btn('Log', 'sec sm', () => { const o = logEl.style.display === 'none'; logEl.style.display = o ? '' : 'none'; if (o) logEl.scrollTop = logEl.scrollHeight; });
  const copyBtn = btn('Kopírovat log', 'sec sm', () => { const t = fullLog(); try { navigator.clipboard.writeText(t); setStatus('Log zkopírován do schránky.'); } catch (e) { const ta = h('textarea', { value: t }); PDOC.body.append(ta); ta.select(); PDOC.execCommand('copy'); ta.remove(); } });
  const closeBtn = h('button', { 'aria-label': 'Zavřít', title: 'Zavřít', class: 'x', onclick: () => { batchRunning = false; panel.remove(); } }, '✕');
  panel.append(h('div', { class: 'hd' }, h('b', null, 'AutoTask'), h('span', { class: 'sp' }), closeBtn),
    body, h('div', { class: 'ft' }, h('div', { class: 'prog' }, progBar), statEl, h('div', { class: 'row2' }, runBtn, stopBtn), h('label', { style: 'display:flex;gap:8px;align-items:center;font-size:13px;cursor:pointer' }, fastCb, 'Rychlejší vyplňování (méně pauz; když něco nevyjde, vypněte)'), h('div', { class: 'row2' }, logBtn, copyBtn), logEl));
  PDOC.body.append(panel);

  const log = (s) => { const line = '[' + stamp() + '] ' + s; logEl.textContent += (logEl.textContent ? '\n' : '') + line; logEl.scrollTop = logEl.scrollHeight; persist(line); try { console.log('[AutoTask]', s); } catch (e) {} if (/CHYBA|ERROR|selhal|nelze potvrdit/i.test(s)) logEl.style.display = ''; };
  const setStatus = (s) => { statEl.textContent = s; };
  trace = log;
  onProgress = (i, n) => { progBar.style.width = Math.round(100 * i / Math.max(1, n)) + '%'; };
  /* zástupné funkce, které volá engine při skenování fronty (zde se nepoužívá) */
  function renderAll() {} function renderQueue() {} function gotoTab() {} function scopedProposals() { return []; }

  /* ---------- produkt z opportunity ---------- */
  const ALIASES = [['data domain', 'PowerProtect Data Domain'], ['cyber recovery', 'PowerProtect Cyber Recovery'], ['ppdm', 'PowerProtect Data Manager'], ['data manager', 'PowerProtect Data Manager'], ['vsan', 'VSAN Ready Node'], ['brocade', 'Brocade Fabric'], ['objectscale', 'ECS/ObjectScale'], ['isilon', 'PowerScale'], ['xtremio', 'XtremIO'], ['powerswitch', 'PowerSwitch-Core Network']];
  function matchProducts(text) {
    const t = String(text || '').toLowerCase(), out = [];
    PRODUCTS.filter(p => p !== 'No Product').slice().sort((a, b) => b.length - a.length).forEach(p => { if (p.length >= 3 && t.includes(p.toLowerCase())) out.push(p); });
    ALIASES.forEach(([k, v]) => { if (t.includes(k) && !out.includes(v)) out.push(v); });
    return out;
  }
  let detected = [];
  function detectProducts() {
    const texts = [];
    try { deepAll('a[href*="/lightning/r/OpportunityLineItem/"], a[href*="/lightning/r/Product2/"]', curRoot()).filter(vis).forEach(a => texts.push(deepTxt(a))); } catch (e) {}
    const found = [], src = [];
    texts.forEach(tx => matchProducts(tx).forEach(p => { if (!found.includes(p)) { found.push(p); src.push('produkty'); } }));
    if (!found.length) matchProducts(oppName()).forEach(p => { if (!found.includes(p)) { found.push(p); src.push('název opty'); } });
    detected = found; detectedFrom = src[0] || '';
    return found;
  }
  let detectedFrom = '';
  function oppName() { const x = pageH1(); const t = x ? x.t : nTitle(); return String(t || '').replace(/^\s*Opportunity\s*/i, '').replace(/\s*\|\s*Opportunity\s*$/i, '').trim(); }
  const productOptions = () => { const rest = LIMITED_PRODUCTS.filter(p => !detected.includes(p)); return [...detected.map(p => [p, '★ ' + p]), ...rest.map(p => [p, p])]; };

  /* ---------- Stage a DADD z opportunity ---------- */
  /* text uzlu včetně obsahu shadow DOM (textContent ho u webových komponent nevidí) */
  function deepTxt(n) {
    const out = []; const walk = (x) => {
      if (!x) return; if (x.nodeType === 3) { const t = x.textContent.trim(); if (t) out.push(t); return; }
      if (x.nodeType !== 1 || /^(script|style)$/i.test(x.tagName)) return;
      if (x.shadowRoot) x.shadowRoot.childNodes.forEach(walk);
      x.childNodes.forEach(walk);
    };
    walk(n); return out.filter((t, i) => t !== out[i - 1]).join(' ').replace(/\s+/g, ' ').trim();
  }
  /* v konzoli Salesforce zůstávají v DOM i schované záložky jiných opt – bereme jen viditelné prvky */
  const vis = (x) => { try { return isVisible(x) && (!x.checkVisibility || x.checkVisibility()); } catch (e) { return false; } };
  /* --- která část DOM patří aktivní opportunity (v konzoli zůstávají v dokumentu i jiné záložky) --- */
  const nrm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const nTitle = () => String(document.title || '').replace(/^\s*\(\d+\)\s*/, '').replace(/\s*\|\s*(Opportunity|Salesforce).*$/i, '').trim();
  function pageH1() {
    const hs = deepAll('h1', PDOC).filter(vis).map(h => ({ h, t: deepTxt(h) })).filter(x => x.t.length > 2); if (!hs.length) return null;
    const tt = nrm(nTitle()); const W = PWIN.innerWidth || 1200, H = PWIN.innerHeight || 800;
    const score = (x) => { let s = 0; const n = nrm(x.t); if (tt && n && (tt.includes(n) || n.includes(tt))) s += 4; try { const r = x.h.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; if (cx >= 0 && cx <= W) s += 2; if (cy >= -50 && cy <= H) s += 1; } catch (e) {} return s; };
    return hs.map((x, i) => ({ x, s: score(x), i })).sort((a, b) => b.s - a.s || a.i - b.i)[0].x;
  }
  function recordRoot() {
    const x = pageH1(); if (!x) return PDOC; let root = x.h; const key = nrm(x.t);
    for (let i = 0; i < 60; i++) {
      const p = root.parentElement || (root.getRootNode && root.getRootNode().host);
      if (!p || p === PDOC.documentElement || p === PDOC.body) return PDOC;   /* jediná opportunity v dokumentu → celý dokument */
      if (deepAll('h1', p).map(deepTxt).some(t => t && nrm(t) !== key)) return root;  /* tady začíná jiná stránka záznamu */
      root = p;
    }
    return root;
  }
  let _rt = null, _rtT = 0;
  const curRoot = () => { const n = Date.now(); if (!_rt || n - _rtT > 800 || !PDOC.contains(_rt)) { try { _rt = recordRoot(); } catch (e) { _rt = PDOC; } _rtT = n; } return _rt; };
  recordRootFn = curRoot;
  function fieldItems() { try { return deepAll('records-record-layout-item, records-highlights-details-item, .slds-form-element', curRoot()).filter(vis); } catch (e) { return []; } }
  function labelOf(it) { return deepTxt(deepOne('.test-id__field-label, p.slds-text-title, .fieldLabel, .slds-form-element__label, label, span.slds-form-element__label', it)); }
  function readField(re) {
    for (const it of fieldItems()) {
      const lt = labelOf(it); if (!lt || !re.test(lt)) continue;
      let v = deepTxt(deepOne('.test-id__field-value, lightning-formatted-text, .slds-form-element__static', it));
      if (!v) v = deepTxt(deepOne('.slds-form-element__control', it));
      if (!v) v = deepTxt(it);
      v = v.split(lt).join(' ').replace(/\bEdit\s+\S[^|]*$/i, '').replace(/\s+/g, ' ').trim();
      if (v) return v;
    }
    return '';
  }
  function pathStage() { const c = deepAll('.slds-path__item.slds-is-current .slds-path__title, .slds-path__item[aria-selected="true"] .slds-path__title, a.slds-path__link[aria-selected="true"] .slds-path__title', curRoot()).filter(vis)[0]; return deepTxt(c); }
  const normDadd = (t) => { const s = String(t || '').toLowerCase(); if (/discover/.test(s)) return 'Discover'; if (/analy/.test(s)) return 'Analyze'; if (/design/.test(s)) return 'Design'; if (/defend/.test(s)) return 'Defend'; return ''; };
  let diagLogged = false;
  /* druhá strategie: štítek „DADD…“ a text v jeho okolí (když první způsob nenajde hodnotu) */
  function readDaddAlt() {
    try {
      const cands = deepAll('.test-id__field-label, .slds-form-element__label, label, p.slds-text-title, span, p', curRoot()).filter(x => vis(x) && /^dadd\b/i.test(deepTxt(x)) && deepTxt(x).length < 50);
      for (const lab of cands) {
        const lt = deepTxt(lab); let n = lab;
        for (let i = 0; i < 6 && n; i++) { n = n.parentElement || (n.getRootNode && n.getRootNode().host); if (!n) break; const t = deepTxt(n).split(lt).join(' ').trim(); const ph = normDadd(t.slice(0, 120)); if (ph) return t.slice(0, 120); }
      }
    } catch (e) {}
    return '';
  }
  let lastSig = '';
  function detectInfo() {
    const stage = readField(/^\s*stage\s*$/i) || pathStage(); if (stage) ctx.stage = stage;
    let raw = readField(/dadd/i); let nd = normDadd(raw); let via = 'pole';
    if (!nd) { const alt = readDaddAlt(); if (normDadd(alt)) { raw = alt; nd = normDadd(alt); via = 'okolí štítku'; } }
    ctx.daddText = raw;
    if (nd) { ctx.daddRaw = raw; ctx.daddFound = true; if (!ctx.daddUser) ctx.dadd = nd; }
    const sig = [ctx.stage, raw, nd, via].join('|');
    if (sig !== lastSig) { lastSig = sig; log('Detekce: Stage="' + (ctx.stage || '') + '" | DADD pole="' + String(raw || '').replace(/\s+/g, ' ').slice(0, 80) + '" → ' + (nd ? nd + ' (' + via + ')' : 'nezjištěno')); }
    return { stage, dadd: nd, raw };
  }
  function logLabels() { if (diagLogged) return; diagLogged = true; try { const ls = [...new Set(fieldItems().map(labelOf).filter(Boolean))].slice(0, 80); log('DIAG nalezená pole na stránce: ' + ls.join(' | ')); log('DIAG hodnoty: Stage="' + (ctx.stage || '') + '" | pole DADD="' + String(ctx.daddText || '').replace(/\s+/g, ' ').slice(0, 400) + '"'); const items = fieldItems().filter(it => /dadd|phase|fáze/i.test(labelOf(it))).slice(0, 6).map(it => labelOf(it) + ' => ' + deepTxt(it).slice(0, 200)); if (items.length) log('DIAG položky DADD/phase: ' + items.join(' || ')); } catch (e) {} }

  /* ---------- tasky ---------- */
  let rows = [], rid = null, busy = false;
  const newRow = (from) => {
    const base = from ? { phase: ctx.dadd, type: typesFor(ctx.dadd).includes(from.type) ? from.type : typesFor(ctx.dadd)[0], product: ctx.product, audience: ctx.audience, date: todayIso() } : { phase: ctx.dadd, type: typesFor(ctx.dadd)[0], product: ctx.product, audience: ctx.audience, date: todayIso() };
    const p = Object.assign({ id: mkId(), oppId: rid, oppName: oppName(), status: 'Completed', priority: 'Normal', created: false, error: '', customSubject: false }, base);
    p.subject = autoSubject(p); p.customSubject = false; p.qty = 1; p.dateCustom = false; p.week = primaryWeek(); return p;
  };
  function resetFor(id) { rid = id; ctx.daddUser = false; ctx.daddFound = false; ctx.stage = ''; ctx.productUser = false; ctx.product = detected[0] || ''; diagLogged = false; detectInfo(); rows = [newRow()]; redistribute(); syncProduct(); }
  /* první task v pondělí, poslední v pátek, ostatní rovnoměrně mezi nimi */
  function redistribute() {
    const L2 = rows.filter(p => !p.created); const groups = {};
    L2.forEach(p => { (groups[p.week || ctx.week] = groups[p.week || ctx.week] || []).push(p); });
    Object.keys(groups).forEach(w => {
      const g = groups[w]; const total = g.reduce((s, p) => s + (p.qty || 1), 0); let k = 0;
      g.forEach(p => {
        const q = p.qty || 1; p.dates = [];
        for (let i = 0; i < q; i++) { const off = total <= 1 ? 0 : Math.round(k * 4 / (total - 1)); p.dates.push(isoShift(w, off)); k++; }
        if (p.dateCustom && q === 1) p.dates = [p.date];
        p.date = p.dates[0];
      });
    });
  }
  /* vygeneruje pro každý zaškrtnutý týden zadaný počet tasků; názvy se liší, ale odpovídají fázi a typu */
  function generate() {
    const wk = [...ctx.weeksSel].sort(); if (!wk.length) { setStatus('Zaškrtněte alespoň jeden týden.'); return; }
    const types = typesFor(ctx.dadd); const out = [];
    wk.forEach(w => {
      const occ = {};
      for (let i = 0; i < ctx.perWeek; i++) {
        const t = types[i % types.length]; const k = occ[t] = (occ[t] || 0) + 1;
        const p = newRow(); p.week = w; p.type = t; p.phase = ctx.dadd; p.qty = 1;
        let nm = ctx.dadd + ' - ' + t;
        if (k > 1) { const j = k - 2; nm += ' - ' + NAME_SUFFIX[j % NAME_SUFFIX.length] + (j >= NAME_SUFFIX.length ? ' ' + (Math.floor(j / NAME_SUFFIX.length) + 1) : ''); }
        if (wk.length > 1) nm += ' (W' + isoWeek(w) + ')';
        p.subject = nm; p.customSubject = true; out.push(p);
      }
    });
    rows = rows.filter(p => p.created).concat(out); redistribute(); render();
    setStatus('Vygenerováno ' + out.length + ' ' + taskWord(out.length) + ' (' + wk.length + ' × ' + ctx.perWeek + '). Zkontrolujte je a klikněte na Vytvořit.');
    log('Vygenerováno ' + out.length + ' tasků: týdny ' + wk.map(isoWeek).join(', ') + ', ' + ctx.perWeek + ' týdně, fáze ' + ctx.dadd);
  }
  /* společné nastavení: produkt a audience se zadají jednou nahoře a platí pro všechny tasky (kromě ručně přepsaných) */
  function syncProduct() { if (!ctx.productUser && detected.length) ctx.product = detected[0]; rows.filter(p => !p.created && !p.prodCustom).forEach(p => { p.product = ctx.product; }); }
  function applyProduct(v) { ctx.product = v; ctx.productUser = true; rows.filter(p => !p.created && !p.prodCustom).forEach(p => { p.product = v; }); }
  function applyAudience(v) { ctx.audience = v; S.audience = v; saveState(); rows.filter(p => !p.created && !p.audCustom).forEach(p => { p.audience = v; }); }
  function applyDadd(v) { ctx.dadd = v; rows.filter(p => !p.created).forEach(p => { p.phase = v; if (!typesFor(v).includes(p.type)) p.type = typesFor(v)[0]; if (!p.customSubject) p.subject = autoSubject(p); }); }

  function render() {
    const onRecord = mode() === 'record';
    const cur = currentRecordId();
    if (onRecord && cur !== rid) { detectProducts(); resetFor(cur); retryDetect(); }
    oppEl.textContent = onRecord ? (oppName() || cur) : '';
    listEl.textContent = ''; addRow.textContent = '';
    if (!onRecord) { infoEl.textContent = 'Otevřete opportunity (její hlavní stránku) a spusťte nástroj znovu.'; runBtn.style.display = 'none'; return; }
    if (/\/related\//.test(PWIN.location.pathname)) {
      infoEl.textContent = 'Jste na vedlejší záložce opty. Formulář tasku je na hlavní stránce.';
      addRow.append(btn('Otevřít hlavní stránku opty', 'ok', () => PWIN.location.assign(PWIN.location.origin + '/lightning/r/Opportunity/' + cur + '/view'))); runBtn.style.display = 'none'; return;
    }
    runBtn.style.display = '';
    infoEl.textContent = '';
    const weeks = []; for (let i = -2; i <= 11; i++) weeks.push(isoShift(thisMonday(), 7 * i));
    const weekBoxes = h('div', { class: 'weeks', role: 'group', 'aria-label': 'Týdny' }, weeks.map(m => h('label', { class: 'wkc' + (ctx.weeksSel.has(m) ? ' on' : '') },
      h('input', { type: 'checkbox', checked: ctx.weeksSel.has(m), onchange: e => { e.target.checked ? ctx.weeksSel.add(m) : ctx.weeksSel.delete(m); render(); } }),
      h('span', null, `Týden ${isoWeek(m)} · ${dmy(m)} – ${dmy(isoShift(m, 4))}${m === thisMonday() ? ' (tento)' : ''}`))));
    const nW = ctx.weeksSel.size, total = nW * ctx.perWeek;
    infoEl.append(h('div', { class: 'card ctx' },
      h('div', { class: 'kv' }, h('span', null, 'Fáze opportunity (Stage)'), h('b', null, ctx.stage || 'nezjištěno')),
      h('div', { class: 'kv' }, h('span', null, 'Fáze DADD'), h('b', null, ctx.daddFound ? String(ctx.daddRaw || ctx.dadd).slice(0, 80) : (ctx.daddText ? 'Pole DADD obsahuje: „' + ctx.daddText.slice(0, 80) + '“ – vyberte fázi ručně' : 'nezjištěno – vyberte ručně'))),
      h('div', { class: 'grid', style: 'margin-top:8px' },
        fld('Fáze, ve které se tasky vytvoří (DADD) *', sel(DADD, ctx.dadd, v => { ctx.daddUser = true; applyDadd(v); render(); }), 'full'),
        fld('Product pro všechny tasky *', sel([['', '— vyberte —'], ...productOptions()], ctx.product, v => { applyProduct(v); render(); })),
        fld('Audience pro všechny tasky *', sel(AUDIENCES, ctx.audience, v => { applyAudience(v); render(); })),
        h('div', { class: 'f full' }, h('span', { style: 'font-size:12px;font-weight:600;color:#33475b' }, 'Týdny * (zaškrtněte jeden nebo více)'), weekBoxes),
        fld('Počet tasků v každém týdnu', h('input', { type: 'number', min: 1, max: 20, value: ctx.perWeek, 'aria-label': 'Počet tasků v každém týdnu', onchange: e => { ctx.perWeek = Math.max(1, Math.min(20, +e.target.value || 5)); render(); } })),
        h('div', { class: 'f', style: 'justify-content:flex-end' }, btn(`Vygenerovat ${total} ${taskWord(total)}`, 'ok', () => generate(), { disabled: !nW || busy }))),
      h('div', { class: 'hint' }, `V každém týdnu se tasky rozloží od pondělí do pátku (první v pondělí, poslední v pátek). Každý task má jiný název podle fáze a typu. Generování přepíše dosud nevytvořené tasky.`)));
    infoEl.append(detected.length ? h('div', { style: 'margin-bottom:8px' }, 'Product v opportunity: ', h('b', null, detected.join(', ')), detectedFrom === 'název opty' ? ' (podle názvu)' : '', ' ', btn('↻ Znovu zjistit', 'sec sm', () => { detectProducts(); detectInfo(); syncProduct(); render(); }, { 'aria-label': 'Znovu zjistit údaje z opportunity' })) : h('div', { style: 'margin-bottom:8px' }, 'Product v opportunity se nepodařilo zjistit – vyberte ho u tasku. ', btn('↻ Znovu zjistit', 'sec sm', () => { detectProducts(); detectInfo(); syncProduct(); render(); }), ' '));
    rows.forEach((p, i) => listEl.append(card(p, i)));
    addRow.append(btn('＋ Přidat další task', 'sec', () => { const last = rows[rows.length - 1]; rows.push(newRow(last)); redistribute(); render(); setTimeout(() => { const ins = listEl.querySelectorAll('input[type=text]'); if (ins.length) ins[ins.length - 1].focus(); }, 30); }, { style: 'width:100%' }));
    const open = rows.filter(p => !p.created).reduce((s, p) => s + (p.qty || 1), 0);
    runBtn.textContent = open ? `▶ Vytvořit ${open} ${taskWord(open)}` : 'Hotovo';
    runBtn.disabled = busy || !open; if (busy) runBtn.style.display = 'none';
  }

  function card(p, i) {
    const miss = missingFields(p);
    const subj = h('input', { type: 'text', value: p.subject, disabled: p.created, placeholder: 'Zadejte název tasku', 'aria-label': 'Název tasku', oninput: e => { p.subject = e.target.value; p.customSubject = e.target.value !== autoSubject(p); } });
    const tySel = sel(typesFor(p.phase), p.type, v => { p.type = v; if (!p.customSubject) { p.subject = autoSubject(p); subj.value = p.subject; } }, { disabled: p.created });
    const prodSel = sel([['', '— vyberte —'], ...productOptions()], p.product, v => { p.product = v; p.prodCustom = true; }, { disabled: p.created });
    return h('section', { class: 'card' + (p.created ? ' done' : (p.error ? ' bad' : '')), 'aria-label': 'Task ' + (i + 1) },
      h('div', { class: 'ch' }, h('span', null, (p.created ? '✓ Task ' + (i + 1) + ' vytvořen' : 'Task ' + (i + 1)) + (p.week ? ' · týden ' + isoWeek(p.week) : '')),
        (!p.created && rows.length > 1) ? btn('Odebrat', 'sec sm', () => { rows = rows.filter(x => x.id !== p.id); redistribute(); render(); }) : null),
      p.error ? h('div', { class: 'err', role: 'alert' }, p.error) : null,
      h('div', { class: 'grid' },
        fld('Název tasku *', subj, 'full'),
        fld('Typ tasku (' + p.phase + ') *', tySel, 'full'),
        fld(p.qty > 1 ? 'Datum (rozloží se automaticky)' : 'Datum (Due Date) *', p.qty > 1
          ? h('div', { style: 'min-height:38px;display:flex;align-items:center;font-weight:600' }, (p.dates || []).map(d => ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'][new Date(d + 'T12:00:00').getDay()] + ' ' + dmy(d)).join(', '))
          : h('input', { type: 'date', value: p.date, disabled: p.created, onchange: e => { if (e.target.value) { p.date = e.target.value; p.dateCustom = true; } } })),
        fld('Počet stejných tasků', h('input', { type: 'number', min: 1, max: 20, value: p.qty || 1, disabled: p.created, 'aria-label': 'Počet stejných tasků', onchange: e => { p.qty = Math.max(1, Math.min(20, +e.target.value || 1)); if (p.qty > 1) p.dateCustom = false; redistribute(); render(); } })),
        h('details', { class: 'full more' }, h('summary', null, 'Product a Audience tohoto tasku: ' + (p.product || '— nevybráno —') + ', ' + p.audience + ' (změnit jen pro tento task)'),
          h('div', { class: 'grid', style: 'margin-top:8px' },
            fld('Product *', prodSel),
            fld('Audience *', sel(AUDIENCES, p.audience, v => { p.audience = v; p.audCustom = true; }, { disabled: p.created }))))));
  }

  /* ---------- vytvoření ---------- */
  async function run() {
    if (busy) return;
    const open = rows.filter(p => !p.created);
    if (!ctx.product && open.some(p => !p.product)) { setStatus('Vyberte Product nahoře (pro všechny tasky).'); return; }
    const bad = open.filter(p => missingFields(p).length);
    const CZ = { Subject: 'Název tasku', 'Due Date': 'Datum', Status: 'Status', Category: 'Kategorie', 'Task Type': 'Typ tasku', Audience: 'Audience', Product: 'Product', Priority: 'Priority' };
    if (bad.length) { bad.forEach(p => { p.error = 'Chybí: ' + missingFields(p).map(x => CZ[x] || x).join(', '); }); render(); setStatus('Doplňte označená pole.'); return; }
    const prevD = ctx.dadd; if (!ctx.daddUser) { detectInfo(); if (ctx.dadd !== prevD) { applyDadd(ctx.dadd); render(); setStatus('Fáze DADD se změnila na ' + ctx.dadd + ' – zkontrolujte tasky a spusťte znovu.'); log('Fáze DADD se před spuštěním změnila: ' + prevD + ' → ' + ctx.dadd); return; } }
    redistribute();
    const expanded = [];
    open.forEach(p => { p.error = ''; for (let i = 0; i < (p.qty || 1); i++) expanded.push(Object.assign({}, p, { id: mkId(), __src: p.id, qty: 1, created: false, error: '', oppName: oppName(), oppAlt: [nTitle()], oppId: rid, phase: ctx.dadd, date: (p.dates && p.dates[i]) || p.date })); });
    busy = true; panel.classList.add('run'); stopBtn.style.display = ''; runBtn.style.display = 'none'; progBar.style.width = '0'; render();
    log('Vytvářím ' + expanded.length + ' ' + taskWord(expanded.length) + '…');
    try { await fillSelected(expanded.slice(), true, log, setStatus); }
    catch (e) { log('CHYBA: ' + e.message); }
    finally {
      open.forEach(p => { const mine = expanded.filter(x => x.__src === p.id); const done = mine.filter(x => x.created).length; if (done === mine.length) p.created = true; else { p.qty = Math.max(1, mine.length - done); const bad1 = mine.find(x => !x.created && x.error); if (bad1) p.error = bad1.error; } });
      busy = false; panel.classList.remove('run'); stopBtn.style.display = 'none'; runBtn.style.display = ''; redistribute(); render();
    }
  }

  /* ---------- start ---------- */
  let detTries = 0;
  function retryDetect() { detTries = 0; const t = setInterval(() => {
    if (!PDOC.body.contains(panel)) { clearInterval(t); return; }
    detTries++; const before = detected.join() + '|' + ctx.stage + '|' + ctx.dadd + '|' + ctx.daddFound;
    detectProducts(); detectInfo();
    const after = detected.join() + '|' + ctx.stage + '|' + ctx.dadd + '|' + ctx.daddFound;
    if (after !== before) { syncProduct(); if (!ctx.daddUser) applyDadd(ctx.dadd); if (!busy) render(); }
    if ((detected.length && ctx.stage && ctx.daddFound) || detTries >= 6) { if (!ctx.daddFound || !ctx.stage) logLabels(); clearInterval(t); }
  }, 2500); }
  let lastName = '';
  const watch = setInterval(() => {
    if (!PDOC.body.contains(panel)) { clearInterval(watch); return; }
    if (busy || mode() !== 'record' || /\/related\//.test(PWIN.location.pathname)) return;
    _rt = null; const nmNow = oppName(); if (nmNow !== lastName) { lastName = nmNow; detectProducts(); if (!ctx.daddUser) ctx.daddFound = false; render(); }
    const before = [ctx.stage, ctx.dadd, ctx.daddFound].join('|'); const bp = detected.join();
    detectInfo(); detectProducts();
    if ([ctx.stage, ctx.dadd, ctx.daddFound].join('|') !== before) { if (!ctx.daddUser) applyDadd(ctx.dadd); render(); }
    else if (detected.join() !== bp) { syncProduct(); render(); }
  }, 3000);
  log('AutoTask jednoduchý v3.13 (2026-10-27) · ' + mode() + ' · ' + PWIN.location.pathname + ' · formát data: ' + S.dateFormat);
  setStatus('Připraveno.');
  render();
  let lastHref = PWIN.location.href;
  const navTimer = setInterval(() => { if (!PDOC.body.contains(panel)) { clearInterval(navTimer); return; } if (PWIN.location.href !== lastHref) { lastHref = PWIN.location.href; if (!busy) render(); } }, 800);
})(); } catch (e) { __atFatal(e); } })();
