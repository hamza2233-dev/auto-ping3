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
    const API_KEY = "5de2b0c6-7b91-4bad-82c3-b3dab875ebd8";
    const PUB_ID = "ADO0048";
    
    // We'll try the standard RTB URL
    const targetUrl = `https://rtb.retreaver.com/rtbs.json?publisher_id=${PUB_ID}&caller_number=${encodeURIComponent(caller_number)}`;

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // This header tells Retreaver exactly who is calling, 
                // often bypassing the "Login" redirect.
                'X-Retreaver-Api-Key': API_KEY, 
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const text = await response.text();
        
        try {
            const data = JSON.parse(text);
            res.json(data);
        } catch (e) {
            // If it's still HTML, we show the first bit of it to see what's wrong
            res.status(401).json({ 
                error: "Authentication Failed", 
                message: "Retreaver returned a login page. Please verify your Key is correct in the Campaign RTB settings.",
                preview: text.substring(0, 100) 
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Connection error", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
