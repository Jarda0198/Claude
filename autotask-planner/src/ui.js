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
  #${ID} .at-log:empty{display:none}
  #${ID} .at-log{white-space:pre-wrap;background:#0f1b2d;color:#c7d6ea;border-radius:8px;padding:8px 10px;max-height:110px;overflow:auto;font:11.5px/1.45 Consolas,monospace}
  #${ID} .seg{display:inline-flex;border:1px solid #9eb9d6;border-radius:7px;overflow:hidden}
  #${ID} .seg button{border:0;background:#fff;color:var(--dk);padding:0 13px;height:32px;cursor:pointer;font-weight:600;border-right:1px solid #d3deea}
  #${ID} .seg button:last-child{border:0} #${ID} .seg button.on{background:var(--ac);color:#fff}
  #${ID} .grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:14px}
  #${ID} .sw{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:var(--tx);cursor:pointer}
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
  if (S.autosave == null) S.autosave = true;
  if (!S.status) S.status = 'Completed';
  if (S.minProb == null) S.minProb = 60;
  if (!S.audience) S.audience = 'Customer Remote';
  const PACES = () => [['0.5', 'Turbo', L('Nejrychlejší – na stabilní lince', 'Fastest – for a stable connection')], ['1', L('Rychle', 'Fast'), L('Doporučeno', 'Recommended')], ['2', L('Klidně', 'Calm'), L('Když SF zahazuje volby v menu', 'If SF drops menu choices')], ['3', L('Velmi pomalu', 'Very slow'), L('Poslední záchrana', 'Last resort')]];
  const DATEFMTS = ['auto', 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY', 'DD-MM-YYYY'];
  PACE = +S.pace || 1;

  /* ---------- kostra panelu ---------- */
  let TAB = 'opty';
  const panel = el('div', { id: ID });
  const selScan = new Set(), queueSel = new Set(), proposalSel = new Set();
  let scanned = [], busy = false, showCreated = true, filterOpp = '', showExisting = false;
  const chipsEl = h('div', { class: 'at-chips' });
  const langSel = sel([['cs', 'Čeština'], ['en', 'English']], LANG, v => { LANG = v; S.lang = v; saveState(); renderAll(); }, {});
  const miniBtn = h('button', { class: 'at-hbtn', title: L('Zmenšit / zvětšit', 'Minimize / restore'), onclick: () => panel.classList.toggle('mini') }, '▁');
  const closeBtn = h('button', { class: 'at-hbtn', title: L('Zavřít', 'Close'), onclick: () => { batchRunning = scanRunning = false; panel.remove(); } }, '✕');
  const tabsEl = h('div', { class: 'at-tabs' });
  const mainEl = h('div', { class: 'at-main' });
  const progBar = h('div'), statEl = h('div', { class: 'at-stat' }), logEl = h('div', { class: 'at-log' });
  const runBtn = btn('', 'ok', () => runSelected());
  const stopBtn = btn('■ Stop', 'bad', () => { batchRunning = false; scanRunning = false; log(L('Zastavuji po dokončení aktuálního kroku…', 'Stopping after the current step…')); });
  panel.append(
    h('div', { class: 'at-head' }, h('div', { class: 'at-logo' }, h('i', null, 'AT'), 'AutoTask Planner'), chipsEl, langSel, miniBtn, closeBtn),
    tabsEl, mainEl,
    h('div', { class: 'at-foot' }, h('div', { class: 'at-prog' }, progBar), h('div', { class: 'at-frow' }, statEl, stopBtn, runBtn), logEl)
  );
  PDOC.body.append(panel);

  const log = (s) => { logEl.textContent += (logEl.textContent ? '\n' : '') + s; logEl.scrollTop = logEl.scrollHeight; };
  const setStatus = (s) => { statEl.textContent = s; statEl.title = s; };
  onProgress = (i, n) => { progBar.style.width = Math.round(100 * i / Math.max(1, n)) + '%'; };
  function gotoTab(t) { TAB = t; renderAll(); }
  function renderQueue() { renderAll(); }
  function renderProposalsTable() { renderAll(); }
  function scopedProposals() { const ids = new Set(state.worklist.map(w => w.id)); return state.proposals.filter(p => ids.has(p.oppId)); }
  const todo = () => scopedProposals().filter(p => !p.created);

  /* ---------- hlavní render ---------- */
  function renderAll() {
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
    mainEl.textContent = '';
    ({ opty: tabOpty, plan: tabPlan, set: tabSettings })[TAB]();
    const n = pr.filter(p => !p.created && proposalSel.has(p.id)).length;
    runBtn.textContent = L(`▶ Vytvořit vybrané (${n})`, `▶ Create selected (${n})`);
    runBtn.disabled = !n || busy;
    modeHint();
  }
  function modeHint() { if (mode() === 'other' && !statEl.textContent) setStatus(L('Otevřete seznam Opportunities (/lightning/o/Opportunity/list) a spusťte nástroj tam.', 'Open the Opportunities list and launch the tool there.')); }

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
        scanned.filter(o => selScan.has(o.id) && !ids.has(o.id)).forEach(o => { state.worklist.push({ id: o.id, name: o.name, account: o.account, created: o.created, stage: o.stage, url: o.url, done: false }); add++; });
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
    try { await scanQueueInChild(); todo().forEach(p => proposalSel.add(p.id)); } finally { busy = false; renderAll(); }
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
      const base = from ? Object.assign({}, from) : { phase: PHASES[0].name, type: PHASES[0].types[0], date: localIso(new Date()), product: S.product, audience: S.audience, status: S.status };
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
    const B = { phase: '', type: '', product: '', audience: '', status: '', date: '', shift: '' };
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
        fld('Status', sel([...nochg, ...STATUSES], '', v => B.status = v)),
        fld(L('Nastavit datum', 'Set date'), h('input', { type: 'date', onchange: e => B.date = e.target.value })),
        fld(L('Posunout o dní (±)', 'Shift by days (±)'), h('input', { type: 'number', style: 'width:90px', placeholder: '0', oninput: e => B.shift = e.target.value })),
        btn(L('Použít na vybrané', 'Apply to selected'), '', () => {
          const sl = selVis(); if (!sl.length) { alert(L('Nejdřív zaškrtněte tasky.', 'Tick some tasks first.')); return; }
          sl.forEach(p => {
            const patch = {};
            if (B.phase) { patch.phase = B.phase; if (!typesFor(B.phase).includes(p.type)) patch.type = typesFor(B.phase)[0]; }
            if (B.type) { const ph = PHASES.find(x => x.types.includes(B.type)); if (ph) patch.phase = ph.name; patch.type = B.type; }
            if (B.product) patch.product = B.product; if (B.audience) patch.audience = B.audience; if (B.status) patch.status = B.status;
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
          h('td', { style: 'white-space:nowrap;text-align:right' },
            dis ? h('span', { class: 'pill g' }, L('vytvořeno', 'created')) : [
              btn('▶', 'ico', () => runOne(p), { title: L('Vytvořit jen tento task', 'Create only this task'), disabled: busy }), ' ',
              btn('⎘', 'ico', () => { const c = Object.assign({}, p, { id: mkId(), manual: true, error: '' }); state.proposals.push(c); proposalSel.add(c.id); saveState(); renderAll(); }, { title: L('Duplikovat', 'Duplicate') }), ' ',
              btn('✕', 'ico', () => { state.proposals = state.proposals.filter(x => x.id !== p.id); proposalSel.delete(p.id); saveState(); renderAll(); }, { title: L('Smazat', 'Delete') })]));
      });
      card.append(h('div', { class: 'tw', style: 'max-height:56vh' }, h('table', null,
        h('thead', null, h('tr', null, h('th', null, head), h('th', null, 'Opportunity'), h('th', null, L('Datum', 'Date')), h('th', null, L('Fáze', 'Phase')), h('th', null, 'Task Type'), h('th', null, L('Předmět', 'Subject')), h('th', null, 'Product'), h('th', null, 'Audience'), h('th', null, 'Status'), h('th'))),
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
        fld('Status', sel(STATUSES, S.status, v => { S.status = v; saveState(); }))),
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
  if (!S.pace) S.pace = '1';
  saveState();
  if (state.proposals.length && mode() === 'list') TAB = 'plan';
  setStatus(L('Připraveno.', 'Ready.'));
  renderAll();
  let lastHref = PWIN.location.href;
  const navTimer = setInterval(() => { if (!PDOC.body.contains(panel)) { clearInterval(navTimer); return; } if (PWIN.location.href !== lastHref) { lastHref = PWIN.location.href; if (!busy) renderAll(); } }, 800);
})();
