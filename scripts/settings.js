import { createTooltip } from './utils/createTooltip.js';

export const initializeGlobalSettings = (sliders, globalUpdateButton, globalApplyButton, specificAddButton) => {
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

			// Remove button
			const removeTooltip = createTooltip('remove settings for this site', 'remove', site);
			removeTooltip.addEventListener('click', () => {
				specificSettings.splice(index, 1);
				localStorage.setItem('specificSettings', JSON.stringify(specificSettings));
				loadSpecificSettings();
			});
			settingOptions.appendChild(removeTooltip);

			// Apply button
			const applyTooltip = createTooltip('use these site settings', 'apply', site);
			applyTooltip.addEventListener('click', () => {
				settings.forEach(({ id, value }) => {
					const slider = document.querySelector(id);
					slider.value = value;
					slider.dispatchEvent(new Event('input'));
				});
			});
			settingOptions.appendChild(applyTooltip);

			// Update button
			const updateTooltip = createTooltip('save current settings to site', 'update', site);
			updateTooltip.classList.add('tooltip--right');
			updateTooltip.addEventListener('click', () => {
				const updatedSettings = sliders.map(({ id }) => ({
					id,
					value: document.querySelector(id).value
				}));
				specificSettings[index].settings = updatedSettings;
				localStorage.setItem('specificSettings', JSON.stringify(specificSettings));
				alert(`Settings for "${site}" updated!`);
			});
			settingOptions.appendChild(updateTooltip);

			dropdownItem.appendChild(settingOptions);
			dropdownContent.appendChild(dropdownItem);
		});
	};

	loadSpecificSettings();

	globalUpdateButton.addEventListener('click', () => {
		const settings = sliders.map(({ id }) => ({ id, value: document.querySelector(id).value }));
		localStorage.setItem('globalSettings', JSON.stringify(settings));
		alert('Global settings saved!');
	});

	globalApplyButton.addEventListener('click', () => {
		const settings = JSON.parse(localStorage.getItem('globalSettings'));
		if (!settings) {
			alert('No global settings found!');
			return;
		}

		settings.forEach(({ id, value }) => {
			const slider = document.querySelector(id);
			slider.value = value;
			slider.dispatchEvent(new Event('input'));
		});
		alert('Global settings applied!');
	});

	// Add Specific Settings Button functionality
	specificAddButton.addEventListener('click', () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const activeTab = tabs[0];
			const siteNameText = new URL(activeTab.url).hostname || activeTab.url;

			let specificSettings = JSON.parse(localStorage.getItem('specificSettings')) || [];

			const siteExists = specificSettings.some((setting) => setting.site === siteNameText);

			if (siteExists) {
				alert(`Settings for "${siteNameText}" already exist!`);
				return;
			}

			const slidersData = sliders.map(({ id }) => ({
				id,
				value: document.querySelector(id).value
			}));

			specificSettings.push({
				site: siteNameText,
				settings: slidersData
			});

			localStorage.setItem('specificSettings', JSON.stringify(specificSettings));

			loadSpecificSettings();
		});
	});
};
