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
  #${ID} input[type=text],#${ID} input[type=date],#${ID} select{width:100%;height:38px;border:1px solid #b7c1ce;border-radius:6px;padding:0 8px;font-size:14px;background:#fff;color:var(--tx)}
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
  const ctx = { stage: '', dadd: 'Discover', daddFound: false, week: defaultWeek() };
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
    try { deepAll('a[href*="/lightning/r/OpportunityLineItem/"], a[href*="/lightning/r/Product2/"]', PDOC).forEach(a => texts.push(txt(a))); } catch (e) {}
    const found = [], src = [];
    texts.forEach(tx => matchProducts(tx).forEach(p => { if (!found.includes(p)) { found.push(p); src.push('produkty'); } }));
    if (!found.length) matchProducts(oppName()).forEach(p => { if (!found.includes(p)) { found.push(p); src.push('název opty'); } });
    detected = found; detectedFrom = src[0] || '';
    return found;
  }
  let detectedFrom = '';
  function oppName() { const t = txt(deepOne('h1 lightning-formatted-text, h1 .slds-page-header__title, h1', PDOC)); return String(t || '').replace(/^\s*Opportunity\s*/i, '').replace(/\s*\|\s*Opportunity\s*$/i, '').trim(); }
  const productOptions = () => { const rest = LIMITED_PRODUCTS.filter(p => !detected.includes(p)); return [...detected.map(p => [p, '★ ' + p]), ...rest.map(p => [p, p])]; };

  /* ---------- Stage a DADD z opportunity ---------- */
  function fieldItems() { try { return deepAll('records-record-layout-item, records-highlights-details-item, .slds-form-element', PDOC); } catch (e) { return []; } }
  function labelOf(it) { return txt(deepOne('.test-id__field-label, p.slds-text-title, .fieldLabel, .slds-form-element__label, label, span.slds-form-element__label', it)); }
  function readField(re) {
    for (const it of fieldItems()) {
      const lt = labelOf(it); if (!lt || !re.test(lt)) continue;
      let v = txt(deepOne('.test-id__field-value, lightning-formatted-text, .slds-form-element__static', it));
      if (!v) v = txt(deepOne('.slds-form-element__control', it)).replace(lt, '').replace(/Edit\s+[^\n]*$/i, '').trim();
      v = v.replace(lt, '').replace(/^\s*Edit\s+\S.*$/i, '').trim();
      if (v) return v;
    }
    return '';
  }
  function pathStage() { const c = deepOne('.slds-path__item.slds-is-current .slds-path__title, .slds-path__item[aria-selected="true"] .slds-path__title, a.slds-path__link[aria-selected="true"] .slds-path__title', PDOC); return txt(c); }
  const normDadd = (t) => { const s = String(t || '').toLowerCase(); if (/discover/.test(s)) return 'Discover'; if (/analy/.test(s)) return 'Analyze'; if (/design/.test(s)) return 'Design'; if (/defend/.test(s)) return 'Defend'; return ''; };
  let diagLogged = false;
  function detectInfo() {
    const stage = readField(/^\s*stage\s*$/i) || pathStage(); if (stage) ctx.stage = stage;
    const raw = readField(/dadd/i); const nd = normDadd(raw); ctx.daddText = raw;
    if (nd) { ctx.daddRaw = raw; if (!ctx.daddUser) { ctx.dadd = nd; } ctx.daddFound = true; }
    return { stage, dadd: nd, raw };
  }
  function logLabels() { if (diagLogged) return; diagLogged = true; try { const ls = [...new Set(fieldItems().map(labelOf).filter(Boolean))].slice(0, 80); log('DIAG nalezená pole na stránce: ' + ls.join(' | ')); log('DIAG hodnoty: Stage="' + (ctx.stage || '') + '" | pole DADD="' + String(ctx.daddText || '').replace(/\s+/g, ' ').slice(0, 400) + '"'); const items = fieldItems().filter(it => /dadd|phase|fáze/i.test(labelOf(it))).slice(0, 6).map(it => labelOf(it) + ' => ' + txt(it).slice(0, 200)); if (items.length) log('DIAG položky DADD/phase: ' + items.join(' || ')); } catch (e) {} }

  /* ---------- tasky ---------- */
  let rows = [], rid = null, busy = false;
  const newRow = (from) => {
    const base = from ? { phase: ctx.dadd, type: typesFor(ctx.dadd).includes(from.type) ? from.type : typesFor(ctx.dadd)[0], product: from.product, audience: from.audience, date: todayIso() } : { phase: ctx.dadd, type: typesFor(ctx.dadd)[0], product: detected[0] || '', audience: S.audience, date: todayIso() };
    const p = Object.assign({ id: mkId(), oppId: rid, oppName: oppName(), status: 'Completed', priority: 'Normal', created: false, error: '', customSubject: false }, base);
    if (from) { p.subject = ''; p.customSubject = true; } else p.subject = autoSubject(p);
    p.dateCustom = false; return p;
  };
  function resetFor(id) { rid = id; ctx.daddUser = false; ctx.daddFound = false; ctx.stage = ''; diagLogged = false; detectInfo(); rows = [newRow()]; redistribute(); }
  /* první task v pondělí, poslední v pátek, ostatní rovnoměrně mezi nimi */
  function redistribute() {
    const L2 = rows.filter(p => !p.created); const n = L2.length;
    L2.forEach((p, i) => { if (p.dateCustom) return; const off = n === 1 ? 0 : Math.round(i * 4 / (n - 1)); p.date = isoShift(ctx.week, off); });
  }
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
    const weeks = []; for (let i = -4; i <= 12; i++) weeks.push(isoShift(thisMonday(), 7 * i));
    infoEl.append(h('div', { class: 'card ctx' },
      h('div', { class: 'kv' }, h('span', null, 'Fáze opportunity (Stage)'), h('b', null, ctx.stage || 'nezjištěno')),
      h('div', { class: 'kv' }, h('span', null, 'Fáze DADD'), h('b', null, ctx.daddFound ? String(ctx.daddRaw || ctx.dadd).slice(0, 80) : (ctx.daddText ? 'Pole DADD obsahuje: „' + ctx.daddText.slice(0, 80) + '“ – vyberte fázi ručně' : 'nezjištěno – vyberte ručně'))),
      h('div', { class: 'grid', style: 'margin-top:8px' },
        fld('Fáze, ve které se tasky vytvoří (DADD) *', sel(DADD, ctx.dadd, v => { ctx.daddUser = true; applyDadd(v); render(); }), 'full'),
        fld('Týden *', sel(weeks.map(m => [m, `Týden ${isoWeek(m)} · ${dmy(m)} – ${dmy(isoShift(m, 4))}${m === thisMonday() ? ' (tento)' : ''}`]), ctx.week, v => { ctx.week = v; rows.forEach(p => { if (!p.created) p.dateCustom = false; }); redistribute(); render(); }), 'full')),
      h('div', { class: 'hint' }, 'Tasky se rozloží od pondělí do pátku vybraného týdne (první v pondělí, poslední v pátek).')));
    infoEl.append(detected.length ? h('div', { style: 'margin-bottom:8px' }, 'Product v opportunity: ', h('b', null, detected.join(', ')), detectedFrom === 'název opty' ? ' (podle názvu)' : '', ' ', btn('↻ Znovu zjistit', 'sec sm', () => { detectProducts(); detectInfo(); rows.filter(p => !p.created && !p.product).forEach(p => p.product = detected[0] || ''); render(); }, { 'aria-label': 'Znovu zjistit údaje z opportunity' })) : h('div', { style: 'margin-bottom:8px' }, 'Product v opportunity se nepodařilo zjistit – vyberte ho u tasku. ', btn('↻ Znovu zjistit', 'sec sm', () => { detectProducts(); detectInfo(); render(); }), ' '));
    rows.forEach((p, i) => listEl.append(card(p, i)));
    addRow.append(btn('＋ Přidat další task', 'sec', () => { const last = rows[rows.length - 1]; rows.push(newRow(last)); redistribute(); render(); setTimeout(() => { const ins = listEl.querySelectorAll('input[type=text]'); if (ins.length) ins[ins.length - 1].focus(); }, 30); }, { style: 'width:100%' }));
    const open = rows.filter(p => !p.created).length;
    runBtn.textContent = open ? `▶ Vytvořit ${open} ${taskWord(open)}` : 'Hotovo';
    runBtn.disabled = busy || !open; if (busy) runBtn.style.display = 'none';
  }

  function card(p, i) {
    const miss = missingFields(p);
    const subj = h('input', { type: 'text', value: p.subject, disabled: p.created, placeholder: 'Zadejte název tasku', 'aria-label': 'Název tasku', oninput: e => { p.subject = e.target.value; p.customSubject = e.target.value !== autoSubject(p); } });
    const tySel = sel(typesFor(p.phase), p.type, v => { p.type = v; if (!p.customSubject) { p.subject = autoSubject(p); subj.value = p.subject; } }, { disabled: p.created });
    const prodSel = sel([['', '— vyberte —'], ...productOptions()], p.product, v => { p.product = v; }, { disabled: p.created });
    return h('section', { class: 'card' + (p.created ? ' done' : (p.error ? ' bad' : '')), 'aria-label': 'Task ' + (i + 1) },
      h('div', { class: 'ch' }, h('span', null, p.created ? '✓ Task ' + (i + 1) + ' vytvořen' : 'Task ' + (i + 1)),
        (!p.created && rows.length > 1) ? btn('Odebrat', 'sec sm', () => { rows = rows.filter(x => x.id !== p.id); redistribute(); render(); }) : null),
      p.error ? h('div', { class: 'err', role: 'alert' }, p.error) : null,
      h('div', { class: 'grid' },
        fld('Název tasku *', subj, 'full'),
        fld('Datum (Due Date) *', h('input', { type: 'date', value: p.date, disabled: p.created, onchange: e => { if (e.target.value) { p.date = e.target.value; p.dateCustom = true; } } })),
        fld('Product *', prodSel),
        fld('Typ tasku (' + p.phase + ') *', tySel, 'full'),
        fld('Audience *', sel(AUDIENCES, p.audience, v => { p.audience = v; S.audience = v; saveState(); }, { disabled: p.created }), 'full')));
  }

  /* ---------- vytvoření ---------- */
  async function run() {
    if (busy) return;
    const chosen = rows.filter(p => !p.created);
    const bad = chosen.filter(p => missingFields(p).length);
    const CZ = { Subject: 'Název tasku', 'Due Date': 'Datum', Status: 'Status', Category: 'Kategorie', 'Task Type': 'Typ tasku', Audience: 'Audience', Product: 'Product', Priority: 'Priority' };
    if (bad.length) { bad.forEach(p => { p.error = 'Chybí: ' + missingFields(p).map(x => CZ[x] || x).join(', '); }); render(); setStatus('Doplňte označená pole.'); return; }
    chosen.forEach(p => { p.error = ''; p.oppName = oppName(); p.oppId = rid; p.phase = ctx.dadd; });
    busy = true; panel.classList.add('run'); stopBtn.style.display = ''; runBtn.style.display = 'none'; progBar.style.width = '0'; render();
    log('Vytvářím ' + chosen.length + ' ' + taskWord(chosen.length) + '…');
    try { await fillSelected(chosen.slice(), true, log, setStatus); }
    catch (e) { log('CHYBA: ' + e.message); }
    finally { busy = false; panel.classList.remove('run'); stopBtn.style.display = 'none'; runBtn.style.display = ''; render(); }
  }

  /* ---------- start ---------- */
  let detTries = 0;
  function retryDetect() { detTries = 0; const t = setInterval(() => {
    if (!PDOC.body.contains(panel)) { clearInterval(t); return; }
    detTries++; const before = detected.join() + '|' + ctx.stage + '|' + ctx.dadd + '|' + ctx.daddFound;
    detectProducts(); detectInfo();
    const after = detected.join() + '|' + ctx.stage + '|' + ctx.dadd + '|' + ctx.daddFound;
    if (after !== before) { rows.filter(p => !p.created && !p.product).forEach(p => { p.product = detected[0] || ''; }); if (!ctx.daddUser) applyDadd(ctx.dadd); if (!busy) render(); }
    if ((detected.length && ctx.stage && ctx.daddFound) || detTries >= 6) { if (!ctx.daddFound || !ctx.stage) logLabels(); clearInterval(t); }
  }, 2500); }
  log('AutoTask jednoduchý v3.4 (2026-10-25) · ' + mode() + ' · ' + PWIN.location.pathname + ' · formát data: ' + S.dateFormat);
  setStatus('Připraveno.');
  render();
  let lastHref = PWIN.location.href;
  const navTimer = setInterval(() => { if (!PDOC.body.contains(panel)) { clearInterval(navTimer); return; } if (PWIN.location.href !== lastHref) { lastHref = PWIN.location.href; if (!busy) render(); } }, 800);
})();
