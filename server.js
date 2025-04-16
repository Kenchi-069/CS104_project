
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/match', (req, res) => {
    const match = req.body;
    const filename = `match-${match.id}.json`;
    const filepath = path.join(__dirname, 'data', filename);

    fs.writeFile(filepath, JSON.stringify(match, null, 2), (err) => {
        if (err) {
            console.error("Error saving match:", err);
            return res.status(500).json({ success: false, message: 'Failed to save match' });
        }
        res.json({ success: true, message: 'Match saved' });
    });
});


app.get('/api/matches', (req, res) => {
    const dir = path.join(__dirname, 'data');
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error("Error reading match directory:", err);
            return res.status(500).json({ success: false, message: 'Failed to load matches' });
        }

        const matches = [];
        files.forEach((file) => {
            if (file.startsWith("match-") && file.endsWith(".json")) {
                try {
                    const content = fs.readFileSync(path.join(dir, file), 'utf8');
                    matches.push(JSON.parse(content));
                } catch (e) {
                    console.error(`Error reading file ${file}:`, e);
                }
            }
        });

        // Sort by most recent first
        matches.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json({ success: true, matches });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
