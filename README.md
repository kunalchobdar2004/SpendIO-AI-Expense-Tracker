# 🚀 SpendIO 2.0 - AI-Powered Expense Tracker

SpendIO is a next-generation, full-stack personal finance application. It moves beyond traditional manual data entry by leveraging **Generative AI (Google Gemini)** to read physical receipts, analyze spending habits, and act as a conversational financial advisor. Wrapped in a stunning, fully responsive Dark Glassmorphism UI.

## ✨ Key Features

- **📸 AI Vision Scanner:** Upload a picture of any receipt or bill. The system uses Gemini Vision to automatically extract the amount and categorize the expense. No manual typing required.
- **💬 Conversational AI Chatbot:** Chat directly with your database! Ask questions in plain English like *"How much did I spend on food this month?"* and get instant, context-aware answers.
- **🔮 AI Spending Forecast:** Analyzes current spending velocity to predict end-of-month totals and alerts you if you are trending over budget.
- **🎙️ Voice-to-Expense:** Speak out your expense (e.g., "Spent 500 on Uber") and let the AI convert your speech into a structured database entry.
- **📊 Visual Analytics:** Interactive, real-time charts built with Recharts to visualize cash flow and category breakdowns.
- **📥 CSV Export & Secure Storage:** Export data with one click. Every transaction is securely synced to a cloud PostgreSQL database.

---

## 🛠️ Technology Stack

**Frontend (Client-Side):**
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS (Custom Dark Theme & Glassmorphism)
- **Routing:** React Router DOM
- **Data Visualization:** Recharts

**Backend (Server-Side):**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon Serverless DB)
- **Database Driver:** `pg` (Node Postgres)
- **CORS & Middleware:** `cors`, `express.json`

**Artificial Intelligence:**
- **LLM Engine:** Google Gemini API (`gemini-1.5-flash`)
- **Use cases:** Document extraction (Image-to-Text), Data Analysis, Natural Language Processing (Chat).

---

## ⚙️ How to Start the Website Locally

Follow these exact steps to set up and run SpendIO on your local machine.

### 1. Prerequisites & API Keys
Before starting, ensure you have Node.js installed. You will also need:
1. **Google Gemini API Key:** Get it for free from [Google AI Studio](https://aistudio.google.com/).
2. **PostgreSQL Database:** Create a free database cluster on [Neon.tech](https://neon.tech/) and copy the connection string.

### 2. Clone the Repository
Open your terminal and run:
```bash
git clone [https://github.com/kunalchobdar2004/SpendIO-AI-Expense-Tracker.git](https://github.com/kunalchobdar2004/SpendIO-AI-Expense-Tracker.git)
cd SpendIO-AI-Expense-Tracker
```
3. Start the Backend Server
Open your terminal and navigate to the backend folder:

Bash
cd backend
npm install
Create a .env file inside the backend directory and add your credentials:

Code snippet
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
Run the Node.js server:

Bash
node server.js
(The server will start on http://localhost:5000 and automatically create the required SQL tables in your database).

4. Start the Frontend Application
Open a new terminal window/tab, and navigate to the frontend folder:

Bash
cd frontend
npm install
Start the Vite development server:

Bash
npm run dev
(The frontend will now be accessible at http://localhost:5173. Open this URL in your browser to view the application).
