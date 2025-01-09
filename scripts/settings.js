import { createTooltip } from './utils/createTooltip.js';

export const initializeGlobalSettings = (sliders, globalUpdateButton, globalApplyButton, specificAddButton) => {
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

	specificAddButton.addEventListener('click', () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const activeTab = tabs[0];
			const siteNameText = new URL(activeTab.url).hostname || activeTab.url;

			const dropdownContent = document.querySelector('.dropdown-content--specific');
			const dropdownItem = document.createElement('div');
			dropdownItem.classList.add('dropdown-item');

			const siteName = document.createElement('p');
			siteName.textContent = siteNameText;
			dropdownItem.appendChild(siteName);

			const settingOptions = document.createElement('div');
			settingOptions.classList.add('setting-options');

			const removeTooltip = createTooltip('remove settings for this site', 'remove', siteNameText);
			settingOptions.appendChild(removeTooltip);

			const applyTooltip = createTooltip('use these site settings', 'apply', siteNameText);
			settingOptions.appendChild(applyTooltip);

			const updateTooltip = createTooltip('save current settings to site', 'update', siteNameText);
			updateTooltip.classList.add('tooltip--right');
			settingOptions.appendChild(updateTooltip);

			dropdownItem.appendChild(settingOptions);
			dropdownContent.appendChild(dropdownItem);
		});
	});
};
