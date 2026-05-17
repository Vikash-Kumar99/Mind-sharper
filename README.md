# Mind Shaper - AI Cognitive Development Platform

Welcome to **Mind Shaper**, a premium, futuristic, dark-themed cognitive training, focus, habit tracker, and AI productivity coach application. This platform integrates cognitive gamification (XP, streaks, and achievement badges) with neuroscience-based activities (Pomodoro timers, memory and attention games, visual analytics).

---

## ⚡ Technical Stack Summary

- **Frontend**: Next.js 15 (App Router, Server-side & SPA integration) + TypeScript + Tailwind CSS + Framer Motion (premium physics-based animations) + Recharts (beautiful visual dashboard trends)
- **Backend**: Express + Node.js + TypeScript (modular, secure REST API, Supabase JWT parser, OpenAI API interface)
- **Database & Auth**: Supabase PostgreSQL (custom SQL leveling triggers, streaks calculators, user profiles)
- **AI Integrations**: OpenAI API for context-aware cognitive advising with an interactive Coach
- **Containerization**: Docker & Docker Compose setup

---

## 📂 Repository Structure

- `frontend/` - Next.js 15 Client app
- `backend/` - Node.js / Express backend service
- `database/` - Supabase schemas and PostgreSQL gamification trigger routines
- `docker-compose.yml` - Container configuration Orchestrator

---

## 🚀 Step-by-Step Setup Guide

### 1. Database Setup (Supabase)
1. Register a free account at [Supabase.com](https://supabase.com).
2. Create a new project called **Mind Shaper**.
3. Open the **SQL Editor** in your Supabase dashboard and click **New Query**.
4. Copy the entire contents of the `/database/schema.sql` file and paste them into the SQL Editor.
5. Click **Run** to generate the user profiles, habits, logs, achievements, and leveling triggers.

### 2. Configure Environment Variables
1. Copy the `.env.example` at the root folder to `/backend/.env` and `/frontend/.env.local`.
2. Fill in the values:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found under project API settings.
   - `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_JWT_SECRET` (under JWT settings) go in the `/backend/.env` file.
   - Fill in your `OPENAI_API_KEY` in the `/backend/.env` file.

### 3. Docker Running (Recommended)
Launch both services easily using Docker:
```bash
docker-compose up --build
```
The frontend will bind to `http://localhost:3000` and the backend to `http://localhost:5000`.

### 4. Running Manually (Without Docker)

#### Express Backend:
```bash
cd backend
npm install
npm run dev
```

#### Next.js Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🛡️ Security Best Practices
- **Bearer Token validation**: All APIs under `/api/protected/*` utilize a JWT authenticator checking Supabase's signature using the secret key.
- **Parametrized SQL Queries**: Supabase Client uses safe standard parameter mapping preventing injection threats.
- **Helmet headers & CORS limits**: Secure CORS setup preventing malicious page requests.
