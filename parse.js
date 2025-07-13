// parse.js
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function processAnswerKey(link, date, shift) {
    try {
        const response = await axios.get(link);
        const $ = cheerio.load(response.data);

        let extractedData = {};

        $('.question-pnl').each((i, panel) => {
            const questionID = $(panel).find('td:contains("Question ID :")').next().text().trim();
            const chosenOption = $(panel).find('td:contains("Chosen Option :")').next().text().trim();
            const givenAnswer = $(panel).find('td:contains("Given Answer :")').next().text().trim();

            if (chosenOption && chosenOption !== '--') {
                const answerID = $(panel).find(`td:contains("Option ${chosenOption} ID :")`).next().text().trim();
                extractedData[questionID] = answerID;
            } else if (givenAnswer && givenAnswer !== '--') {
                extractedData[questionID] = givenAnswer;
            }
        });

        const answerKey = JSON.parse(fs.readFileSync('answerkey.json'));
        const shiftKey = answerKey[date + shift];
        const { physics, chemistry, math } = shiftKey;

        let result = evaluate(physics, chemistry, math, extractedData);

        return {
            exam_date: date,
            exam_shift: shift,
            ...result
        };

    } catch (error) {
        console.error("Error processing answer key:", error);
        return {};
    }
}

function evaluate(physicsKey, chemistryKey, mathKey, extractedData) {
    let totalScore = 0, totalPositive = 0, totalNegative = 0, totalAttempt = 0, correctAttempt = 0, incorrect = 0;

    function evaluateSection(sectionKey) {
        let score = 0, pos = 0, neg = 0, attempts = 0;
        for (const key in sectionKey) {
            if (sectionKey[key] === "Drop") {
                score += 4;
                continue;
            }
            if (!(key in extractedData)) continue;

            const userAns = extractedData[key];
            if (userAns === sectionKey[key]) {
                score += 4;
                pos += 4;
                attempts++;
                correctAttempt++;
            } else {
                score -= 1;
                neg -= 1;
                attempts++;
                incorrect++;
            }
        }
        totalScore += score;
        totalPositive += pos;
        totalNegative += neg;
        totalAttempt += attempts;
        return { score, pos };
    }

    const physics = evaluateSection(physicsKey);
    const chemistry = evaluateSection(chemistryKey);
    const maths = evaluateSection(mathKey);

    return {
        total_score: totalScore,
        total_positive: totalPositive,
        total_negative: totalNegative,
        p_score: physics.score,
        p_positive: physics.pos,
        c_score: chemistry.score,
        c_positive: chemistry.pos,
        m_score: maths.score,
        m_positive: maths.pos,
        total_attempt: totalAttempt,
        unattempt: 75 - totalAttempt,
        correct_attempt: correctAttempt,
        incorrect_attempt: incorrect,
        acuracy: parseFloat(((correctAttempt / totalAttempt) * 100).toFixed(2))
    };
}

module.exports = { processAnswerKey };