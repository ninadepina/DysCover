export const initializeGlobalSettings = (sliders, globalUpdateButton, globalApplyButton) => {
	globalUpdateButton.addEventListener('click', () => {
		const settings = sliders.map(({ id }) => ({ id, value: document.querySelector(id).value }));
		localStorage.setItem('globalSettings', JSON.stringify(settings));
		alert('Settings saved!');
	});

	globalApplyButton.addEventListener('click', () => {
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
};
