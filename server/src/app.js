const express = require('express');
const cors = require('./middleware/cors');
const uploadRoutes = require('./routes/upload');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', uploadRoutes);

module.exports = app;
