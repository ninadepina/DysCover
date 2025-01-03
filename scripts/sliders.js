import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeSliders = (sliders, filters) => {
	const updateStyle = async (slider, styleProp, unit, prefix = '', suffix = '') => {
		const value = slider.value;
		slider.nextElementSibling.querySelector('span').textContent = value;
		await executeScriptOnActiveTab(
			(prop, val, unit) => {
				prop === 'zoom'
					? (document.body.style.zoom = val / 100)
					: document.querySelectorAll('*').forEach((el) => (el.style[prop] = val + unit));
			},
			styleProp,
			parseInt(value, 10),
			unit,
			prefix,
			suffix
		);
	};

	const updateFilter = async (type, value) => {
		filters[type] = `${value}%`;
		const filterString = Object.entries(filters)
			.map(([key, val]) => `${key}(${val})`)
			.join(' ');
		await executeScriptOnActiveTab((filterString) => (document.body.style.filter = filterString), filterString);
	};

	sliders.forEach(({ id, styleProp, unit, prefix, suffix }) => {
		const slider = document.querySelector(id);
		slider.addEventListener('input', () => {
			if (styleProp === 'filter') updateFilter(prefix.replace('(', ''), slider.value);
			updateStyle(slider, styleProp, unit, prefix, suffix);
		});
	});
};
