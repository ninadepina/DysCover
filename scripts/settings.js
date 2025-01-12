import { createTooltip } from './utils/createTooltip.js';

export const initializeGlobalSettings = (sliders, inputs, globalUpdateButton, globalApplyButton, specificAddButton) => {
	const loadSpecificSettings = () => {
		const specificSettings = JSON.parse(localStorage.getItem('specificSettings')) || [];
		const dropdownContent = document.querySelector('.dropdown-content--specific');

		dropdownContent.innerHTML = '';

		specificSettings.forEach(({ site, settings }, index) => {
			const dropdownItem = document.createElement('div');
			dropdownItem.classList.add('dropdown-item');

			const siteName = document.createElement('p');
			siteName.textContent = site;
			dropdownItem.appendChild(siteName);

			const settingOptions = document.createElement('div');
			settingOptions.classList.add('setting-options');

			// remove button
			const removeTooltip = createTooltip('remove settings for this site', 'remove', site);
			removeTooltip.addEventListener('click', () => {
				specificSettings.splice(index, 1);
				localStorage.setItem('specificSettings', JSON.stringify(specificSettings));
				loadSpecificSettings();
			});
			settingOptions.appendChild(removeTooltip);

			// apply button
			const applyTooltip = createTooltip('use these site settings', 'apply', site);
			applyTooltip.addEventListener('click', () => {
				settings.forEach(({ id, value }) => {
					const inputElement = document.querySelector(id);
					inputElement.type === 'checkbox'
						? inputElement.checked = value
						: inputElement.value = value;
					inputElement.dispatchEvent(new Event('input'));
				});
			});
			settingOptions.appendChild(applyTooltip);

			// update button
			const updateTooltip = createTooltip('save current settings to site', 'update', site);
			updateTooltip.classList.add('tooltip--right');
			updateTooltip.addEventListener('click', () => {
				const updatedSettings = collectCurrentSettings(sliders, inputs);
				specificSettings[index].settings = updatedSettings;
				localStorage.setItem('specificSettings', JSON.stringify(specificSettings));
			});
			settingOptions.appendChild(updateTooltip);

			dropdownItem.appendChild(settingOptions);
			dropdownContent.appendChild(dropdownItem);
		});
	};

	const applyGlobalSettings = () => {
		const settings = JSON.parse(localStorage.getItem('globalSettings'));
		if (!settings) return;

		settings.forEach(({ id, value }) => {
			const inputElement = document.querySelector(id);
			if (inputElement.type === 'checkbox') {
				inputElement.checked = value;
				inputElement.dispatchEvent(new Event('change'));
			} else {
				inputElement.value = value;
				inputElement.dispatchEvent(new Event('input'));
			}
		});
	};

	const applySpecificSettings = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const activeTab = tabs[0];
			const tabUrl = activeTab?.url;

			if (!tabUrl || !/^https?:\/\/.+/.test(tabUrl)) {
				resetToDefaultSettings();
				return;
			}

			const siteNameText = new URL(tabUrl).hostname;

			const specificSettings = JSON.parse(localStorage.getItem('specificSettings')) || [];

			const specificSetting = specificSettings.find((setting) => setting.site === siteNameText);

			if (specificSetting) {
				specificSetting.settings.forEach(({ id, value }) => {
					const inputElement = document.querySelector(id);
					if (inputElement.type === 'checkbox') {
						inputElement.checked = value;
						inputElement.dispatchEvent(new Event('change'));
					} else {
						inputElement.value = value;
						inputElement.dispatchEvent(new Event('input'));
					}
				});
			} else {
				applyGlobalSettings();
			}
		});
	};

	const resetToDefaultSettings = () => {
		const sliders = document.querySelectorAll('input[type="range"], input[type="number"]');
		sliders.forEach((slider) => {
			slider.value = 100;
			slider.dispatchEvent(new Event('input'));
		});
	};

	const collectCurrentSettings = (sliders, inputs) => {
		const sliderValues = sliders.map(({ id }) => ({
			id,
			value: document.querySelector(id).value
		}));

		const inputValues = inputs.map(({ name }) => {
			const inputElement = document.querySelector(`[name="${name}"]`);
			let value;

			if (inputElement.type === 'checkbox') {
				value = inputElement.checked;
			} else if (inputElement.type === 'radio') {
				const checkedRadio = document.querySelector(`[name="${name}"]:checked`);
				value = checkedRadio ? checkedRadio.value : null;
			} else if (inputElement.type === 'color') {
				return null;
			} else {
				value = inputElement.value;
			}

			return { id: `[name="${name}"]`, value };
		}).filter(item => item !== null);

		return [...sliderValues, ...inputValues];
	};

	loadSpecificSettings();

	globalUpdateButton.addEventListener('click', () => {
		const settings = collectCurrentSettings(sliders, inputs);
		localStorage.setItem('globalSettings', JSON.stringify(settings));
	});

	globalApplyButton.addEventListener('click', applyGlobalSettings);

	specificAddButton.addEventListener('click', () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const activeTab = tabs[0];
			const siteNameText = new URL(activeTab.url).hostname || activeTab.url;

			let specificSettings = JSON.parse(localStorage.getItem('specificSettings')) || [];

			const siteExists = specificSettings.some((setting) => setting.site === siteNameText);

			if (siteExists) return;

			const currentSettings = collectCurrentSettings(sliders, inputs);

			specificSettings.push({
				site: siteNameText,
				settings: currentSettings
			});

			localStorage.setItem('specificSettings', JSON.stringify(specificSettings));

			loadSpecificSettings();
		});
	});

	chrome.tabs.onActivated.addListener(() => {
		applySpecificSettings();
	});

	chrome.tabs.onUpdated.addListener(() => {
		applySpecificSettings();
	});
};
