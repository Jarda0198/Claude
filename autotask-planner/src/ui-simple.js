  /* ======================================================================
     AutoTask – JEDNODUCHÉ ROZHRANÍ
     Otevřít opportunity → spustit → zadat jeden nebo více tasků → vytvořit.
     Product se předvybere podle produktu v opportunity.
     ====================================================================== */
  const S = state.settings;
  if (!S.audience) S.audience = 'Customer Remote';
  if (!S.dateFormat || (S.dateFormat === 'auto' && !S.dfMigrated)) { S.dateFormat = 'DD.MM.YYYY'; S.dfMigrated = true; }
  S.autosave = true; if (!S.paceV) { S.pace = '0.6'; S.paceV = 2; } S.pace = S.pace || '0.6'; PACE = +S.pace || 1;

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
    body, h('div', { class: 'ft' }, h('div', { class: 'prog' }, progBar), statEl, h('div', { class: 'row2' }, runBtn, stopBtn), h('label', { style: 'display:flex;gap:8px;align-items:center;font-size:13px;cursor:pointer' }, fastCb, 'Rychlejší vyplňování (doporučeno; když něco nevyjde, vypněte)'), h('div', { class: 'row2' }, logBtn, copyBtn), logEl));
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
  function oppName() { const x = pageH1(); const t = x ? x.t : ''; return String(t || '').replace(/^\s*Opportunity\s*/i, '').replace(/\s*\|\s*Opportunity\s*$/i, '').trim(); }
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
  /* hlavička aplikace (např. „Agentforce Studio“) je taky h1 – nesmí se zaměnit za název opportunity */
  const APP_SEL = '.slds-context-bar, .appName, one-appnav, one-app-nav-bar, nav, [role="banner"], .oneHeader, header';
  const isAppH1 = (h) => { try { return !!(h.closest && h.closest(APP_SEL)); } catch (e) { return false; } };
  function appNameText() { try { return nrm(deepTxt(deepAll('.slds-context-bar__app-name, .appName', PDOC).filter(vis)[0])); } catch (e) { return ''; } }
  function recordH1s() {
    const app = appNameText();
    return deepAll('h1', PDOC).filter(vis).filter(h => !isAppH1(h)).map(h => ({ h, t: deepTxt(h) })).filter(x => x.t.length > 2 && !(app && nrm(x.t) === app));
  }
  /* záložní zdroj: pole „Opportunity Name“ v detailu */
  function fieldOppName() {
    try {
      for (const it of deepAll('records-record-layout-item, .slds-form-element', PDOC).filter(vis)) {
        const lt = deepTxt(deepOne('.test-id__field-label, .slds-form-element__label, label', it));
        if (!/^\s*opportunity name\s*$/i.test(lt)) continue;
        let v = deepTxt(deepOne('.test-id__field-value, lightning-formatted-text, .slds-form-element__static', it)).split(lt).join(' ').replace(/\bEdit\s+\S[^|]*$/i, '').trim();
        if (v) return { h: it, t: v };
      }
    } catch (e) {}
    return null;
  }
  function pageH1() {
    const W = PWIN.innerWidth || 1200, H = PWIN.innerHeight || 800;
    const score = (x) => {
      let s = 0; const par = deepTxt(x.h.parentElement || x.h);
      if (/^\s*opportunity\b/i.test(x.t) || /^\s*opportunity\b/i.test(par)) s += 6;   /* nad názvem je štítek „Opportunity“ */
      try { if (x.h.closest && x.h.closest('records-highlights2, records-lwc-highlights-panel, force-highlights2, .highlights, .slds-page-header')) s += 4; } catch (e) {}
      try { const r = x.h.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; if (cx >= 0 && cx <= W) s += 2; if (cy >= -50 && cy <= H) s += 1; } catch (e) {}
      return s;
    };
    const hs = recordH1s();
    if (hs.length) return hs.map((x, i) => ({ x, s: score(x), i })).sort((a, b) => b.s - a.s || a.i - b.i)[0].x;
    return fieldOppName();
  }
  function recordRoot() {
    const x = pageH1(); if (!x) return PDOC; let root = x.h; const key = nrm(x.t);
    for (let i = 0; i < 60; i++) {
      const p = root.parentElement || (root.getRootNode && root.getRootNode().host);
      if (!p || p === PDOC.documentElement || p === PDOC.body) return PDOC;   /* jediná opportunity v dokumentu → celý dokument */
      const app = appNameText();
      if (deepAll('h1', p).filter(h => !isAppH1(h)).map(deepTxt).some(t => t && t.length > 2 && nrm(t) !== key && !(app && nrm(t) === app))) return root;  /* tady začíná jiná stránka záznamu */
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
      const cands = deepAll('.test-id__field-label, .slds-form-element__label, label, p.slds-text-title', curRoot()).filter(x => vis(x) && /^dadd\b/i.test(deepTxt(x)) && deepTxt(x).length < 50);
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
  function resetFor(id) { rid = id; ctx.daddUser = false; ctx.daddFound = false; ctx.stage = ''; ctx.productUser = false; ctx.product = ''; ctx.detecting = true; diagLogged = false; rows = [newRow()]; redistribute(); }
  /* čtení Stage/DADD/produktu proběhne až po vykreslení panelu (dřív blokovalo start o 5–20 s) */
  function scheduleDetect() {
    setTimeout(() => {
      try { detectProducts(); detectInfo(); syncProduct(); if (!ctx.daddUser) applyDadd(ctx.dadd); } catch (e) { log('Detekce selhala: ' + e.message); }
      ctx.detecting = false; if (!busy) render(); retryDetect();
    }, 30);
  }
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
    if (onRecord && cur !== rid) { resetFor(cur); scheduleDetect(); }
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
      h('div', { class: 'kv' }, h('span', null, 'Fáze opportunity (Stage)'), h('b', null, ctx.stage || (ctx.detecting ? 'zjišťuji…' : 'nezjištěno'))),
      h('div', { class: 'kv' }, h('span', null, 'Fáze DADD'), h('b', null, ctx.daddFound ? String(ctx.daddRaw || ctx.dadd).slice(0, 80) : (ctx.detecting ? 'zjišťuji…' : (ctx.daddText ? 'Pole DADD obsahuje: „' + ctx.daddText.slice(0, 80) + '“ – vyberte fázi ručně' : 'nezjištěno – vyberte ručně')))),
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
    open.forEach(p => { p.error = ''; for (let i = 0; i < (p.qty || 1); i++) expanded.push(Object.assign({}, p, { id: mkId(), __src: p.id, qty: 1, created: false, error: '', oppName: oppName(), oppAlt: [(fieldOppName() || {}).t || ''], oppId: rid, phase: ctx.dadd, date: (p.dates && p.dates[i]) || p.date })); });
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
    if (busy || ctx.detecting || PDOC.hidden || mode() !== 'record' || /\/related\//.test(PWIN.location.pathname)) return;
    _rt = null; const nmNow = oppName(); if (nmNow !== lastName) { lastName = nmNow; detectProducts(); if (!ctx.daddUser) ctx.daddFound = false; render(); }
    const before = [ctx.stage, ctx.dadd, ctx.daddFound].join('|'); const bp = detected.join();
    detectInfo(); detectProducts();
    if ([ctx.stage, ctx.dadd, ctx.daddFound].join('|') !== before) { if (!ctx.daddUser) applyDadd(ctx.dadd); render(); }
    else if (detected.join() !== bp) { syncProduct(); render(); }
  }, 5000);
  log('AutoTask jednoduchý v3.15 (2026-10-27) · ' + mode() + ' · ' + PWIN.location.pathname + ' · formát data: ' + S.dateFormat);
  setStatus('Připraveno.');
  render();
  let lastHref = PWIN.location.href;
  const navTimer = setInterval(() => { if (!PDOC.body.contains(panel)) { clearInterval(navTimer); return; } if (PWIN.location.href !== lastHref) { lastHref = PWIN.location.href; if (!busy) render(); } }, 800);
})();
