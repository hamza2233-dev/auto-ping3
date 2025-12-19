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
    
    // NEW ENDPOINT: This is the verified path for RTB pings
    const targetUrl = `https://retreaver.com/rtb/pings.json?api_key=${API_KEY}&publisher_id=${PUB_ID}&caller_number=${encodeURIComponent(caller_number)}`;

    console.log("Sending Ping to Retreaver:", targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'RetreaverTester/1.0'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        // If it's a 404, we catch the text to see the real error
        console.error("Fetch Error:", error.message);
        res.status(500).json({ 
            error: "Retreaver endpoint not found", 
            advice: "Please verify your Campaign has 'RTB' enabled in the settings." 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
