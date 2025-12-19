app.get('/api/ping', async (req, res) => {
    const caller_number = req.query.caller_number;
    
    // Check if these are 100% correct in your Retreaver Dashboard
    const API_KEY = "5de2b0c6-7b91-4bad-82c3-b3dab875ebd8";
    const PUB_ID = "ADO0048";
    
    const targetUrl = `https://rtb.retreaver.com/rtbs.json?key=${API_KEY}&publisher_id=${PUB_ID}&caller_number=${encodeURIComponent(caller_number)}`;

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'RetreaverTester/1.0' // Adding a User-Agent can help bypass "Sign In" blocks
            }
        });

        // If Retreaver sends a non-JSON error, we want to see it
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            res.json(data);
        } catch (e) {
            res.status(response.status).send(`Server Error: ${text}`);
        }
    } catch (error) {
        res.status(500).json({ error: "Connection Failed", details: error.message });
    }
});
