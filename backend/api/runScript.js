const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

const SCRIPT_PATH = path.join(__dirname, 'scripts/script.py');

router.post('/runPython', (req, res) => {
    const values = req.body;

    if (!values || Object.keys(values).length === 0) {
        return res.status(400).json({ error: 'No values provided' });
    }

    const title = values.title;
    if (!title) {
        return res.status(400).json({ error: 'No title provided' });
    }

    const passvalue = Object.entries(values)   // Convert object to an array of key-value pairs
                             .filter(([key, value]) => key !== 'title') // Exclude title
                             .map(([key, value]) => value)  // Extract values
                             .join(' ');  // Join values with spaces

    const scriptProcess = spawn('python3', [SCRIPT_PATH, '--foo', ...passvalue.split(' '), '--title', title]);

    let scriptOutput = '';

    scriptProcess.stdout.on('data', (data) => {
        scriptOutput += data.toString();
    });

    scriptProcess.stdout.on('end', () => {
        console.log('Raw script output:', scriptOutput);

        // Split the output to separate JSON from debug information
        const jsonString = scriptOutput.split('\n').find(line => line.startsWith('{'));

        try {
            const jsonResponse = JSON.parse(jsonString);
            res.json(jsonResponse);
        } catch (e) {
            console.error('Error parsing JSON output:', e);
            res.status(500).json({ error: 'Error processing script output. Output was not valid JSON.' });
        }
    });

    scriptProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).json({ error: `Script error: ${data.toString()}` });
    });

    scriptProcess.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
});

module.exports = router;

