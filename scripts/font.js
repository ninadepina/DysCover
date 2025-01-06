import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeFont = (defaultFontLabel, defaultFontInput, fontButtons) => {
	const updateFont = async () => {
		await executeScriptOnActiveTab(() => {
			const { fontFamily, fontWeight } = getComputedStyle(document.body);
			chrome.runtime.sendMessage({ type: 'updateFont', font: fontFamily, fontWeight });
		});
	};

	const handleFontChange = async (fontFamily) => {
		await executeScriptOnActiveTab((font) => {
			document.body.style.fontFamily = font;
		}, fontFamily);
	};

	chrome.runtime.onMessage.addListener(({ type, font, fontWeight }) => {
		if (type === 'updateFont') {
			if (defaultFontLabel) Object.assign(defaultFontLabel.style, { fontFamily: font, fontWeight });
			if (defaultFontInput) defaultFontInput.value = font;
		}
	});

	fontButtons.forEach((button) => {
		button.addEventListener('change', (e) => {
			handleFontChange(e.target.value);
		});
	});

	chrome.tabs.onActivated.addListener(updateFont);
	chrome.tabs.onUpdated.addListener(updateFont);

	updateFont();
};
