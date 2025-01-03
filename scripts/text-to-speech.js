import { executeScriptOnActiveTab } from './utils/executeScriptOnActiveTab.js';

export const initializeTextToSpeech = (buttonId, alertMessage) => {
	document.querySelector(buttonId).addEventListener('click', async () => {
		await executeScriptOnActiveTab(() => {
			const selectedText = window.getSelection().toString();
			selectedText ? speechSynthesis.speak(new SpeechSynthesisUtterance(selectedText)) : alert(alertMessage);
		});
	});
};
