import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeColorPicker = (colorPicker, colorPickerText) => {
	colorPickerText.textContent = colorPicker.value;
	colorPicker.addEventListener('input', () => {
		colorPickerText.textContent = colorPicker.value;

		executeScriptOnActiveTab((color) => {
			document.body.style.color = color;
		}, colorPicker.value);
	});
};
