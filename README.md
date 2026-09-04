# EduLanka

A React + Node.js MVP that helps Sri Lankan students discover, save and access notes, past papers, tutorials and video courses in one place.

Study materials in Sri Lanka are often scattered across Facebook groups, personal drives and WhatsApp chats. EduLanka provides a searchable catalogue, localStorage saved lists, and a transparent recommendation engine. No login is required.

## Stack

- Frontend: React, React Router, Vite, CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Persistence on the client: `localStorage`

The catalogue still works from bundled sample data if the API or MongoDB is unavailable.

## Run locally

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
```

Set `MONGO_URI` in `backend/.env`, then:

```bash
npm run seed
npm run dev
```

If Atlas authentication fails, the API still starts and serves the 10 sample resources in memory so the app remains usable.

API: `http://localhost:5000/api/health`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`

Vite proxies `/api` to the backend during development.

## Routes

| Path | Page |
|---|---|
| `/` | Landing page |
| `/resources` | Search, filter and sort the catalogue |
| `/resources/:id` | Resource details |
| `/saved` | Saved resources |
| `/recommendations` | Recommendation form and ranked results |
| `/about` | Impact and benefits |

## Recommendation scoring

- Subject match: +40
- Education level match: +30
- Language match: +20
- Matching tags: +10
