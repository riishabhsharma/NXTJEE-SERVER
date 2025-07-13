// index.js
const express = require('express');
const bodyParser = require('body-parser');
const { processAnswerKey } = require('./parse');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index'); // Use EJS instead of Jinja
});

app.post('/', async (req, res) => {
    const { answerKeyLink, examDate, shift } = req.body;
    const result = await processAnswerKey(answerKeyLink, examDate, shift);
    res.render('result', { results: result });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
