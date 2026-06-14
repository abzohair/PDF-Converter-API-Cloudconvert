require("dotenv").config();
const express = require('express');
const cors = require('cors');

const fileRouter = require('./routes/fileConveft');

const app = express();

// app.get('/health', (req, res) => { res.status(200).send({ message: 'OK !' }) }); // route for uptimerobot

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
}));

app.use('/api/files', fileRouter);
app.use((err, req, res, next) => {
    console.error("Erreur globale:", err.stack);

    const status = err.status || 500;

    res.status(status).json({
        message: err.message || "Erreur serveur"
    });
});

module.exports = app;