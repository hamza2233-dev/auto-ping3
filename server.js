const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Tell Express to serve the index.html from the root folder
app.use(express.static(__dirname));

// 2. Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. The Proxy Route for Retreaver
app.get('/api/ping', async (req, res) => {
    const caller_number = req.query.caller_number;
    const API_KEY = "5de2b0c6-7b91-4bad-82c3-b3dab875ebd8";
    const PUB_ID = "ADO0048";
    
    const targetUrl = `https://rtb.retreaver.com/rtbs.json?key=${API_KEY}&publisher_id=${PUB_ID}&caller_number=${encodeURIComponent(caller_number)}`;

    try {
        const response = await fetch(targetUrl, {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Retreaver connection failed", details: error.message });
    }
});

// 4. Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
