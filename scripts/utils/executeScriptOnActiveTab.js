export const executeScriptOnActiveTab = async (func, ...args) => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	const { id: tabId, url } = tab;

	if (!url.startsWith('chrome://') && !url.startsWith('chrome-extension://')) {
		chrome.scripting.executeScript({ target: { tabId }, func, args });
	}
};
