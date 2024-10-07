/**
 * ChatGPT-3.5 (https://chatgpt.com/) was used to code solutions presented in this assignment.
 */

const dictionary = [];
let requestCount = 0;

module.exports = (req, res) => {
    const { method, query } = req;
    const { word } = query;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'GET') {
        requestCount++;
        const entry = dictionary.find(item => item.word === word);
        if (entry) {
            res.status(200).json({
                message: `Word found: ${word}`,
                definition: entry.definition,
                totalRequests: requestCount,
                dictionary,
            });
        } else {
            res.status(404).json({
                message: `Word '${word}' not found!`,
                totalRequests: requestCount,
            });
        }
    } else if (method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const { word, definition } = JSON.parse(body);
            const entryExists = dictionary.some(item => item.word === word);
            requestCount++;
            if (entryExists) {
                res.status(409).json({
                    message: `Word '${word}' already exists!`,
                    totalRequests: requestCount,
                    dictionary,
                });
            } else {
                dictionary.push({ word, definition });
                res.status(201).json({
                    message: `New word '${word}' added successfully.`,
                    totalRequests: requestCount,
                    dictionary,
                });
            }
        });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
