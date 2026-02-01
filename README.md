# 🧠 APEX-7

<div align="center">

![APEX-7](https://img.shields.io/badge/APEX--7-Neural_AI-6366f1?style=for-the-badge&logo=target&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2340?style=for-the-badge&logo=razorpay&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r182-000000?style=for-the-badge&logo=three.js&logoColor=white)
![OGL](https://img.shields.io/badge/OGL-WebGL-FF6B6B?style=for-the-badge&logo=webgl&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-12.23-FF4154?style=for-the-badge&logo=framer&logoColor=white)

**🚀 Complete AI-Powered Interview Success Platform with Authentication, Payments & Stunning 3D Animations**

[Features](#-features) • [All Tools](#-all-tools-9-features) • [Auth & Payments](#-authentication--payments) • [Animations](#-background-animations--visual-effects) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack)

</div>

---

## 🚀 Overview

APEX-7 (Advanced Performance Evaluation eXpert - 7th Generation) is a **comprehensive interview preparation platform** with 9 AI-powered tools to help you land your dream job. The platform features stunning 3D background animations, smooth transitions, and a professional cinematic intro sequence. From video analysis to salary negotiation, we've got everything covered!

---

## ✨ All Tools (9 Features)

### 🎬 Row 1: Core Analysis Tools

| Tool | Description |
|------|-------------|
| **🎥 Video Analysis** | AI analyzes your interview video - facial expressions, voice, body language, and gives detailed feedback with hire probability score |
| **📄 Resume Checker** | ATS compatibility score, keyword analysis, section-by-section feedback, and improvement suggestions. Optional company targeting + `Depth` (Quick/Deep) analysis available. |
| **📁 PDF Tools** | All-in-one PDF toolkit - merge, split, compress, watermark, rotate, extract pages, and more |

### ✍️ Row 2: AI Writing Tools

| Tool | Description |
|------|-------------|
| **💌 Cover Letter Generator** | Generate tailored cover letters instantly. Upload resume + paste JD = perfect cover letter |
| **🔍 Job Description Analyzer** | Decode any job posting - extract key skills, requirements, red flags, and preparation tips |
| **📧 AI Email Writer** | Professional job-related emails - follow-ups, thank you notes, negotiations, cold outreach |

### 🚀 Row 3: Career Advancement Tools

| Tool | Description |
|------|-------------|
| **💼 LinkedIn Optimizer** | Optimize your LinkedIn profile for recruiters - headline, summary, keywords, and skills suggestions |
| **❓ Interview Q&A Bank** | Role-specific interview questions with model answers - behavioral, technical, and situational |
| **💰 Salary Negotiation Coach** | Market salary insights in ₹ LPA, negotiation scripts, counter-offer strategies, and email templates |

---

## 🔐 Authentication & Payments

### 👤 User Authentication

APEX-7 includes a complete authentication system with:

| Feature | Description |
|---------|-------------|
| **📝 Registration** | Create account with name, email, and password |
| **🔑 Login** | Secure JWT-based authentication |
| **🔒 Password Hashing** | bcrypt encryption for security |
| **💾 Session Persistence** | LocalStorage token management |
| **🔄 Auto-refresh** | User data auto-refresh on app load |

### 💳 Credit System & Wallet

| Feature | Description |
|---------|-------------|
| **💰 Credit Wallet** | Virtual credits for using AI features |
| **📊 Transaction History** | Track all credit usage and purchases |
| **🛒 Credit Packages** | Buy credits in various bundles |
| **📈 Usage Tracking** | Per-feature credit costs |

### 💎 Subscription Plans

| Plan | Features |
|------|----------|
| **Free** | Basic access with limited credits |
| **Pro** | Monthly/Yearly subscription with more credits |
| **Enterprise** | Unlimited access for teams |

### 💵 Razorpay Payment Integration

- ✅ Secure payment processing via Razorpay
- ✅ Support for UPI, Cards, NetBanking, Wallets
- ✅ Order creation & verification
- ✅ Webhook support for payment confirmation
- ✅ Indian Rupee (₹) pricing

---

## 🎨 Background Animations & Visual Effects

APEX-7 features beautiful 3D animations that make the interface visually stunning and professional.

### 🔮 3D Prism Animation (WebGL)

The main background features a **stunning 3D animated prism** built with WebGL using the OGL library.

| Property | Description | Default Value |
|----------|-------------|---------------|
| `height` | Height of the prism | `3.5` |
| `baseWidth` | Base width of the prism | `5.5` |
| `animationType` | Animation type: `rotate`, `hover`, `3drotate` | `rotate` |
| `glow` | Glow intensity around prism | `1` |
| `noise` | Noise effect intensity | `0.5` |
| `scale` | Overall scale of prism | `3.6` |
| `hueShift` | Color hue shift | `0` |
| `colorFrequency` | Color change frequency | `1` |
| `hoverStrength` | Mouse hover reaction strength | `2` |
| `inertia` | Animation inertia/smoothness | `0.05` |
| `bloom` | Bloom/glow effect intensity | `1` |
| `timeScale` | Animation speed | `0.5` |
| `transparent` | Enable transparency | `true` |

**Features:**
- ✨ Real-time WebGL rendering with OGL library
- 🎨 Dynamic color gradients with HSL color manipulation
- 🖱️ Interactive mouse hover effects
- 🔄 Smooth rotation animations
- 📱 Responsive and performance-optimized (reduced DPR for performance)
- 🌈 Customizable glow, bloom, and noise effects

### 🔄 Rotating Text Animation

Smooth text rotation animation built with **Motion (Framer Motion)** library.

| Property | Description | Default Value |
|----------|-------------|---------------|
| `texts` | Array of text strings to rotate | Required |
| `rotationInterval` | Time between rotations (ms) | Auto |
| `staggerDuration` | Character stagger animation duration | Auto |
| `staggerFrom` | Animation direction: `first`, `last`, `center`, `random` | `first` |
| `loop` | Enable continuous looping | `true` |
| `auto` | Auto-rotate without user interaction | `true` |
| `splitBy` | Split text by character/word | `''` |
| `transition` | Spring animation config | `{ type: 'spring', damping: 25, stiffness: 300 }` |

**Features:**
- 🎭 Character-by-character stagger animations
- 🔄 Smooth spring-based transitions
- ⏱️ Configurable rotation intervals
- 🎯 Multiple animation directions

### 🎬 Cinematic Intro Screen

Professional system initialization sequence with:
- 🌐 Animated grid background with scanning lines
- 🔮 Central glow with gradient effects
- 🌟 Orbiting particles animation (8 particles with different colors)
- 📊 Feature grid with animated icons
- 📈 Loading bar with gradient progress
- ⏳ Phased animation sequence (6 phases over 6 seconds)

---

## 🎨 UI Features

- 🌙 **Dark/Light Mode** - Toggle between themes with persistent preference
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ✨ **Smooth Animations** - Beautiful transitions and loading states
- 🎬 **Cinematic Intro** - Professional system initialization sequence
- 🌐 **Multi-language** - English and Hindi support
- 🔮 **3D WebGL Background** - Stunning prism animation with mouse interaction
- 🔄 **Rotating Text** - Animated text transitions in hero section
- 🤖 **AI Chatbot** - Integrated AI assistant for help
- 👤 **User Auth** - Login/Register with JWT authentication
- 💰 **Wallet System** - Credit-based usage with transaction history
- 💎 **Subscription Plans** - Free, Pro, and Enterprise tiers

---

## 🧠 Video Analysis Modules (12 Modules)

1. **FACS Analysis** - Facial Action Coding System (43 facial muscles, 10,000+ expressions)
2. **Vocal Biometrics** - Pitch, tone, stress, filler words, speaking pace
3. **Linguistic Forensics** - Discourse patterns, vocabulary, clarity
4. **Kinesic Decoder** - Body language, gestures, posture
5. **Cognitive State** - Mental load, processing patterns
6. **Emotional Intelligence** - EQ mapping, emotional regulation
7. **Deception Detection** - Authenticity scoring, incongruence
8. **Executive Presence** - Leadership signals, gravitas metrics
9. **Predictive Engine** - ML-based hire probability
10. **Psychological Profiling** - Personality assessment
11. **NLP Patterns** - Communication patterns analysis
12. **Cultural Intelligence** - Context and communication style

---

## 🛠 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Google Gemini API key** - [Get one here](https://aistudio.google.com/app/apikey)

### 📦 Installation (Step-by-Step)

#### Step 1: Clone the Repository

```bash
git clone https://github.com/Amitjoiya/Interview_video_analyzer.git
cd Interview_video_analyzer
```

#### Step 2: Install Frontend Dependencies

```bash
# Install all frontend packages (React, TypeScript, animations, etc.)
npm install
```

This will install:
- **React 19.2** - UI Framework
- **TypeScript 5.8** - Type-safe development
- **Vite 6.2** - Fast build tool
- **OGL 1.0.11** - WebGL library for 3D Prism animation
- **Motion 12.23** - Animation library (Framer Motion)
- **Three.js 0.182** - 3D graphics library
- **GSAP 3.14** - Animation library
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **pdf-lib & pdfjs-dist** - PDF manipulation
- **JSZip** - File compression

#### Step 3: Setup Backend Server (Recommended)

The backend server provides rate limiting, request queuing, and secure API key handling.

```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install
```

This will install:
- **Express 4.18** - Web server
- **@google/genai** - Gemini AI SDK
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cookie-parser** - Cookie handling
- **razorpay** - Payment gateway
- **pdf-parse** - PDF text extraction
- **ioredis & bullmq** - Redis queue (optional)

#### Step 4: Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
# server/.env

# AI Configuration
GEMINI_API_KEY='your_gemini_api_key_here'

# Database
MONGODB_URI='mongodb://localhost:27017/apex7'

# Authentication
JWT_SECRET='your_super_secret_jwt_key_here'

# Razorpay Payment Gateway
RAZORPAY_KEY_ID='your_razorpay_key_id'
RAZORPAY_KEY_SECRET='your_razorpay_key_secret'

# Optional - Redis Queue
REDIS_URL='redis://127.0.0.1:6379'
MAX_CONCURRENT=1
MAX_REQUESTS_PER_MINUTE=10
```

> ⚠️ **Important**: Never commit your `.env` file to version control!

#### Step 5: Start Development Servers

**Option A: Frontend Only (Quick Start)**
```bash
# From project root
npm run dev
```
Frontend will be available at: `http://localhost:5173`

**Option B: Full Stack (Recommended)**

Open two terminal windows:

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend server
cd server
npm start
# or
node index.js
```

- Frontend: `http://localhost:5173` (Vite dev server)
- Backend API: `http://localhost:5001`

### 🔧 Troubleshooting Installation

| Issue | Solution |
|-------|----------|
| `npm install` fails | Try `npm install --legacy-peer-deps` |
| WebGL not working | Update your graphics drivers, use Chrome/Firefox |
| Prism animation laggy | Reduce `scale` prop or increase `timeScale` |
| API key not working | Check `.env` file format, restart server |
| Port already in use | Change port in `vite.config.ts` or server `index.js` |
| Redis connection error | Redis is optional, server will use in-memory queue |
| MongoDB connection error | Ensure MongoDB is running locally or use MongoDB Atlas |
| Razorpay not working | Check API keys in `.env`, ensure test mode for development |

### 📋 Available Scripts

```bash
# Frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build

# Backend (in server folder)
npm start        # Start server
node index.js    # Alternative start command
```
npm run dev      # frontend
node server/index.js  # backend proxy (optional)
### Server config (env variables)

- `GEMINI_API_KEY` - your Gemini API key
- `MONGODB_URI` - MongoDB connection string (required for auth & wallet)
- `JWT_SECRET` - secret key for JWT token signing
- `RAZORPAY_KEY_ID` - Razorpay API key ID
- `RAZORPAY_KEY_SECRET` - Razorpay API secret
- `REDIS_URL` - redis connection string (optional, used by server queue; fallback to in-memory queue if not available)
- `MAX_CONCURRENT` - server-side concurrency limit (default 1) to avoid hammering the provider
- `MAX_REQUESTS_PER_MINUTE` - per-IP rate limit to protect provider quota (default 10)


# Open in browser
# Frontend: http://localhost:3000 (Vite dev server)
# API server: http://localhost:5001 (if running)
```

---

## 🏗 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19.2** | UI Framework with latest features |
| **TypeScript 5.8** | Type-safe development |
| **Vite 6.2** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first styling |
| **Google Gemini 2.5 Flash** | AI for all analysis and generation |
| **OGL 1.0.11** | WebGL library for 3D Prism animation |
| **Motion 12.23** | Animation library (Framer Motion) |
| **Three.js 0.182** | 3D graphics and rendering |
| **GSAP 3.14** | Professional-grade animations |
| **Lucide React** | Beautiful icon library |
| **Recharts** | Data visualization |
| **pdf-lib & pdfjs-dist** | PDF manipulation and rendering |
| **JSZip** | DOCX/PPTX file handling |

### Backend Dependencies

| Technology | Purpose |
|------------|---------|
| **Express 4.18** | Node.js web server |
| **@google/genai** | Gemini AI SDK |
| **mongoose 8.0** | MongoDB ODM for data modeling |
| **bcryptjs** | Password hashing & security |
| **jsonwebtoken** | JWT authentication tokens |
| **razorpay** | Payment gateway integration |
| **multer** | File upload handling |
| **cors** | Cross-origin resource sharing |
| **cookie-parser** | Cookie management |
| **dotenv** | Environment variable management |
| **pdf-parse** | PDF text extraction |
| **ioredis** | Redis client for queuing |
| **bullmq** | Job queue for request management |

---

## 📁 Project Structure

```
apex-7/
├── components/
│   ├── AnalysisDashboard.tsx      # Video analysis results
│   ├── ResumeDashboard.tsx        # Resume analysis results
│   ├── Header.tsx                 # Navigation with theme toggle
│   ├── UploadSection.tsx          # Video upload interface
│   ├── PDFTools.tsx               # PDF manipulation tools
│   ├── CoverLetterGenerator.tsx   # Cover letter AI
│   ├── JobAnalyzer.tsx            # JD analysis
│   ├── EmailWriter.tsx            # Email templates
│   ├── LinkedInOptimizer.tsx      # LinkedIn optimization
│   ├── InterviewQABank.tsx        # Q&A generation
│   ├── SalaryCoach.tsx            # Salary negotiation
│   ├── AIChatBot.tsx              # AI assistant chatbot
│   ├── AuthModal.tsx              # 🔐 Login/Register modal
│   ├── WalletDashboard.tsx        # 💰 Credit wallet & transactions
│   ├── PricingPlans.tsx           # 💎 Subscription plans
│   ├── Prism.tsx                  # 🔮 3D WebGL Prism animation (OGL)
│   ├── RotatingText.tsx           # 🔄 Animated rotating text (Motion)
│   ├── ThemeToggle.tsx            # Dark/Light mode toggle
│   └── Ballpit.tsx                # Legacy 2D animation (deprecated)
├── services/
│   ├── geminiService.ts           # Video analysis AI
│   ├── resumeService.ts           # Resume analysis AI
│   ├── aiWriterService.ts         # Writing tools AI
│   └── pdfService.ts              # PDF processing utilities
├── server/                        # Backend server
│   ├── index.js                   # Express server with rate limiting & queue
│   ├── aiClient.js                # Gemini API client with retries
│   ├── package.json               # Server dependencies
│   ├── middleware/
│   │   ├── auth.js                # 🔐 JWT authentication middleware
│   │   └── creditCheck.js         # 💰 Credit balance verification
│   ├── models/
│   │   ├── User.js                # 👤 User schema (auth, wallet, subscription)
│   │   └── Transaction.js         # 💳 Transaction schema
│   ├── routes/
│   │   ├── auth.js                # 🔑 Login/Register/Me routes
│   │   ├── wallet.js              # 💰 Credit & transaction routes
│   │   ├── payment.js             # 💵 Razorpay payment routes
│   │   └── subscription.js        # 💎 Subscription management
│   └── .env                       # Environment variables (create this!)
├── AuthContext.tsx                # 🔐 Authentication context provider
├── ThemeContext.tsx               # Dark/Light mode context
├── LanguageContext.tsx            # Multi-language support
├── App.tsx                        # Main app with routing & intro animation
├── types.ts                       # TypeScript definitions
├── constants.ts                   # App constants
├── translations.ts                # Language translations
├── index.tsx                      # React entry point
├── index.html                     # HTML template
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Frontend dependencies
```

---

## 🎯 Key Highlights

- ✅ **All-in-One Platform** - 9 powerful tools in one place
- ✅ **100% AI-Powered** - Gemini 2.5 Flash for accurate analysis
- ✅ **User Authentication** - Secure JWT-based login/register system
- ✅ **Credit Wallet System** - Pay-as-you-go with transaction history
- ✅ **Subscription Plans** - Free, Pro, and Enterprise tiers
- ✅ **Razorpay Payments** - Secure UPI, Cards, NetBanking support
- ✅ **MongoDB Backend** - Persistent user data and transactions
- ✅ **Stunning 3D Animations** - WebGL Prism background with mouse interaction
- ✅ **Cinematic Experience** - Professional intro sequence with phased animations
- ✅ **Indian Market Focus** - Salary in ₹ LPA, Indian cities, Razorpay
- ✅ **Privacy First** - Client-side processing where possible
- ✅ **Dark/Light Mode** - Beautiful themed UI
- ✅ **Multi-language** - English and Hindi support
- ✅ **AI Chatbot** - Built-in assistant for help

---

## 🔧 Animation Customization

### Customizing Prism Animation

Edit the Prism component in `App.tsx`:

```tsx
<Prism 
  height={3.5}           // Prism height
  baseWidth={5.5}        // Prism base width  
  animationType="rotate" // rotate | hover | 3drotate
  glow={1}               // Glow intensity
  noise={0.5}            // Noise effect
  scale={3.6}            // Overall scale
  hueShift={0}           // Color shift
  colorFrequency={1}     // Color change speed
  hoverStrength={2}      // Mouse hover effect
  inertia={0.05}         // Animation smoothness
  bloom={1}              // Bloom effect
  timeScale={0.5}        // Animation speed
  transparent={true}     // Enable transparency
/>
```

### Customizing Rotating Text

Edit the RotatingText component usage:

```tsx
<RotatingText
  texts={['Text 1', 'Text 2', 'Text 3']}
  rotationInterval={3000}     // ms between rotations
  staggerDuration={0.05}      // Character stagger timing
  staggerFrom="first"         // first | last | center | random
  loop={true}                 // Enable looping
  auto={true}                 // Auto-rotate
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
/>
```

---

## 🚀 Upcoming Features

- 📋 **Interview Prep Planner** - Todo/Task manager with templates
- 📊 **Progress Analytics** - Track your preparation journey
- 🎯 **Mock Interview Simulator** - AI-powered live practice
- 📱 **PWA Support** - Install as mobile app
- 🏢 **Team Management** - Enterprise admin dashboard
- 📧 **Email Notifications** - Payment & usage alerts

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Made with ❤️ by Amit Joiya**

[![GitHub](https://img.shields.io/badge/GitHub-Amitjoiya-181717?style=for-the-badge&logo=github)](https://github.com/Amitjoiya)

[Report Bug](https://github.com/Amitjoiya/Interview_video_analyzer/issues) • [Request Feature](https://github.com/Amitjoiya/Interview_video_analyzer/issues)

</div>

---

## 🔒 Security / Secrets

- The repository no longer contains any sensitive API keys. 
- Server environment variables should be added locally in `server/.env`.
- Use `server/.env.example` as a template and never commit your `.env` files to the repo.
- Passwords are hashed using bcryptjs before storing in MongoDB.
- JWT tokens are used for secure session management.
- Razorpay payments are verified server-side with signature validation.

---

## 📞 Support

If you have any questions or need help:

1. 📖 Check the [Getting Started](#-getting-started) section
2. 🔧 See [Troubleshooting Installation](#-troubleshooting-installation)
3. 🐛 Open an [Issue](https://github.com/Amitjoiya/Interview_video_analyzer/issues)
4. 💬 Use the built-in AI Chatbot for instant help

