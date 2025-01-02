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

	const invertCheckbox = document.querySelector('input[name="invert"]');
	const monochromeCheckbox = document.querySelector('input[name="monochrome"]');
	const activeFilters = { invert: false, monochrome: false };

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

	document.querySelector(textToSpeechButton.id).addEventListener('click', async () => {
		await executeScriptOnActiveTab(() => {
			const selectedText = window.getSelection().toString();
			selectedText
				? speechSynthesis.speak(new SpeechSynthesisUtterance(selectedText))
				: alert(textToSpeechButton.alert);
		});
	});

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

	const executeScriptOnActiveTab = async (func, ...args) => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		const { id: tabId, url } = tab;

		if (!url.startsWith('chrome://') && !url.startsWith('chrome-extension://')) {
			chrome.scripting.executeScript({ target: { tabId }, func, args });
		}
	};
});
