const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/check", async (req, res) => {
  const caller = req.query.caller_number;

  if (!caller) {
    return res.send("caller_number is required");
  }

  const url =
    "https://rtb.retreaver.com/rtbs.json" +
    "?key=5de2b0c6-7b91-4bad-82c3-b3dab875ebd8" +
    "&publisher_id=ADO0048" +
    `&caller_number=${caller}`;

  try {
    const response = await fetch(url);
    const data = await response.text();
    res.send(data);
  } catch (err) {
    res.send("Error calling Retreaver API");
  }
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
