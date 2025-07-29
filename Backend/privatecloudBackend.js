require('dotenv').config();
const cors = require('cors');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Define schema and model for storage providers
const storageProviderSchema = new mongoose.Schema({
    accessKey: { type: String, unique: true, required: true },
    userId: { type: String },
});

const StorageProvider = mongoose.model('Provider', storageProviderSchema);

// Create storage provider (generate access key and folder)
app.get('/storage/create', async (req, res) => {

    const accessKey = crypto.randomBytes(6).toString('hex');

    try {
        const baseFolder = process.env.BASE_FOLDER;

        console.log('Checking folder path:', baseFolder);
        if (!fs.existsSync(baseFolder)) {
            console.log('Folder does not exist, creating folder:', baseFolder);
            fs.mkdirSync(baseFolder, { recursive: true });
            console.log('Folder created successfully:', baseFolder);
        } else {
            console.log('Folder already exists:', baseFolder);
        }

        const newProvider = new StorageProvider({ accessKey });
        await newProvider.save();
        res.json({ accessKey });
    } catch (err) {
        console.error('Error saving storage provider:', err);
        res.status(500).json({ error: 'Failed to create storage provider' });
    }
});


app.post('/upload/:accessKey', upload.single('file'), async (req, res) => {
    const { accessKey } = req.params;
    const { userId } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const provider = await StorageProvider.findOne({ accessKey });

        if (!provider) {
            return res.status(404).json({ error: 'Storage provider not found' });
        }

        let finalUserId;

        if (provider.userId) {
            finalUserId = provider.userId;
        } else if (userId) {
            provider.userId = userId;
            await provider.save();
            finalUserId = userId;
        } else {
            return res.status(400).json({ error: 'userId not found in DB. Please provide userId to link with accessKey.' });
        }

        const baseFolder = process.env.BASE_FOLDER;
        const folderPath = path.join(baseFolder, finalUserId);

        fs.mkdirSync(folderPath, { recursive: true });

        const filePath = path.join(folderPath, file.originalname);
        fs.writeFileSync(filePath, file.buffer);

        res.json({ message: 'File uploaded successfully', filePath });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

app.get('/download/:userId/:filename', async (req, res) => {
    const { userId, filename } = req.params;

    try {
        const baseFolder = process.env.BASE_FOLDER;
        const folderPath = path.join(baseFolder, userId);
        const filePath = path.join(folderPath, filename);

        console.log('Looking for file at:', filePath);

        if (!fs.existsSync(folderPath)) {
            return res.status(404).json({ error: 'User folder not found' });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.download(filePath);
    } catch (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});