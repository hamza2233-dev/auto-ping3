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
    
    // Your verified credentials
    const KEY = "5de2b0c6-7b91-4bad-82c3-b3dab875ebd8";
    const PUB_ID = "ADO0048";
    
    // We use the RTBS endpoint which looks for matches across your account
    const targetUrl = `https://rtb.retreaver.com/rtbs.json?publisher_id=${PUB_ID}&caller_number=${encodeURIComponent(caller_number)}`;

    console.log("Pinging Retreaver...");

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Retreaver-Api-Key': KEY, // Sending the key in the header to avoid 404/401
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const text = await response.text();
        
        try {
            const data = JSON.parse(text);
            res.json(data);
        } catch (e) {
            // If it's still not JSON, it might be a 404 error page from Retreaver
            res.status(response.status).json({ 
                error: "Retreaver returned an error", 
                status: response.status,
                message: "This usually means the Publisher ID or Campaign settings need adjustment."
            });
        }
    } catch (error) {
        res.status(500).json({ error: "System Error", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
