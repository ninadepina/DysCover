document.addEventListener('DOMContentLoaded', () => {
	// zoom slider
	const zoomSlider = document.querySelector('#slider-zoom');
	const zoomValueDisplay = zoomSlider.nextElementSibling.querySelector('span');

	const updateZoom = async () => {
		const zoomLevel = zoomSlider.value;
		zoomValueDisplay.textContent = zoomLevel;
		await executeScriptOnActiveTab((zoom) => {
			document.body.style.zoom = zoom / 100;
		}, parseInt(zoomLevel, 10));
	};

	// font size slider
	const fontSizeSlider = document.querySelector('#slider-size');
	const fontSizeValueDisplay = fontSizeSlider.nextElementSibling.querySelector('span');

	const updateFontSize = async () => {
		const fontSize = fontSizeSlider.value;
		fontSizeValueDisplay.textContent = fontSize;
		await executeScriptOnActiveTab((size) => {
			const elements = document.querySelectorAll('*');
			elements.forEach((el) => {
				el.style.fontSize = size + '%';
			});
		}, parseInt(fontSize, 10));
	};

	// line height slider
	const lineHeightSlider = document.querySelector('#slider-line');
	const lineHeightValueDisplay = lineHeightSlider.nextElementSibling.querySelector('span');

	const updateLineHeight = async () => {
		const lineHeight = lineHeightSlider.value;
		lineHeightValueDisplay.textContent = lineHeight;
		await executeScriptOnActiveTab((height) => {
			const elements = document.querySelectorAll('*');
			elements.forEach((el) => {
				el.style.lineHeight = height + '%';
			});
		}, parseInt(lineHeight, 10));
	};

	// letter spacing slider

	// contrast slider
	const contrastSlider = document.querySelector('#slider-contrast');
	const contrastValueDisplay = contrastSlider.nextElementSibling.querySelector('span');

	const updateContrast = async () => {
		const contrast = contrastSlider.value;
		contrastValueDisplay.textContent = contrast;
		await executeScriptOnActiveTab((contrastLevel) => {
			document.body.style.filter = `contrast(${contrastLevel}%)`;
		}, parseInt(contrast, 10));
	};

	// saturation slider
	const saturationSlider = document.querySelector('#slider-saturation');
	const saturationValueDisplay = saturationSlider.nextElementSibling.querySelector('span');

	const updateSaturation = async () => {
		const saturationValue = saturationSlider.value;
		saturationValueDisplay.textContent = saturationValue;
		await executeScriptOnActiveTab((saturation) => {
			document.body.style.filter = `saturate(${saturation}%)`;
		}, parseInt(saturationValue, 10));
	};

	// execute script on active tab
	const executeScriptOnActiveTab = async (func, arg) => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		const tabId = tab.id;
		const url = tab.url;

		if (!url.startsWith('chrome://') && !url.startsWith('chrome-extension://')) {
			chrome.scripting.executeScript({
				target: { tabId },
				func,
				args: [arg]
			});
		}
	};

	zoomSlider.addEventListener('input', updateZoom);
	fontSizeSlider.addEventListener('input', updateFontSize);
	lineHeightSlider.addEventListener('input', updateLineHeight);
	contrastSlider.addEventListener('input', updateContrast);
	saturationSlider.addEventListener('input', updateSaturation);
});
