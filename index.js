const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const cors = require('cors');

const app = express();
const port = 3000;

// Google Cloud Text-to-Speech-Client initialisieren
const client = new TextToSpeechClient();

// Middleware: CORS aktivieren
app.use(cors());

// Middleware: Content-Security-Policy setzen
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; img-src 'self' http://localhost:3000; script-src 'self'; style-src 'self';"
    );
    next();
});

// Middleware: Statische Dateien bereitstellen
app.use(express.static('public'));

// Middleware: Body-Parser für JSON-Anfragen
app.use(bodyParser.json());

// Route: Text-to-Speech-API
app.post('/synthesize', async (req, res) => {
    try {
        const { text, languageCode = 'de-DE', voiceName = 'de-DE-Wavenet-A' } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required.' });
        }

        // Konfiguration für Text-to-Speech
        const request = {
            input: { text },
            voice: { languageCode, name: voiceName },
            audioConfig: { audioEncoding: 'MP3' },
        };

        // Text-to-Speech generieren
        const [response] = await client.synthesizeSpeech(request);

        // Audio in eine Datei speichern
        const fileName = path.join(__dirname, 'public', 'output.mp3');
        fs.writeFileSync(fileName, response.audioContent, 'binary');
        console.log(`Audio file written to ${fileName}`);

        res.json({ fileName: 'output.mp3' });
    } catch (error) {
        console.error('Error synthesizing speech:', error);
        res.status(500).json({ error: 'Failed to synthesize speech.' });
    }
});

// Server starten
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
