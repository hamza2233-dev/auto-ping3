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
    
    // Using the RTB subdomain with the essential publisher_id
    const targetUrl = `https://rtb.retreaver.com/rtbs.json?publisher_id=${PUB_ID}&caller_number=${encodeURIComponent(caller_number)}`;

    try {
        const response = await fetch(targetUrl, {
            method: 'GET', // Some setups require POST, but RTB is usually GET
            headers: {
                'Accept': 'application/json',
                // This header is the secret to bypassing the "Sign In" redirect
                'X-Retreaver-Api-Key': KEY,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const text = await response.text();
        
        try {
            const data = JSON.parse(text);
            res.json(data);
        } catch (e) {
            // If it's still HTML (the login page), we will send the text back to see it
            res.status(401).json({ 
                error: "Authentication Error", 
                message: "Retreaver is still requesting a login. Check your Postback Key.",
                preview: text.substring(0, 100) 
            });
        }
    } catch (error) {
        res.status(500).json({ error: "System Error", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
