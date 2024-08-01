const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

app.post('/submit-score', (req, res) => {
    const { user_id, score } = req.body;
    client.query('INSERT INTO scores(user_id, score) VALUES($1, $2)', [user_id, score], (error, results) => {
        if (error) {
            res.status(500).send(error.toString());
        } else {
            res.status(200).send('Score saved');
        }
    });
});

app.get('/leaderboard', (req, res) => {
    client.query('SELECT * FROM scores ORDER BY score DESC LIMIT 10', (error, results) => {
        if (error) {
            res.status(500).send(error.toString());
        } else {
            res.status(200).json(results.rows);
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
