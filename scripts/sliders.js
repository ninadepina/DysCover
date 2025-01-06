import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeSliders = (sliders, filters) => {
	const updateSliderLabel = (slider, value) => {
		slider.nextElementSibling.querySelector('span').textContent = value;
	};

	const updateStyle = async (slider, styleProp, unit, prefix = '', suffix = '') => {
		const value = slider.value;
		updateSliderLabel(slider, value);

		await executeScriptOnActiveTab(
			(prop, val, unit) => {
				if (prop === 'zoom') {
					document.body.style.zoom = val / 100;
				} else {
					document.querySelectorAll('*').forEach((el) => (el.style[prop] = val + unit));
				}
			},
			styleProp,
			parseInt(value, 10),
			unit,
			prefix,
			suffix
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
		filters[type] = `${value}%`;
		const filterString = Object.entries(filters)
			.map(([key, val]) => `${key}(${val})`)
			.join(' ');

		await executeScriptOnActiveTab((filterString) => {
			document.body.style.filter = filterString;
		}, filterString);
	};

	sliders.forEach(({ id, styleProp, unit, prefix = '', suffix = '' }) => {
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
					updateStyle(slider, styleProp, unit, prefix, suffix);
					break;
			}
		});
	});
};
