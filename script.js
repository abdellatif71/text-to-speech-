// Get the input field and button elements
const textInput = document.getElementById('text-input');
const speakButton = document.getElementById('speak-button');

// Get the available voices
let voices = [];

function loadVoices() {
    voices = speechSynthesis.getVoices();
    
    // If no voices are available immediately, wait for them to load
    if (voices.length === 0) {
        speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
        };
    }
}

loadVoices(); // Load voices on script start

speakButton.addEventListener('click', () => {
    // Get the text from the input field
    const text = textInput.value;

    // Check if the input is empty
    if (!text.trim()) {
        alert('Please enter some text!');
        return;
    }

    // The utterance is created here with the text
    const utterance = new SpeechSynthesisUtterance(text);

    // Choose the language (default is English)
    const isGerman = text.match(/[\u00C0-\u017F]/); // Check for German characters
    if (isGerman) {
        utterance.lang = 'de-DE';
    } else {
        utterance.lang = 'en-US';
    }

    // Select the voice based on the language
    const voice = voices.find(v => v.lang === utterance.lang);
    if (voice) {
        utterance.voice = voice;
    }

    // Optional: Set pitch and rate
    utterance.pitch = 1.2;  // Range: 0 to 2
    utterance.rate = 1.0;   // Range: 0.1 to 10

    // Speak the text
    speechSynthesis.speak(utterance);
});
