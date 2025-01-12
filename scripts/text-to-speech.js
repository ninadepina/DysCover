import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeTextToSpeech = (textToSpeechButton) => {
	const { id, alert: alertMsg } = textToSpeechButton;
	document.querySelector(id).addEventListener('click', async () => {
		await executeScriptOnActiveTab(() => {
			const selectedText = window.getSelection().toString();
			// prettier-ignore
			selectedText
				? speechSynthesis.speak(new SpeechSynthesisUtterance(selectedText))
				: alert(alertMsg);
		});
	});
};
