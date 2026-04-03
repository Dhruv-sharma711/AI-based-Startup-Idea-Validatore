# 🚀 AI-Based Startup Idea Validator

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react)
![Gemini AI](https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Validate your startup idea in under 30 seconds using the power of AI.**
SWOT Analysis · Market Sizing · Competitor Research · Viability Score · PDF Export

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Docs](#-api-reference) · [Team](#-team)

</div>

---

## 📸 Preview

```
┌─────────────────────────────────────────────────┐
│  💡 Enter Your Startup Idea                      │
│  ┌───────────────────────────────────────────┐  │
│  │ "An app that connects local farmers       │  │
│  │  directly with urban consumers..."        │  │
│  └───────────────────────────────────────────┘  │
│                  [ Validate Idea → ]             │
└─────────────────────────────────────────────────┘
          ↓  AI processes in ~20 seconds
┌──────────────┬──────────────┬───────────────────┐
│  SWOT Chart  │ Market Size  │  Viability: 8/10  │
├──────────────┴──────────────┴───────────────────┤
│  Top 3 Competitors  │  📄 Download PDF Brief    │
└─────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🔍 AI-Powered Analysis
- **SWOT Analysis** — Auto-generated Strengths, Weaknesses, Opportunities & Threats
- **Market Size Estimation** — TAM · SAM · SOM breakdown for your idea's domain
- **Top 3 Competitors** — Real competitor identification with profiles & differentiators
- **Viability Score (1–10)** — Honest AI rating with detailed reasoning

### 📄 Business Brief PDF
- One-page, download-ready business brief generated per idea
- Shareable with mentors, investors, or teammates instantly

### 💾 Idea Dashboard
- Save unlimited ideas to your personal dashboard
- Compare multiple ideas side-by-side over time
- Full history with timestamps and scores

### ⚡ Instant & Accessible
- No credit card or lengthy signup required
- Results in under 30 seconds
- Fully mobile-responsive UI

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js + Tailwind CSS | UI & responsive design |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB + Mongoose | Idea storage & user data |
| **AI Engine** | Google Gemini API | SWOT, scoring, analysis |
| **PDF Export** | jsPDF / Puppeteer | Business brief generation |
| **Auth** | JWT + bcrypt | Secure user sessions |
| **Dev Tools** | Vite · Nodemon · dotenv | Development workflow |

---

## 📁 Project Structure

```
ai-startup-validator/
│
├── client/                        # ⚛️  React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── IdeaForm.jsx        # Main idea input form
│       │   ├── SwotCard.jsx        # SWOT analysis display
│       │   ├── CompetitorCard.jsx  # Competitor profiles
│       │   ├── ViabilityScore.jsx  # Score meter UI
│       │   └── PdfDownload.jsx     # PDF export button
│       ├── pages/
│       │   ├── Home.jsx            # Landing page
│       │   ├── Dashboard.jsx       # Saved ideas
│       │   ├── Result.jsx          # Analysis results
│       │   └── Login.jsx           # Auth page
│       ├── context/
│       │   └── AuthContext.jsx     # Global auth state
│       ├── utils/
│       │   └── api.js              # Axios API calls
│       └── App.jsx
│
├── server/                        # 🟢  Node/Express Backend
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── ideaController.js      # Idea CRUD logic
│   │   ├── authController.js      # Login/register logic
│   │   └── pdfController.js       # PDF generation
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── models/
│   │   ├── Idea.js                # Idea schema
│   │   └── User.js                # User schema
│   ├── routes/
│   │   ├── ideaRoutes.js          # /api/ideas
│   │   ├── authRoutes.js          # /api/auth
│   │   └── pdfRoutes.js           # /api/pdf
│   ├── services/
│   │   └── geminiService.js       # Gemini AI integration
│   └── server.js                  # App entry point
│
├── .env.example                   # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A [Google Gemini API Key](https://makersuite.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-startup-validator.git
cd ai-startup-validator
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/startup-validator
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/startup-validator

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run the App

```bash
# From the root — run both simultaneously
npm run dev
```

Or run separately:

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

### 5. Open in Browser

```
http://localhost:5173
```

---

## 🔌 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Create a new user account |
| `POST` | `/login` | Login and receive JWT token |

### Idea Routes — `/api/ideas` *(Protected)*

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/validate` | Submit idea → get full AI analysis |
| `GET` | `/` | Get all saved ideas for the user |
| `GET` | `/:id` | Get a specific idea by ID |
| `DELETE` | `/:id` | Delete a saved idea |

### PDF Route — `/api/pdf`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/generate` | Generate & return a PDF business brief |

---

### Sample Request — Validate an Idea

```js
POST /api/ideas/validate
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "idea": "A subscription box service for regional Indian snacks delivered monthly"
}
```

### Sample Response

```json
{
  "success": true,
  "data": {
    "idea": "A subscription box service for regional Indian snacks...",
    "viabilityScore": 8,
    "swot": {
      "strengths": ["Unique regional focus", "Growing D2C trend in India"],
      "weaknesses": ["Perishability of food items", "Logistics complexity"],
      "opportunities": ["₹2,000 Cr+ snack market", "NRI diaspora segment"],
      "threats": ["BigBasket, Snackible competition", "Supply chain disruption"]
    },
    "marketSize": {
      "tam": "₹2,100 Crore",
      "sam": "₹420 Crore",
      "som": "₹42 Crore (Year 1 target)"
    },
    "competitors": [
      { "name": "Snackible", "strength": "Wide SKU range", "weakness": "No regional focus" },
      { "name": "Munchbox", "strength": "Strong branding", "weakness": "Metro-only" },
      { "name": "TagZ Foods", "strength": "Healthy positioning", "weakness": "Limited variety" }
    ],
    "savedAt": "2025-04-03T10:30:00.000Z"
  }
}
```

---

## 🧪 Available Scripts

| Command | Location | Action |
|---|---|---|
| `npm run dev` | `/server` | Start backend with Nodemon |
| `npm run dev` | `/client` | Start React dev server (Vite) |
| `npm run build` | `/client` | Build for production |
| `npm test` | `/server` | Run backend tests |

---

## 🚧 Roadmap

- [x] Gemini AI integration for SWOT + scoring
- [x] PDF business brief generation
- [x] Save & compare ideas dashboard
- [ ] Email idea report to yourself
- [ ] Public idea sharing (shareable link)
- [ ] Team collaboration on a single idea
- [ ] Voice input for idea submission
- [ ] Hindi / regional language support

---

## 👥 Team

<div align="center">

| Name | Roll No | Contact |
|---|---|---|
| 👨‍💻 **Dhruv Sharma** | 2304921540054 | 📞 79069 40020 |
| 👨‍💻 **Sarthak Singh** | 2304921540146 | 📞 63945 76746 |
| 👨‍💻 **Vivansh Jaiswal** | 2304921540188 | 📞 99357 97288 |
| 👩‍💻 **Shrasti** | 2304921540155 | 📞 97209 38120 |

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ If this project helped you, give it a star on GitHub!**

Made with ❤️ by the team · Powered by MERN + Gemini AI

</div>
