import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';
import { rgbToHex } from './utils/rgbToHex.js';

export const initializeColorPicker = (colorPicker, colorPickerText) => {
	const updateColorPicker = async () => {
		try {
			await executeScriptOnActiveTab(() => {
				const { color } = getComputedStyle(document.body);
				chrome.runtime.sendMessage({ type: 'updateColorPicker', color });
			});
		} catch (err) {
			return;
		}
	};
	chrome.runtime.onMessage.addListener(({ type, color }) => {
		if (type === 'updateColorPicker') {
			try {
				const hexColor = rgbToHex(color);
				colorPicker.value = hexColor;
				colorPickerText.textContent = hexColor;
			} catch (err) {
				return;
			}
		}
	});

	colorPickerText.textContent = colorPicker.value;
	colorPicker.addEventListener('input', () => {
		try {
			colorPickerText.textContent = colorPicker.value;

			executeScriptOnActiveTab((color) => {
				document.body.style.color = color;
			}, colorPicker.value);
		} catch (err) {
			return;
		}
	});

	chrome.tabs.onActivated.addListener(updateColorPicker);
	chrome.tabs.onUpdated.addListener(updateColorPicker);

	updateColorPicker();
};
