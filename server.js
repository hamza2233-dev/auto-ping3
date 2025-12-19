const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/api/ping', async (req, res) => {
    const caller_number = req.query.caller_number;
    const API_KEY = "5de2b0c6-7b91-4bad-82c3-b3dab875ebd8";
    const PUB_ID = "ADO0048";
    
    // The exact URL structure you verified
    const targetUrl = `https://rtb.retreaver.com/rtbs.json?key=${API_KEY}&publisher_id=${PUB_ID}&caller_number=${encodeURIComponent(caller_number)}`;

    try {
        const response = await fetch(targetUrl, {
            headers: { 'Accept': 'application/json', 'User-Agent': 'RetreaverTester/1.0' }
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "Retreaver request failed", details: error.message });
    }
});

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
