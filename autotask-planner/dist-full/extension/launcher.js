(() => {
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
