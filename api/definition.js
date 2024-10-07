/**
 * ChatGPT-3.5 (https://chatgpt.com/) was used to code solutions presented in this assignment.
 */

class Dictionary {
    constructor() {
        this.words = [];
        this.requestCount = 0;
    }

    addWord(word, definition) {
        const normalizedWord = word.toLowerCase();
        const exists = this.words.some(entry => entry.word.toLowerCase() === normalizedWord);
        
        if (exists) {
            return { error: true, message: `Word '${word}' already exists` };
        }
        
        this.words.push({ word, definition });
        return { error: false, message: `Word '${word}' added successfully` };
    }

    findWord(word) {
        return this.words.find(entry => entry.word.toLowerCase() === word.toLowerCase());
    }
}

// Single instance for the entire application
const dictionary = new Dictionary();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    dictionary.requestCount++;
    
    if (req.method === 'GET') {
        const word = req.query.word?.toLowerCase();
        const entry = dictionary.findWord(word);
        
        if (!entry) {
            return res.status(404).json({
                error: true,
                totalRequests: dictionary.requestCount,
                dictionary: dictionary.words
            });
        }
        
        return res.status(200).json({
            ...entry,
            totalRequests: dictionary.requestCount,
            dictionary: dictionary.words
        });
    }
    
    if (req.method === 'POST') {
        const { word, definition } = req.body;
        const result = dictionary.addWord(word, definition);
        
        if (result.error) {
            return res.status(409).json({
                error: true,
                message: result.message,
                totalRequests: dictionary.requestCount,
                dictionary: dictionary.words
            });
        }
        
        return res.status(201).json({
            message: result.message,
            totalRequests: dictionary.requestCount,
            dictionary: dictionary.words
        });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}