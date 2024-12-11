const sliders = document.querySelectorAll('input[type="range"]');

sliders.forEach((slider) => {
	const valueDisplay = slider.nextElementSibling.querySelector('span');
	valueDisplay.textContent = slider.value;

	slider.addEventListener('input', () => {
		valueDisplay.textContent = slider.value;
	});
});
