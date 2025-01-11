import { initializeCheckboxes } from './scripts/checkbox.js';
import { initializeColorPicker } from './scripts/colorpicker.js';
import { initializeFont } from './scripts/font.js';
import { initializeSliders } from './scripts/sliders.js';
import { initializeTextToSpeech } from './scripts/text-to-speech.js';
import { initializeGlobalSettings } from './scripts/settings.js';

const sliders = [
	{ id: '#slider-zoom', styleProp: 'zoom', unit: '', factor: 100 },
	{ id: '#slider-size', styleProp: 'fontSize', unit: '%', factor: 1 },
	{ id: '#slider-line', styleProp: 'lineHeight', unit: '%', factor: 1 },
	{ id: '#slider-spacing', styleProp: 'letterSpacing', unit: 'px', factor: 5, base: 0 },
	{ id: '#slider-contrast', styleProp: 'filter', unit: '%', prefix: 'contrast(', suffix: ')' },
	{ id: '#slider-saturation', styleProp: 'filter', unit: '%', prefix: 'saturate(', suffix: ')' }
];
const sharedEntries = [{ name: 'invert', type: 'checkbox' }, { name: 'monochrome', type: 'checkbox' }];
const inputs = [{ name: 'font-family', type: 'radio' }, { name: 'font-color', type: 'color' }, ...sharedEntries];
const filters = [{ name: 'contrast', type: 'slider' }, { name: 'saturate', type: 'slider' }, ...sharedEntries];
const textToSpeechButton = { id: '#speakButton', alert: 'Please select some text to speak!' };

document.addEventListener('DOMContentLoaded', () => {
	// sliders
	initializeSliders(sliders, filters);

	// font
	const defaultFontLabel = document.querySelector('#default-font');
	const defaultFontInput = document.querySelector('#default-font > input');
	const fontButtons = document.querySelectorAll('input[name="font-family"]');
	initializeFont(defaultFontLabel, defaultFontInput, fontButtons);

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
	initializeTextToSpeech(textToSpeechButton);

	// global settings
	const globalUpdateButton = document.querySelector('#global--update');
	const globalApplyButton = document.querySelector('#global--apply');
	const specificAddButton = document.querySelector('#specific--add');
	initializeGlobalSettings(sliders, inputs, globalUpdateButton, globalApplyButton, specificAddButton);
});
