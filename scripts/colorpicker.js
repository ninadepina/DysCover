import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';
import { rgbToHex } from "./utils/rgbToHex.js";

export const initializeColorPicker = (colorPicker, colorPickerText) => {
	const updateColorPicker = async () => {
		await executeScriptOnActiveTab(() => {
			const color = getComputedStyle(document.body).color;
			chrome.runtime.sendMessage({ type: 'updateColorPicker', color });
		});
	};

	chrome.runtime.onMessage.addListener((message) => {
		if (message.type === 'updateColorPicker') {
			const hexColor = rgbToHex(message.color);
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
