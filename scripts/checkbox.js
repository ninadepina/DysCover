import { applyFilters } from './utils/applyFilters.js';

export const initializeCheckboxes = (invertCheckbox, monochromeCheckbox) => {
	const updateFilters = () => {
		const existingFilters = document.body.getAttribute('data-filter') || '';
		const existingFiltersArray = existingFilters.split(' ').filter(Boolean);

		const cssFilters = [
			invertCheckbox.checked && 'invert(100%)',
			monochromeCheckbox.checked && 'grayscale(100%)',
		].filter(Boolean); // remove falsy values

		const updatedFilters = [
			...existingFiltersArray.filter(filter =>
				!(
					(filter === 'invert(100%)' && !invertCheckbox.checked) ||
					(filter === 'grayscale(100%)' && !monochromeCheckbox.checked)
				)
			),
			...cssFilters.filter(filter => !existingFiltersArray.includes(filter))
		].join(' ');

		applyFilters(updatedFilters);
	};

	invertCheckbox.addEventListener('change', updateFilters);
	monochromeCheckbox.addEventListener('change', updateFilters);

	const resetCheckboxStates = () => {
		invertCheckbox.checked = false;
		monochromeCheckbox.checked = false;

		applyFilters('');
	};

	chrome.tabs.onActivated.addListener(() => {
		resetCheckboxStates();
	});

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (changeInfo.status === 'complete') {
			resetCheckboxStates();
		}
	});
};
