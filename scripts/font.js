import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeFont = () => {
	const updateFont = async () => {
		await executeScriptOnActiveTab(() => {
			const font = getComputedStyle(document.body).fontFamily;
			chrome.runtime.sendMessage({ type: 'updateFont', font });
		});
	};

	chrome.runtime.onMessage.addListener((message) => {
		if (message.type === 'updateFont') {
			console.log('Current font:', message.font);
		}
	});

	chrome.tabs.onActivated.addListener(updateFont);
	chrome.tabs.onUpdated.addListener(updateFont);

	updateFont();
};
