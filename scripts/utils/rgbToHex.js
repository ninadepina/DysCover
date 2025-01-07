export const rgbToHex = (rgb) => {
	const hex = rgb
		.match(/\d+/g)
		?.map((num) => Number(num).toString(16).padStart(2, '0'))
		.join('');

	return hex ? `#${hex}` : null;
};
