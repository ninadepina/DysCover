import { initializeCheckboxes } from './scripts/checkbox.js';
import { initializeColorPicker } from './scripts/colorpicker.js';
import { initializeSliders } from './scripts/sliders.js';
import { initializeTextToSpeech } from './scripts/text-to-speech.js';

const sliders = [
	{ id: '#slider-zoom', styleProp: 'zoom', unit: '', factor: 100 },
	{ id: '#slider-size', styleProp: 'fontSize', unit: '%', factor: 1 },
	{ id: '#slider-line', styleProp: 'lineHeight', unit: '%', factor: 1 },
	{ id: '#slider-contrast', styleProp: 'filter', unit: '%', prefix: 'contrast(', suffix: ')' },
	{ id: '#slider-saturation', styleProp: 'filter', unit: '%', prefix: 'saturate(', suffix: ')' }
];
const textToSpeechButton = { id: '#speakButton', alert: 'Please select some text to speak!' };
const filters = { contrast: '100%', saturate: '100%' };

document.addEventListener('DOMContentLoaded', () => {
	// sliders
	initializeSliders(sliders, filters);

	// checkboxes
	const invertCheckbox = document.querySelector('input[name="invert"]');
	const monochromeCheckbox = document.querySelector('input[name="monochrome"]');
	const activeFilters = { invert: false, monochrome: false };
	initializeCheckboxes(invertCheckbox, monochromeCheckbox, activeFilters);

	// colorpicker
	const colorPicker = document.querySelector('input[name="font-color"]');
	const colorPickerText = document.querySelector('input[name="font-color"] + span');
	initializeColorPicker(colorPicker, colorPickerText);

	// text-to-speech
	initializeTextToSpeech(textToSpeechButton.id, textToSpeechButton.alert);

	document.querySelector('#global--update').addEventListener('click', () => {
		const settings = sliders.map(({ id }) => ({ id, value: document.querySelector(id).value }));
		localStorage.setItem('globalSettings', JSON.stringify(settings));
		alert('Settings saved!');
	});

	document.querySelector('#global--apply').addEventListener('click', () => {
		const settings = JSON.parse(localStorage.getItem('globalSettings'));
		if (!settings) {
			alert('No settings found!');
			return;
		}

		settings.forEach(({ id, value }) => {
			const slider = document.querySelector(id);
			slider.value = value;
			slider.dispatchEvent(new Event('input'));
		});
	});
});
