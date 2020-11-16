const express = require('express');
const app = express();

const db = require('../database/dbConnect');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//middleware
const requestTimeOff = require ('./requestTimeOff');

app.use('/requestTimeOff', requestTimeOff);

//404 handler
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;