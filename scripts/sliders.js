import { applyFilters } from './utils/applyFilters.js';
import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeSliders = (sliders, filters) => {
	const activeFilters = {};

	const updateSliderLabel = (slider, value) => {
		slider.nextElementSibling.querySelector('span').textContent = value;
	};

	const updateStyle = async (slider, styleProp, unit, prefix = '', suffix = '', factor = 1, base = 0) => {
		const value = styleProp === 'letterSpacing' ? ((slider.value - 100) * factor) / 100 + base : slider.value;
		// prettier-ignore
		const labelValue =
			styleProp === 'letterSpacing'
				? `${(value + 100).toFixed(0)}`
				: value;

		updateSliderLabel(slider, labelValue);

		await executeScriptOnActiveTab(
			(prop, val, unit) => {
				prop === 'zoom'
					? (document.body.style.zoom = val / 100)
					: document.querySelectorAll('*').forEach((el) => (el.style[prop] = val + unit));
			},
			styleProp,
			value,
			unit
		);
	};

	const updateFontSize = async (slider) => {
		const scaleFactor = slider.value / 100;
		updateSliderLabel(slider, slider.value);

		await executeScriptOnActiveTab((scaleFactor) => {
			if (!window.originalFontSizes) {
				window.originalFontSizes = new Map();
				document.querySelectorAll('*').forEach((el) => {
					const computedStyle = window.getComputedStyle(el);
					const fontSize = parseFloat(computedStyle.fontSize);
					window.originalFontSizes.set(el, fontSize);
				});
			}

			window.originalFontSizes.forEach((originalSize, el) => {
				el.style.fontSize = `${originalSize * scaleFactor}px`;
			});
		}, scaleFactor);
	};

	const updateLineHeight = async (slider) => {
		const scaleFactor = slider.value / 100;
		updateSliderLabel(slider, slider.value);

		await executeScriptOnActiveTab((scaleFactor) => {
			if (!window.originalLineHeights) {
				window.originalLineHeights = new Map();
				document.querySelectorAll('*').forEach((el) => {
					const computedStyle = window.getComputedStyle(el);
					const lineHeight = parseFloat(computedStyle.lineHeight);
					if (!isNaN(lineHeight)) {
						window.originalLineHeights.set(el, lineHeight);
					}
				});
			}

			window.originalLineHeights.forEach((originalLineHeight, el) => {
				el.style.lineHeight = `${originalLineHeight * scaleFactor}px`;
			});
		}, scaleFactor);
	};

	const updateFilter = async (type, value, slider) => {
		updateSliderLabel(slider, value);

		activeFilters[type] = `${value}%`;

		const filterString = Object.entries(activeFilters)
			.map(([key, val]) => `${key}(${val})`)
			.join(' ');

		await applyFilters(filterString);
	};

	sliders.forEach(({ id, styleProp, unit, prefix = '', suffix = '', factor = 1, base = 0 }) => {
		const slider = document.querySelector(id);

		if (!slider) return;

		slider.addEventListener('input', () => {
			switch (styleProp) {
				case 'fontSize':
					updateFontSize(slider);
					break;
				case 'filter':
					updateFilter(prefix.replace('(', ''), slider.value, slider);
					break;
				case 'lineHeight':
					updateLineHeight(slider);
					break;
				default:
					updateStyle(slider, styleProp, unit, prefix, suffix, factor, base);
					break;
			}
		});
	});
};
