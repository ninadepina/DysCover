export const rgbToHex = (rgb) => {
	const result = rgb
		.match(/\d+/g)
		.map((num) => parseInt(num).toString(16).padStart(2, '0'))
		.join('');
	return `#${result}`;
};
