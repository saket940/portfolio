const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    link: String
});
const Project = mongoose.model('Project', projectSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
});

// Dummy login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Dummy authentication logic
    if (username === 'a' && password === 'p') {
        res.json({
            success: true,
            message: 'Login successful',
            token: process.env.TOKEN
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// /project endpoint to return project data from DB
app.get('/project', async(req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new project
app.post('/project', async(req, res) => {

    if (req.headers.authorization !== process.env.TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a project by ID
app.put('/project/:id', async(req, res) => {
    if (req.headers.authorization !== process.env.TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a project by ID
app.delete('/project/:id', async(req, res) => {
    if (req.headers.authorization !== process.env.TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})