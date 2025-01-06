import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';
import { rgbToHex } from './utils/rgbToHex.js';

export const initializeColorPicker = (colorPicker, colorPickerText) => {
	const updateColorPicker = async () => {
		await executeScriptOnActiveTab(() => {
			const { color } = getComputedStyle(document.body);
			chrome.runtime.sendMessage({ type: 'updateColorPicker', color });
		});
	};

	chrome.runtime.onMessage.addListener(({ type, color }) => {
		if (type === 'updateColorPicker') {
			const hexColor = rgbToHex(color);
			colorPicker.value = hexColor;
			colorPickerText.textContent = hexColor;
		}
	});

	colorPickerText.textContent = colorPicker.value;
	colorPicker.addEventListener('input', () => {
		colorPickerText.textContent = colorPicker.value;

		executeScriptOnActiveTab((color) => {
			document.body.style.color = color;
		}, colorPicker.value);
	});

	chrome.tabs.onActivated.addListener(updateColorPicker);
	chrome.tabs.onUpdated.addListener(updateColorPicker);

	updateColorPicker();
};
