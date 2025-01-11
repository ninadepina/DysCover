import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeCheckboxes = (invertCheckbox, monochromeCheckbox) => {
	const updateFilters = async () => {
		const filters = [
			invertCheckbox.checked && 'invert(100%)',
			monochromeCheckbox.checked && 'grayscale(100%)',
		].filter(Boolean); // remove any falsy values

		const filterString = filters.join(' ');
		await executeScriptOnActiveTab((filter) => {
			document.body.style.filter = filter;
		}, filterString);
	};

	invertCheckbox.addEventListener('change', updateFilters);
	monochromeCheckbox.addEventListener('change', updateFilters);
};