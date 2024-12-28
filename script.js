// Warten, bis die Stimmen verfügbar sind
let voices = [];

const textInput = document.getElementById('text-input');
const speakButton = document.getElementById('speak-button');

// Funktion, um Stimmen zu laden
function loadVoices() {
    voices = speechSynthesis.getVoices();
    
    if (voices.length === 0) {
        speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
        };
    }
}

// Stimmen beim Laden der Seite holen
loadVoices();

// Funktion zur Sprachsynthese
speakButton.addEventListener('click', () => {
    const text = textInput.value.trim();

    // Überprüfen, ob das Textfeld leer ist
    if (text === '') {
        alert('Bitte gib etwas Text ein!');
        return;
    }

    // Text in kleinere Abschnitte (Sätze) aufteilen
    const sentences = text.split(/[.!?]/); // Teilt den Text an Satzzeichen wie Punkt, Ausrufezeichen oder Fragezeichen

    // Funktion, um die Sätze nacheinander vorzulesen
    function speakSentence(index) {
        if (index >= sentences.length) return; // Abbrechen, wenn alle Sätze vorgelesen wurden

        const sentence = sentences[index].trim();
        if (sentence === '') return speakSentence(index + 1); // Leerzeichen überspringen

        const utterance = new SpeechSynthesisUtterance(sentence);

        // Stimme festlegen (deutsch oder englisch)
        utterance.voice = voices.find(voice => voice.lang === 'de-DE') || voices.find(voice => voice.lang === 'en-US');
        
        // Optional: Weitere Einstellungen für die Sprachausgabe (Tonhöhe, Geschwindigkeit)
        utterance.pitch = 1.2; // Tonhöhe
        utterance.rate = 1.0;  // Geschwindigkeit

        // Wenn der Satz gesprochen wurde, den nächsten Satz starten
        utterance.onend = () => speakSentence(index + 1);

        // Sprachausgabe starten
        speechSynthesis.speak(utterance);
    }

    // Den ersten Satz sprechen
    speakSentence(0);
});

// Stimmen neu laden, wenn sie geändert werden
speechSynthesis.onvoiceschanged = loadVoices;
