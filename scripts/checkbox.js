import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeCheckboxes = (invertCheckbox, monochromeCheckbox, activeFilters) => {
	const updateFilters = async () => {
		const filters = [
			activeFilters.invert && 'invert(100%)',
			activeFilters.monochrome && 'grayscale(100%)',
		].filter(Boolean); // remove any falsy values

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
