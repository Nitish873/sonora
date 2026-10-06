const express = require('express');
const cors = require('cors');
const cookies = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const multer = require('multer');
const path = require('path');



const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookies());

app.use('/api/auth' , authRoutes);
app.use('/api/music' , musicRoutes);

app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({message : `Upload error: ${err.message}`});
    }
    next(err);
});

module.exports = app;
