const sliders = [
	{ id: '#slider-zoom', styleProp: 'zoom', unit: '', factor: 100 },
	{ id: '#slider-size', styleProp: 'fontSize', unit: '%', factor: 1 },
	{ id: '#slider-line', styleProp: 'lineHeight', unit: '%', factor: 1 },
	{ id: '#slider-contrast', styleProp: 'filter', unit: '%', prefix: 'contrast(', suffix: ')' },
	{ id: '#slider-saturation', styleProp: 'filter', unit: '%', prefix: 'saturate(', suffix: ')' }
];

document.addEventListener('DOMContentLoaded', () => {
	const updateStyle = async (slider, styleProp, unit, factor, prefix = '', suffix = '') => {
		const value = slider.value;
		slider.nextElementSibling.querySelector('span').textContent = value;
		await executeScriptOnActiveTab(
			(prop, val, unit, prefix, suffix) => {
				switch (prop) {
					case 'zoom':
						document.body.style.zoom = val / 100;
						break;
					case 'filter':
						document.body.style.filter = `${prefix}${val}${unit}${suffix}`;
						break;
					default:
						const elements = document.querySelectorAll('*');
						elements.forEach((el) => {
							el.style[prop] = val + unit;
						});
						break;
				}
			},
			styleProp,
			parseInt(value, 10),
			unit,
			prefix,
			suffix
		);
	};

	sliders.forEach(({ id, styleProp, unit, factor, prefix, suffix }) => {
		const slider = document.querySelector(id);
		slider.addEventListener('input', () => updateStyle(slider, styleProp, unit, factor, prefix, suffix));
	});

	document.querySelector('#speakButton').addEventListener('click', async () => {
		await executeScriptOnActiveTab(() => {
			const selectedText = window.getSelection().toString();
			selectedText
				? speechSynthesis.speak(new SpeechSynthesisUtterance(selectedText))
				: alert('Please select some text to speak!');
		});
	});

	const executeScriptOnActiveTab = async (func, ...args) => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		const tabId = tab.id;
		const url = tab.url;

		if (!url.startsWith('chrome://') && !url.startsWith('chrome-extension://')) {
			chrome.scripting.executeScript({
				target: { tabId },
				func,
				args
			});
		}
	};
});
