const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// --- Basic Setup ---
const app = express();
const port = 3000;
const upload = multer({ storage: multer.memoryStorage() });

// --- Environment Configuration ---
const ROLE = process.env.MY_ROLE
const CONTROLLER_URL = process.env.CONTROLLER_URL;
const MY_ADDRESS = process.env.MY_ADDRESS;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

// --- Database Models (initialized if running as Controller) ---
let Node, File;

async function connectToDb() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB.');

        const NodeSchema = new mongoose.Schema({
            address: { type: String, required: true, unique: true },
            lastSeen: { type: Date, default: Date.now }
        });
        const FileSchema = new mongoose.Schema({
            filename: { type: String, required: true, unique: true },
            location: { type: String, required: true }
        });

        Node = mongoose.model('Node', NodeSchema);
        File = mongoose.model('File', FileSchema);

    } catch (err) {
        console.error('Could not connect to MongoDB.', err);
        process.exit(1);
    }
}
if (ROLE === 'CONTROLLER') {
    connectToDb();

    // Endpoint for nodes to register themselves
    app.post('/nodes/register', async (req, res) => {
        const { address } = req.body;
        if (!address) return res.status(400).send("Node address is required.");
        
        try {
            await Node.findOneAndUpdate({ address }, { lastSeen: Date.now() }, { upsert: true, new: true });
            console.log(`Node registered/updated: ${address}`);
            res.status(200).json({ message: "Registration successful" });
        } catch (error) {
            res.status(500).send("Error registering node.");
        }
    });

    // Endpoint for clients to upload files
    app.post('/files/upload', upload.single('file'), async (req, res) => {
        if (!req.file) return res.status(400).send("No file uploaded.");

        try {
            const availableNodes = await Node.find();
            if (availableNodes.length === 0) return res.status(500).send("No available storage nodes.");
            
            const targetNode = availableNodes[Math.floor(Math.random() * availableNodes.length)];
            const targetNodeAddress = targetNode.address;
            
            const formData = new FormData();
            formData.append('file', req.file.buffer, { filename: req.file.originalname });

            await axios.post(`${targetNodeAddress}/store-file`, formData, { headers: formData.getHeaders() });
            
            await File.findOneAndUpdate(
                { filename: req.file.originalname },
                { location: targetNodeAddress },
                { upsert: true, new: true }
            );

            console.log(`File '${req.file.originalname}' stored on node ${targetNodeAddress}`);
            res.status(200).send(`File uploaded and stored on ${targetNodeAddress}.`);
        } catch (error) {
            console.error("Error during file upload:", error.message);
            res.status(500).send("Failed to store file.");
        }
    });

    // Endpoint for clients to download files
    app.get('/files/download/:filename', async (req, res) => {
        try {
            const file = await File.findOne({ filename: req.params.filename });
            if (!file) return res.status(404).send("File not found in system.");
            
            const response = await axios.get(`${file.location}/retrieve-file/${req.params.filename}`, {
                responseType: 'stream'
            });
            response.data.pipe(res);
        } catch (error) {
            console.error("Error during file download:", error.message);
            res.status(500).send("Failed to retrieve file.");
        }
    });

// =================================================================
// --- NODE LOGIC ---
// =================================================================
} else {
    const storageDir = path.join(__dirname, 'storage');
    if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir);

    // Endpoint for the controller to send files for storage
    app.post('/store-file', upload.single('file'), (req, res) => {
        if (!req.file) return res.status(400).send("No file received.");
        const filePath = path.join(storageDir, req.file.originalname);
        fs.writeFileSync(filePath, req.file.buffer);
        console.log(`Stored file: ${req.file.originalname}`);
        res.status(200).send("File stored.");
    });

    // Endpoint for the controller to retrieve stored files
    app.get('/retrieve-file/:filename', (req, res) => {
        const filePath = path.join(storageDir, req.params.filename);
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).send("File not found on this node.");
        }
    });

    // --- Node Registration & Heartbeat Logic ---
    async function registerWithController() {
        if (!CONTROLLER_URL || !MY_ADDRESS) {
            console.error("Missing CONTROLLER_URL or MY_ADDRESS. Cannot register.");
            return;
        }
        try {
            await axios.post(`${CONTROLLER_URL}/nodes/register`, { address: MY_ADDRESS });
            console.log("Successfully sent registration/heartbeat to controller.");
        } catch (error) {
            console.error("Could not contact controller. Retrying...");
        }
    }
    
    // Register immediately on startup, then send a heartbeat every 30 seconds
    registerWithController();
    setInterval(registerWithController, 30000); 
}

// --- Start Server ---
app.listen(port, () => {
    console.log(`Application (${ROLE}) listening at http://localhost:${port}`);
});