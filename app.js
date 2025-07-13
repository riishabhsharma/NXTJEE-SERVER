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

  try {
    const result = await processAnswerKey(answerKeyLink, examDate, shift);

    // If result is empty, show error
    if (!result || Object.keys(result).length === 0) {
      return res.status(400).render('error', {
        message: "❌ Invalid answer key link or no data found for selected date/shift. Please double-check your submission."
      });
    }

    // Success: render result page
    res.render('result', { results: result });

  } catch (error) {
    console.error("Processing failed:", error.message);
    res.status(500).render('error', {
      message: "⚠️ Something went wrong while processing your answer key. Please try again later."
    });
  }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// 404 fallback
app.use((req, res) => {
  res.status(404).render('error', {
    message: "404 - Page Not Found. The page you are looking for doesn't exist."
  });
});
