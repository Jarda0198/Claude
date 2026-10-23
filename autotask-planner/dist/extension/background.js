chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({ target: { tabId: tab.id }, world: 'MAIN', func: () => { if (window.__AUTOTASK_RUN) window.__AUTOTASK_RUN(); else alert('AutoTask Planner: otevřete Salesforce (lightning.force.com).'); } });
});
