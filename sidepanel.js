document.addEventListener('DOMContentLoaded', () => {
	const zoomSlider = document.querySelector('#slider-zoom');
	const zoomValueDisplay = zoomSlider.nextElementSibling.querySelector('span');

	const updateZoom = async () => {
		const zoomLevel = zoomSlider.value;
		zoomValueDisplay.textContent = zoomLevel;

		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		const tabId = tab.id;

		// Check if the URL is not restricted
		if (!url.startsWith('chrome://') && !url.startsWith('chrome-extension://')) {
			chrome.scripting.executeScript({
				target: { tabId },
				func: (zoom) => {
					document.body.style.zoom = zoom / 100;
				},
				args: [parseInt(zoomLevel, 10)]
			});
		}
	};

	zoomSlider.addEventListener('input', updateZoom);
});
