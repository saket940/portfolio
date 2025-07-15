const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback: send index.html for any unmatched route (for React Router)
app.get('/:a', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});