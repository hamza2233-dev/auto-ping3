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
    
    // Credentials
    const KEY = "5de2b0c6-7b91-4bad-82c3-b3dab875ebd8";
    const PUB_ID = "ADO0048";
    
    // We construct the URL with both parameter styles just in case
    const targetUrl = `https://rtb.retreaver.com/rtbs.json?key=${KEY}&api_key=${KEY}&publisher_id=${PUB_ID}&caller_number=${encodeURIComponent(caller_number)}`;

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // This header makes Retreaver think the request is coming from a real browser
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Check if the response is actually JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            res.json(data);
        } else {
            // If Retreaver sends back HTML (a login page), we catch it here
            const text = await response.text();
            console.error("Non-JSON Response received:", text);
            res.status(401).json({ 
                error: "Retreaver blocked the request", 
                message: "The API is returning a login page instead of data. Check if your API Key is active in the Retreaver Campaign RTB settings." 
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Connection error", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
