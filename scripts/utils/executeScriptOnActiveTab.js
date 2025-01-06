export const executeScriptOnActiveTab = async (func, ...args) => {
	const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (!activeTab || !activeTab.url) return;

	const { id: tabId, url } = activeTab;

	if (!/^chrome(|-extension):\/\//.test(url)) {
		await chrome.scripting.executeScript({ target: { tabId }, func, args });
	}
};
