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
  #${ID} .tlist{display:flex;flex-direction:column;gap:12px}
  #${ID} .tcard{background:#fff;border:1px solid var(--bd);border-left:5px solid var(--ac);border-radius:10px;padding:12px 14px}
  #${ID} .tcard.bad{border-left-color:var(--er);background:#fff7f8}
  #${ID} .thead{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-weight:700;font-size:14px}
  #${ID} .terr{background:#fcd9dd;color:#8c0a16;border-radius:6px;padding:6px 10px;margin-bottom:10px;font-weight:600}
  #${ID} .tgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}
  #${ID} .tgrid select,#${ID} .tgrid input[type=text],#${ID} .tgrid input[type=date]{width:100%;height:36px;font-size:14px}
  #${ID} .fld{font-size:12px;color:#33475b}
  #${ID} :focus-visible{outline:3px solid #ffb800;outline-offset:1px}
  #${ID} .bulk{position:static;box-shadow:none;margin:8px 0 0}
  #${ID} details.bulkd{background:#fff8e6;border:1px solid #f0d58a;border-radius:10px;padding:8px 12px;margin-bottom:14px}
  #${ID} details.bulkd>summary{cursor:pointer;font-weight:700;padding:4px 0}
  #${ID} .donel{margin:0;padding-left:18px;color:#3f6b4b}
  #${ID} .logpanel{margin-top:4px}
  /* ===== výchozí kompaktní rozložení: pole ve 2 sloupcích, bez vodorovného posuvníku ===== */
  #${ID} .at-main{max-width:1000px;width:100%;margin:0 auto}
  #${ID} .tgrid{grid-template-columns:repeat(2,minmax(0,1fr))}
  #${ID} .tgrid select,#${ID} .tgrid input[type=text],#${ID} .tgrid input[type=date]{width:100%;min-width:0}
  #${ID} .fld{min-width:0}
  /* ===== svislé rozložení: vše pod sebou v jednom sloupci ===== */
  #${ID}.vert .at-main{max-width:820px;width:100%;margin:0 auto}
  #${ID}.vert .row{flex-direction:column;align-items:stretch;gap:12px}
  #${ID}.vert .row>*{width:100%;max-width:100%}
  #${ID}.vert .row .btn{width:100%;height:40px;font-size:14px}
  #${ID}.vert .row .btn.ico{width:28px;height:28px}
  #${ID}.vert .row .sw{width:auto}
  #${ID}.vert .thead .row{flex-direction:row;width:auto;gap:6px}
  #${ID}.vert .thead .row>*{width:auto}
  #${ID}.vert .thead .row .btn{width:auto;height:30px;font-size:12px}
  #${ID}.vert .fld{width:100%}
  #${ID}.vert .fld select,#${ID}.vert .fld input[type=text],#${ID}.vert .fld input[type=date],#${ID}.vert .fld input[type=number]{width:100%!important;min-width:0!important;height:38px;font-size:14px}
  #${ID}.vert .tgrid,#${ID}.vert .grid2{grid-template-columns:1fr}
  #${ID}.vert .steps{flex-direction:column;gap:6px}
  #${ID}.vert .step{padding:8px 12px}
  #${ID}.vert .at-head{flex-wrap:wrap} #${ID}.vert .at-frow{flex-wrap:wrap}
  #${ID}.vert .at-stat{flex-basis:100%;white-space:normal}
  #${ID}.vert .bulk .row{flex-direction:column}
  #${ID}.vert .week{max-width:100%}
  #${ID}.vert .tw{max-width:100%}
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
  if (!S.layout) S.layout = 'compact';
  const PRIORITIES = ['Normal', 'High', 'Low'];
  state.proposals.forEach(p => { if (!p.priority) p.priority = 'Normal'; if (!p.status) p.status = 'Completed'; if (!p.audience) p.audience = S.audience; });
  if (S.minProb == null) S.minProb = 60;
  if (!S.audience) S.audience = 'Customer Remote';
  const PACES = () => [['0.5', 'Turbo', L('Nejrychlejší – na stabilní lince', 'Fastest – for a stable connection')], ['1', L('Rychle', 'Fast'), L('Doporučeno', 'Recommended')], ['2', L('Klidně', 'Calm'), L('Když SF zahazuje volby v menu', 'If SF drops menu choices')], ['3', L('Velmi pomalu', 'Very slow'), L('Poslední záchrana', 'Last resort')]];
  const DATEFMTS = ['auto', 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY', 'DD-MM-YYYY'];
  PACE = +S.pace || 1;

  /* ---------- kostra panelu ---------- */
  let TAB = 'opty';
  let bulkOpen = false, logOpen = false;
  let VIEW = S.view === 'adv' ? 'adv' : 'simple';
  const panel = el('div', { id: ID });
  const selScan = new Set(), queueSel = new Set(), proposalSel = new Set();
  let scanned = [], busy = false, showCreated = true, filterOpp = '', showExisting = false;
  const chipsEl = h('div', { class: 'at-chips' });
  const langSel = sel([['cs', 'Čeština'], ['en', 'English']], LANG, v => { LANG = v; S.lang = v; saveState(); renderAll(); }, {});
  const miniBtn = h('button', { class: 'at-hbtn', title: L('Zmenšit / zvětšit', 'Minimize / restore'), onclick: () => panel.classList.toggle('mini') }, '▁');
  const layoutBtn = h('button', { class: 'at-hbtn', style: 'font-size:12px;padding:0 10px', onclick: () => { S.layout = S.layout === 'vert' ? 'compact' : 'vert'; saveState(); renderAll(); } });
  const viewBtn = h('button', { class: 'at-hbtn', style: 'font-size:12px;padding:0 10px', onclick: () => { VIEW = VIEW === 'simple' ? 'adv' : 'simple'; S.view = VIEW; saveState(); renderAll(); } });
  const closeBtn = h('button', { class: 'at-hbtn', title: L('Zavřít', 'Close'), onclick: () => { batchRunning = scanRunning = false; panel.remove(); } }, '✕');
  const tabsEl = h('div', { class: 'at-tabs' });
  const mainEl = h('div', { class: 'at-main' });
  const progBar = h('div'), statEl = h('div', { class: 'at-stat' }), logEl = h('div', { class: 'at-log' });
  const copyBtn = btn(L('📋 Kopírovat log', '📋 Copy log'), 'sec sm', () => { const t = fullLog(); try { navigator.clipboard.writeText(t); setStatus(L('Log zkopírován do schránky.', 'Log copied.')); } catch (e) { const ta = h('textarea', { value: t }); PDOC.body.append(ta); ta.select(); PDOC.execCommand('copy'); ta.remove(); } });
  const dlBtn = btn(L('⬇ Stáhnout log', '⬇ Download log'), 'sec sm', () => { const a = h('a', { href: URL.createObjectURL(new Blob([fullLog()], { type: 'text/plain' })), download: 'autotask-log-' + Date.now() + '.txt' }); PDOC.body.append(a); a.click(); a.remove(); });
  const clrBtn = btn('🗑', 'sec sm', () => { try { localStorage.removeItem(LOGKEY); } catch (err) {} logEl.textContent = ''; }, { title: L('Smazat log', 'Clear log') });
  const runBtn = btn('', 'ok', () => runSelected());
  const logPanel = h('div', { class: 'logpanel', style: 'display:none' }, h('div', { class: 'row', style: 'margin-bottom:6px' }, copyBtn, dlBtn, clrBtn), logEl);
  const setLogOpen = (v) => { logOpen = v; logPanel.style.display = v ? '' : 'none'; logBtn.textContent = v ? L('▾ Skrýt log', '▾ Hide log') : L('▸ Log', '▸ Log'); if (v) logEl.scrollTop = logEl.scrollHeight; };
  const logBtn = btn(L('▸ Log', '▸ Log'), 'sec sm', () => setLogOpen(!logOpen), { 'aria-expanded': 'false' });
  const stopBtn = btn('■ Stop', 'bad', () => { batchRunning = false; scanRunning = false; log(L('Zastavuji po dokončení aktuálního kroku…', 'Stopping after the current step…')); });
  panel.append(
    h('div', { class: 'at-head' }, h('div', { class: 'at-logo' }, h('i', null, 'AT'), 'AutoTask Planner'), chipsEl, layoutBtn, viewBtn, langSel, miniBtn, closeBtn),
    tabsEl, mainEl,
    h('div', { class: 'at-foot' }, h('div', { class: 'at-prog' }, progBar), h('div', { class: 'at-frow' }, statEl, logBtn, stopBtn, runBtn), logPanel)
  );
  PDOC.body.append(panel);

  const LOGKEY = 'autotask.log';
  const stamp = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0'); };
  const persist = (line) => { try { const a = JSON.parse(localStorage.getItem(LOGKEY) || '[]'); a.push(line); localStorage.setItem(LOGKEY, JSON.stringify(a.slice(-800))); } catch (err) {} };
  const log = (s) => { const line = '[' + stamp() + '] ' + s; logEl.textContent += (logEl.textContent ? '\n' : '') + line; logEl.scrollTop = logEl.scrollHeight; persist(line); try { console.log('[AutoTask]', s); } catch (err) {} if (/CHYBA|ERROR|selhal|failed|nelze potvrdit|unconfirmed/i.test(s)) setLogOpen(true); };
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
    panel.classList.toggle('vert', S.layout === 'vert');
    layoutBtn.textContent = S.layout === 'vert' ? L('▥ 2 sloupce', '▥ 2 columns') : L('☰ 1 sloupec', '☰ 1 column');
    layoutBtn.title = L('Přepnout rozložení polí: 2 sloupce / 1 sloupec', 'Switch field layout: 2 columns / 1 column');
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

  /* sdílený kontrolní seznam (jednoduchý režim): jeden task = jedna karta se svislým řazením polí */
  function reviewTable(open, showOpp, adv) {
    const allSel = open.length > 0 && open.every(p => proposalSel.has(p.id));
    const top = h('label', { class: 'sw', style: 'margin-bottom:10px' }, h('input', { type: 'checkbox', checked: allSel, onchange: e => { open.forEach(p => e.target.checked ? proposalSel.add(p.id) : proposalSel.delete(p.id)); renderAll(); } }), L(`Vybrat všechny tasky (${open.length})`, `Select all tasks (${open.length})`));
    const list = h('div', { class: 'tlist', role: 'list' }, open.map((p, i) => {
      const miss = missingFields(p);
      const subj = h('input', { type: 'text', value: p.subject, oninput: e => { p.subject = e.target.value; p.customSubject = e.target.value !== autoSubject(p); saveState(); } });
      const tySel = sel(typesFor(p.phase), p.type, v => { p.type = v; if (!p.customSubject) { p.subject = autoSubject(p); subj.value = p.subject; } saveState(); });
      const phSel = sel(PHASES.map(x => x.name), p.phase, v => { p.phase = v; tySel.textContent = ''; typesFor(v).forEach(t => tySel.append(h('option', { value: t }, t))); p.type = typesFor(v)[0]; tySel.value = p.type; if (!p.customSubject) { p.subject = autoSubject(p); subj.value = p.subject; } saveState(); });
      const dateI = h('input', { type: 'date', value: p.date, onchange: e => { if (e.target.value) setP(p, { date: e.target.value }); } });
      return h('section', { class: 'tcard' + ((p.error || miss.length) ? ' bad' : ''), role: 'listitem', 'aria-label': `${L('Task', 'Task')} ${i + 1}${showOpp ? ' – ' + p.oppName : ''}` },
        h('div', { class: 'thead' },
          h('label', { class: 'sw' }, h('input', { type: 'checkbox', checked: proposalSel.has(p.id), onchange: e => { e.target.checked ? proposalSel.add(p.id) : proposalSel.delete(p.id); renderAllSoft(); } }), h('span', null, `${L('Task', 'Task')} ${i + 1}`, showOpp ? h('span', { class: 'mu' }, ' · ' + p.oppName) : null)),
          h('div', { class: 'row', style: 'gap:6px' },
            adv ? btn(L('▶ Vytvořit jen tento', '▶ Create only this'), 'sec sm', () => runOne(p), { disabled: busy }) : null,
            adv ? btn(L('⎘ Duplikovat', '⎘ Duplicate'), 'sec sm', () => { const c = Object.assign({}, p, { id: mkId(), manual: true, error: '' }); state.proposals.push(c); proposalSel.add(c.id); saveState(); renderAll(); }) : null,
            btn(L('Odebrat', 'Remove'), 'sec sm', () => { state.proposals = state.proposals.filter(x => x.id !== p.id); proposalSel.delete(p.id); saveState(); renderAll(); }, { 'aria-label': L('Odebrat task ', 'Remove task ') + (i + 1) }))),
        (p.error || miss.length) ? h('div', { class: 'terr', role: 'alert' }, p.error || (L('Chybí: ', 'Missing: ') + miss.join(', '))) : null,
        h('div', { class: 'tgrid' },
          fld(L('Datum (Due Date) *', 'Date (Due Date) *'), dateI),
          fld(L('Fáze (Category) *', 'Phase (Category) *'), phSel),
          fld('Task Type', tySel),
          fld('Product *', sel(PRODUCTS, p.product, v => { p.product = v; saveState(); })),
          fld('Audience *', sel(AUDIENCES, p.audience || S.audience, v => { p.audience = v; saveState(); })),
          fld('Status *', sel(STATUSES, p.status || 'Completed', v => { p.status = v; saveState(); })),
          fld('Priority *', sel(PRIORITIES, p.priority || 'Normal', v => { p.priority = v; saveState(); })),
          h('label', { class: 'fld', style: 'grid-column:1/-1' }, L('Předmět (Subject)', 'Subject'), subj)));
    }));
    return h('div', null, top, list);
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
    const wrap = h('div', { style: 'max-width:820px;margin:0 auto' }, stepper(st));
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
    const flat = FLOW.flatMap(ph => ph.types.map(t => ({ phase: ph.name, type: t })));
    let start = 0;
    if (S.readExisting) { const ex = (state.existing[oppId] && state.existing[oppId].tasks) || []; let mr = -1; ex.forEach(t => { const rk = phaseRank(t.subject); if (rk > mr) mr = rk; }); const si = flat.findIndex(x => x.phase === FLOW[Math.min(mr + 1, FLOW.length - 1)].name); start = si < 0 ? 0 : si; }
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
    const wrap = h('div', { style: 'max-width:820px;margin:0 auto' });
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
      const base = from ? Object.assign({}, from) : { phase: FLOW[0].name, type: FLOW[0].types[0], date: localIso(new Date()), product: S.product, audience: S.audience, status: S.status, priority: S.priority };
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
    mainEl.append(h('details', { class: 'bulkd', open: bulkOpen, ontoggle: e => { bulkOpen = e.target.open; } }, h('summary', null, L('⚡ Hromadné úpravy vybraných tasků', '⚡ Bulk edit selected tasks')), bulk));

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
      const openL = list.filter(p => !p.created), doneL = list.filter(p => p.created);
      if (openL.length) card.append(reviewTable(openL, true, true));
      if (doneL.length) card.append(h('h3', { style: 'margin:14px 0 6px' }, L(`Vytvořeno (${doneL.length})`, `Created (${doneL.length})`)), h('ul', { class: 'donel' }, doneL.map(p => h('li', null, '✓ ', p.date, ' · ', p.oppName, ' · ', p.subject))));
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
  if (!S.dateFormat || (S.dateFormat === 'auto' && !S.dfMigrated)) { S.dateFormat = 'DD.MM.YYYY'; S.dfMigrated = true; }
  if (!PRODUCTS.includes(S.product)) S.product = 'PowerStore';
  if (!S.pace) S.pace = '1';
  saveState();
  if (state.proposals.length && mode() === 'list') TAB = 'plan';
  setStatus(L('Připraveno.', 'Ready.'));
  log('AutoTask Planner v2.11 (2026-10-24) · '+L('Režim: ', 'Mode: ') + mode() + ' · ' + PWIN.location.pathname + ' · ' + L('formát data: ', 'date format: ') + (S.dateFormat || 'auto'));
  renderAll();
  let lastHref = PWIN.location.href;
  const navTimer = setInterval(() => { if (!PDOC.body.contains(panel)) { clearInterval(navTimer); return; } if (PWIN.location.href !== lastHref) { lastHref = PWIN.location.href; if (!busy) renderAll(); } }, 800);
})();
