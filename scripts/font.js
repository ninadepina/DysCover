import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeFont = (defaultFontLabel) => {
	const updateFont = async () => {
		await executeScriptOnActiveTab(() => {
			const computedStyle = getComputedStyle(document.body);
			const font = computedStyle.fontFamily;
			const fontWeight = computedStyle.fontWeight;
			chrome.runtime.sendMessage({ type: 'updateFont', font, fontWeight });
		});
	};

	chrome.runtime.onMessage.addListener((message) => {
		if (message.type === 'updateFont') {
			const { font, fontWeight } = message;
			if (defaultFontLabel) {
				defaultFontLabel.style.fontFamily = font;
				defaultFontLabel.style.fontWeight = fontWeight;
			}
		}
	});

	chrome.tabs.onActivated.addListener(updateFont);
	chrome.tabs.onUpdated.addListener(updateFont);

	updateFont();
};
