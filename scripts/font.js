import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeFont = (defaultFontLabel, defaultFontInput, fontButtons) => {
	const handleFontChange = async (fontFamily) => {
		try {
			await executeScriptOnActiveTab((font) => {
				document.body.style.fontFamily = font;
			}, fontFamily);
		} catch (err) {
			console.error('Failed to change font:', err);
		}
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

	chrome.tabs.onActivated.addListener(() => {
		defaultFontInput.checked = true;
	});

	chrome.tabs.onUpdated.addListener(() => {
		defaultFontInput.checked = true;
	});
};
