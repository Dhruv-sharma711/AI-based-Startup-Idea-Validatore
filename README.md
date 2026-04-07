# 🚀 AI Startup Idea Validator

<div align="center">

![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/API-Express_5-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Validate your startup idea in under 30 seconds using the power of AI.**

*Market Potential · Competitor Snapshot · Risk Analysis · Viability Score · Business Model Hints*

</div>

---

## 📸 Preview

```
┌──────────────────────────────────────────────────────┐
│  💡 AI Startup Idea Validator                         │
│                                                        │
│  Idea Title: ________________________________          │
│  Description: ________________________________         │
│  Target Audience: ____________________________         │
│  Problem Statement: __________________________         │
│                                                        │
│              [ Validate Idea → ]                       │
└──────────────────────────────────────────────────────┘
                  ↓  AI analyzes in seconds
┌───────────────┬──────────────────┬───────────────────┐
│ Score: 82/100 │ Market: High     │ Risk: Low         │
├───────────────┴──────────────────┴───────────────────┤
│ Strengths · Weaknesses · Recommendations              │
│ Competitor Snapshot · Business Model Hints            │
└──────────────────────────────────────────────────────┘
```

---

## ✨ Features

- **AI-Powered Validation** — Submits your idea to Google Gemini and gets back a structured analysis instantly
- **Overall Score** — A 0–100 viability score with a plain-language verdict
- **Market & Uniqueness Rating** — Low / Moderate / High breakdown for both dimensions
- **Risk Assessment** — Identifies whether your idea carries Low, Medium, or High risk
- **Strengths & Weaknesses** — Bullet-point breakdown of what works and what doesn't
- **Recommendations** — Actionable next steps to improve your concept
- **Competitor Snapshot** — Quick view of the competitive landscape
- **Business Model Hints** — Monetization directions to explore
- **Idea Persistence** — Saves analyzed ideas to MongoDB (optional, gracefully degrades without it)
- **Fallback Mode** — Returns sensible default validation if the Gemini API key is missing or quota is exceeded

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Axios |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB, Mongoose 9 |
| **AI Engine** | Google Gemini API (auto-discovers best available model) |
| **Styling** | Plain CSS (custom, no framework dependency) |

---

## 📁 Project Structure

```
ai-startup-validator/
│
├── backend/
│   ├── models/
│   │   └── Idea.js              # Mongoose schema for saved ideas
│   ├── services/
│   │   └── validator.js         # Gemini API integration & prompt logic
│   ├── index.js                 # Express server & API routes
│   ├── package.json
│   └── .env                     # Environment variables (not committed)
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx              # Main UI — form + results display
│   │   ├── App.css              # Component styles
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) — local instance or a free [Atlas](https://www.mongodb.com/atlas) cluster *(optional — the app works without it)*
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) — free tier available

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-startup-validator.git
cd ai-startup-validator
```

### 2. Configure the Backend

```bash
cd backend
```

Create a `.env` file:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash        # optional — auto-discovers if omitted
MONGO_URI=mongodb://localhost:27017/startup-validator   # optional
```

Install dependencies and start:

```bash
npm install
npm start
```

### 3. Configure the Frontend

```bash
cd ../frontend
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Install dependencies and start:

```bash
npm install
npm run dev
```

### 4. Open in Browser

```
http://localhost:5173
```

---

## 🔌 API Reference

### `POST /api/ideas/validate`

Submits an idea for AI analysis.

**Request Body**

```json
{
  "title": "AI financial coach for students",
  "description": "A mobile app that tracks spending and teaches budgeting using AI nudges.",
  "targetAudience": "College students aged 18–24",
  "problemStatement": "Most students have no formal financial education and overspend."
}
```

**Response**

```json
{
  "message": "Idea analyzed successfully",
  "validation": {
    "overallScore": 78,
    "verdict": "Strong concept — validate demand before building",
    "marketPotential": "High",
    "uniqueness": "Moderate",
    "riskLevel": "Low",
    "strengths": ["Clear, relatable pain point", "Large addressable audience"],
    "weaknesses": ["Crowded fintech space", "Monetization path unclear"],
    "recommendations": ["Run 20 user interviews", "Build a waitlist landing page"],
    "competitorSnapshot": ["Mint", "YNAB", "Cleo — strong AI angle"],
    "businessModelHints": ["Freemium with premium coaching tier", "University partnership deals"]
  },
  "idea": { "_id": "...", "createdAt": "..." }
}
```

### `GET /api/ideas`

Returns the 20 most recently saved ideas (requires MongoDB connection).

---

## 🧠 How the AI Validation Works

1. The backend builds a structured prompt from your form inputs.
2. It queries the Gemini API, automatically trying a ranked list of models (`gemini-2.0-flash` first, then fallbacks).
3. The raw response is parsed for a JSON object matching the expected schema.
4. If the API key is missing or quota is exceeded, a sensible default validation is returned so the UI never breaks.
5. The result — along with the original idea — is optionally saved to MongoDB.

---

## 🚧 Roadmap

- [x] Gemini AI integration with automatic model discovery
- [x] Graceful fallback when API key / MongoDB is unavailable
- [ ] PDF business brief export
- [ ] Saved ideas dashboard
- [ ] Side-by-side idea comparison
- [ ] Shareable result links
- [ ] Email report delivery
- [ ] Hindi / regional language support

---

## 👥 Team

| Name | Roll No | Contact |
|---|---|---|
| 👨‍💻 **Dhruv Sharma** | 2304921540054 | 📞 79069 40020 |
| 👨‍💻 **Sarthak Singh** | 2304921540146 | 📞 63945 76746 |
| 👨‍💻 **Vivansh Jaiswal** | 2304921540188 | 📞 99357 97288 |
| 👨‍💻 **Gaurav Sahu** | 2304921540057 | 📞 91186 62611 |

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ · Powered by MERN + Google Gemini AI

**⭐ Star this repo if it helped you!**

</div>
