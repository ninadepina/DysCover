import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeCheckboxes = (invertCheckbox, monochromeCheckbox, activeFilters) => {
	const updateFilters = async () => {
		const filters = [];
		if (activeFilters.invert) filters.push('invert(100%)');
		if (activeFilters.monochrome) filters.push('grayscale(100%)');

		const filterString = filters.join(' ');
		await executeScriptOnActiveTab((filter) => {
			document.body.style.filter = filter;
		}, filterString);
	};

	invertCheckbox.addEventListener('change', async () => {
		activeFilters.invert = invertCheckbox.checked;
		await updateFilters();
	});

	monochromeCheckbox.addEventListener('change', async () => {
		activeFilters.monochrome = monochromeCheckbox.checked;
		await updateFilters();
	});
};
