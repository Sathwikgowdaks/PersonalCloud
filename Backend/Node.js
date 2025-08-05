require('dotenv').config();
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const CONTROLLER_URL = process.env.CONTROLLER_URL;
const MY_ADDRESS = process.env.MY_ADDRESS;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });
app.use(express.json());

const storageDir = path.join(__dirname, 'storage');
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir);

app.post('/store-file', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send("No file received.");
    const filePath = path.join(storageDir, req.file.originalname);
    fs.writeFileSync(filePath, req.file.buffer);
    console.log(`Stored file: ${req.file.originalname}`);
    res.status(200).send("File stored.");
});

app.get('/retrieve-file/:filename', (req, res) => {
    const filePath = path.join(storageDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send("File not found on this node.");
    }
});

async function registerWithController() {
    if (!CONTROLLER_URL || !MY_ADDRESS) {
        console.error("Missing CONTROLLER_URL or MY_ADDRESS. Cannot register.");
        return;
    }
    try {
        await axios.post(`${CONTROLLER_URL}/nodes/register`, { address: MY_ADDRESS + `:${PORT}` });
        console.log("Successfully sent registration/heartbeat to controller.");
    } catch (error) {
        console.error("Could not contact controller. Retrying...");
    }
}

registerWithController();
setInterval(registerWithController, 30000);

app.listen(PORT, MY_ADDRESS, () => {
    console.log(`Node application listening on http://${MY_ADDRESS}:${PORT}`);
});