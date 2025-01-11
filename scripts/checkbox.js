import { applyFilters } from './utils/applyFilters.js';

export const initializeCheckboxes = (invertCheckbox, monochromeCheckbox) => {
	const updateFilters = () => {
		const filters = [
			invertCheckbox.checked && 'invert(100%)',
			monochromeCheckbox.checked && 'grayscale(100%)',
		].filter(Boolean); // remove any falsy values

		const filterString = filters.join(' ');
		applyFilters(filterString);
	};

	invertCheckbox.addEventListener('change', updateFilters);
	monochromeCheckbox.addEventListener('change', updateFilters);
};
