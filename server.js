const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/ping', async (req, res) => {
    const caller_number = req.query.caller_number;
    
    // IMPORTANT: Ensure this is the "Postback Key" from your Campaign RTB settings
    const KEY = "5de2b0c6-7b91-4bad-82c3-b3dab875ebd8";
    const PUB_ID = "ADO0048";
    
    // Some Retreaver versions require the key to be named 'api_key' 
    // AND pings to go to retreaver.com/rtb instead of rtb.retreaver.com
    const targetUrl = `https://retreaver.com/rtb/pings.json?api_key=${KEY}&publisher_id=${PUB_ID}&caller_number=${encodeURIComponent(caller_number)}`;

    console.log("Full Request URL:", targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const text = await response.text();
        
        try {
            // Try to parse as JSON
            const data = JSON.parse(text);
            res.json(data);
        } catch (e) {
            // If it's still returning the "Sign In" HTML, show a snippet
            res.status(401).json({ 
                error: "Retreaver blocked the request", 
                message: "The server returned HTML instead of JSON. This usually means the API Key is invalid or the Campaign is paused.",
                server_response_preview: text.substring(0, 150)
            });
        }
    } catch (error) {
        res.status(500).json({ error: "System Error", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
