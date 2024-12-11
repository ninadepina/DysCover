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
			document.body.style.fontSize = size + '%';
		}, parseInt(fontSize, 10));
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
});
