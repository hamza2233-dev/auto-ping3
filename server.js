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
    
    // FIXED URL: Added the '&' and used the verified RTB subdomain
    const targetUrl = `https://rtb.retreaver.com/rtbs.json?key=${API_KEY}&publisher_id=${PUB_ID}&caller_number=${encodeURIComponent(caller_number)}`;

    console.log(`Outgoing Ping: ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'RetreaverProxy/1.0' 
            }
        });

        const text = await response.text();
        
        try {
            const data = JSON.parse(text);
            res.json(data);
        } catch (e) {
            // If Retreaver sends HTML, this catches it and tells us why
            console.error("Retreaver returned non-JSON response.");
            res.status(response.status).json({ 
                error: "Retreaver Error", 
                status: response.status,
                details: text.substring(0, 200) // Show first bit of error
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Server connection failed", message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
