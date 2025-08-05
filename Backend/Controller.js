require('dotenv').config();
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const mongoose = require('mongoose');

const app = express();
const PORT =3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/distributed-storage';

const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());

// --- Database Setup ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('Controller successfully connected to MongoDB.'))
    .catch(err => {
        console.error('Controller could not connect to MongoDB.', err);
        process.exit(1);
    });

const NodeSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    lastSeen: { type: Date, default: Date.now }
});
const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true, unique: true },
    location: { type: String, required: true }
});

const Node = mongoose.model('Node', NodeSchema);
const File = mongoose.model('File', FileSchema);

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

app.post('/files/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");

    try {
        // Get all registered nodes
        const nodes = await Node.find();
        if (nodes.length === 0) return res.status(503).send("No storage nodes available.");

        // Pick one random node
        const targetNode = nodes[Math.floor(Math.random() * nodes.length)];
        console.log(`Selected node: ${targetNode.address}`);

        // Send file to that node
        const formData = new FormData();
        formData.append('file', req.file.buffer, { filename: req.file.originalname });

        await axios.post(`http://${targetNode.address}/store-file`, formData, {
            headers: formData.getHeaders()
        });

        // Save file location info to DB
        await File.findOneAndUpdate(
            { filename: req.file.originalname },
            { location: targetNode.address },
            { upsert: true }
        );

        res.status(200).send("File uploaded and stored successfully.");

    } catch (err) {
        console.error("Upload failed:", err.message);
        res.status(500).send("Something went wrong during upload.");
    }
});

app.get('/files/download/:filename', async (req, res) => {
    try {
        const file = await File.findOne({filename: req.params.filename });
        if (!file) return res.status(404).send("File not found in system.");
        
        const response = await axios.get(`http://${file.location}/retrieve-file/${req.params.filename}`, { responseType: 'stream' });
        response.data.pipe(res);
    } catch (error) {
        console.error("Error during file download:", error.message);
        res.status(500).send("Failed to retrieve file from node.");
    }
});

app.listen(PORT, () => {
    console.log(`Controller application listening on port ${PORT}`);
});