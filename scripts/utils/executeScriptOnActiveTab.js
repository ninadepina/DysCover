export const executeScriptOnActiveTab = async (func, ...args) => {
	try {
	  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
	  if (!activeTab || !activeTab.url) return;
  
	  const { id: tabId, url } = activeTab;
  
	  // don't run on chrome:// pages
	  if (!/^chrome(|-extension):\/\//.test(url)) {
		await chrome.scripting.executeScript({ target: { tabId }, func, args });
	  }
	} catch (err) {
	  return;
	}
  };
  