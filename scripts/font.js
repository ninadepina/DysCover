import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeFont = (defaultFontLabel, defaultFontInput, fontButtons) => {
	const updateFont = async () => {
		await executeScriptOnActiveTab(() => {
			const computedStyle = getComputedStyle(document.body);
			const font = computedStyle.fontFamily;
			const fontWeight = computedStyle.fontWeight;
			chrome.runtime.sendMessage({ type: 'updateFont', font, fontWeight });
		});
	};

	const handleFontChange = async (fontFamily) => {
		await executeScriptOnActiveTab((font) => {
			document.body.style.fontFamily = font;
		}, fontFamily);
	};

	chrome.runtime.onMessage.addListener((message) => {
		if (message.type === 'updateFont') {
			const { font, fontWeight } = message;
			if (defaultFontLabel) {
				defaultFontLabel.style.fontFamily = font;
				defaultFontLabel.style.fontWeight = fontWeight;
			}
			if (defaultFontInput) {
				defaultFontInput.value = font;
			}
		}
	});

	fontButtons.forEach((button) => {
		button.addEventListener('change', (event) => {
			const selectedFont = event.target.value;
			handleFontChange(selectedFont);
		});
	});

	chrome.tabs.onActivated.addListener(updateFont);
	chrome.tabs.onUpdated.addListener(updateFont);

	updateFont();
};
