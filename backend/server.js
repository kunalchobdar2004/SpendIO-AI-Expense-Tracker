const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); 

// Database Connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'expense_tracker',
    password: 'YOUR_PASSWORD', // Aapka password
    port: 5432,
});

// Database Setup
const setupDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                profile_pic TEXT
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                amount NUMERIC NOT NULL,
                category VARCHAR(50) NOT NULL,
                description TEXT,
                date DATE NOT NULL
            )
        `);
        await pool.query(`ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id INTEGER`).catch(() => {});
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_pic TEXT`).catch(() => {});
        console.log("✅ Database tables ready and updated");
    } catch (err) {
        console.error("DB Setup Error:", err);
    }
};
setupDatabase();


// 🚨 API KEY & LATEST GEMINI 3.x MODELS AUTO-FALLBACK 🚨
const API_KEY = "YOUR_API_KEY"; 

async function callGeminiAPI(bodyData) {
    // Google ke sabse naye aur stable models ki list jo nayi keys par chalte hain
    const modelsToTry = [
        "gemini-3.6-flash", 
        "gemini-3.5-flash", 
        "gemini-1.5-flash",
        "gemini-1.5-pro"
    ];
    let lastError = null;

    for (const model of modelsToTry) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });
            
            const data = await response.json();
            
            if (response.ok && data.candidates && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                lastError = data;
                console.log(`⚠️ Model ${model} returned error, trying next...`);
            }
        } catch (err) {
            lastError = err;
        }
    }
    
    console.error("❌ Google API Final Error:", lastError);
    throw new Error("API Request Failed on all models");
}


// ==========================================
// 🔐 AUTHENTICATION & PROFILE ROUTES
// ==========================================
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, profile_pic as "profilePic"',
            [name, email, password]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: 'Email pehle se registered hai!' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT id, name, email, profile_pic as "profilePic" FROM users WHERE email = $1 AND password = $2', [email, password]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(401).json({ error: 'Galat Email ya Password!' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/user/:id/profile-pic', async (req, res) => {
    try {
        const { id } = req.params;
        const { profilePic } = req.body;
        await pool.query('UPDATE users SET profile_pic = $1 WHERE id = $2', [profilePic, id]);
        res.json({ message: "Profile picture updated!" });
    } catch (err) { res.status(500).json({ error: 'Server error during upload' }); }
});

// ==========================================
// 💰 EXPENSE ROUTES
// ==========================================
app.get('/api/expenses', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: "User ID required" });
        const result = await pool.query('SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC', [userId]);
        res.json(result.rows);
    } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/expenses', async (req, res) => {
    try {
        const { userId, amount, category, description, date } = req.body;
        await pool.query(
            'INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5)',
            [userId, amount, category, description, date]
        );
        res.json({ message: "Expense added!" });
    } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, category, description, date } = req.body;
        await pool.query('UPDATE expenses SET amount = $1, category = $2, description = $3, date = $4 WHERE id = $5', [amount, category, description, date, id]);
        res.json({ message: "Expense updated!" });
    } catch (err) { res.status(500).send('Server Error'); }
});

app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
        res.json({ message: "Expense deleted!" });
    } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// ✨ AI ROUTES (GEMINI 3.x FALLBACK)
// ==========================================
app.get('/api/insights/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query('SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC', [userId]);
        const expenses = result.rows;
        
        if (expenses.length === 0) return res.json({ summary: "No data available.", suggestions: ["Add some expenses to get smart insights!"] });
        
        const prompt = `Analyze this JSON expense data: ${JSON.stringify(expenses)}. Return strictly in JSON format matching exactly this structure: {"summary": "2 line summary", "suggestions": ["tip 1", "tip 2"]}. Do not include markdown formatting or backticks.`;
        
        const textResponse = await callGeminiAPI({
            contents: [{ parts: [{ text: prompt }] }]
        });

        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        res.json(JSON.parse(jsonStr));
    } catch (err) { 
        console.error("AI Insights Error:", err.message);
        res.status(500).json({ error: 'Insights failed' }); 
    }
});

app.post('/api/scan', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        const baseData = imageBase64.split(',')[1];
        
        const prompt = `Analyze this receipt image and extract details in strictly this JSON format: {"amount": "number", "category": "Food/Transport/Utilities/Shopping/Entertainment", "description": "text", "date": "YYYY-MM-DD"}. Only return JSON without markdown.`;

        const textResponse = await callGeminiAPI({
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: "image/jpeg", data: baseData } }
                ]
            }]
        });

        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        res.json(JSON.parse(jsonStr));
    } catch (err) { 
        console.error("AI Scan Error:", err.message);
        res.status(500).json({ error: 'Scan error' }); 
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { question, expenses } = req.body;
        const prompt = `You are a smart Financial Assistant. User's expense data in JSON: ${JSON.stringify(expenses)}. User's question: "${question}". Answer accurately, short (1-2 sentences), friendly, strictly to the point in Hinglish.`;

        const textResponse = await callGeminiAPI({
            contents: [{ parts: [{ text: prompt }] }]
        });

        res.json({ answer: textResponse });
    } catch (err) { 
        console.error("AI Chat Error:", err.message);
        res.status(500).json({ error: 'Chatbot error' }); 
    }
});

app.listen(5000, () => console.log('✅ Server running on port 5000 (GEMINI 3.x AUTO-FALLBACK ACTIVE)'));