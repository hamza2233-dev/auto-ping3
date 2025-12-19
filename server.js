const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Serve static files from the root
app.use(express.static(__dirname));

// 2. Main Page Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. Updated Proxy Route
app.get('/api/ping', async (req, res) => {
    const caller_number = req.query.caller_number;
    
    // Check these in your Retreaver Campaign Settings -> RTB tab
    const API_KEY = "5de2b0c6-7b91-4bad-82c3-b3dab875ebd8";
    const PUB_ID = "ADO0048";
    
    // Updated to use 'api_key' which is more common for authentication
    const targetUrl = `https://rtb.retreaver.com/rtbs.json?api_key=${API_KEY}&publisher_id=${PUB_ID}&caller_number=${encodeURIComponent(caller_number)}`;

    console.log(`Forwarding ping to: ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).json({ error: "Failed to reach Retreaver", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});
