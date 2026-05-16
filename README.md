# WorkSync – Team Task Manager

A full-stack team task management web application built with **Node.js / Express / MongoDB** (backend) and **Vanilla HTML/CSS/JavaScript** (frontend).

## Features

| Feature | Admin | Member |
|---------|-------|--------|
| Signup / Login (JWT) | ✅ | ✅ |
| Create & manage projects | ✅ | — |
| Add / remove project members | ✅ | — |
| Create / edit / delete tasks | ✅ | — |
| View assigned tasks | ✅ | ✅ |
| Update task status | ✅ | ✅ |
| Dashboard (stats + overdue) | ✅ | ✅ |

---

## Project Structure

```
worksync-main/
├── backend/           # Express + Mongoose API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   └── ...
│   ├── .env.example
│   └── package.json
└── frontend/          # Vanilla HTML/CSS/JS SPA
    ├── index.html
    ├── css/style.css
    └── js/
        ├── config.js
        ├── api.js
        ├── auth.js
        ├── ui.js
        ├── dashboard.js
        ├── projects.js
        ├── tasks.js
        └── app.js
```

---

## Local Setup

### 1. Backend

```bash
cd backend
cp .env.example .env        # Fill in MONGO_URI, JWT_SECRET, etc.
npm install
npm run dev                 # Starts on http://localhost:5000
```

### 2. Frontend

The frontend is pure static HTML – no build step needed.

**Option A – Open directly in browser:**
```
Open frontend/index.html in your browser
```

**Option B – Serve with a simple HTTP server (recommended for cookies):**
```bash
# With Node.js http-server
npx http-server frontend -p 3000 --cors
# Then open http://localhost:3000
```

**Option C – VS Code Live Server:**
Right-click `frontend/index.html` → "Open with Live Server"

> **Default API URL:** `http://localhost:5000/api`  
> To change it, edit `frontend/js/config.js` and set `window.ENV_API_URL`.

---

## Environment Variables (Backend)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `mySecret123` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLIENT_URL` | Comma-separated frontend URLs | `https://frontend.railway.app` |

---

## Deployment on Railway

### Backend
1. Create new Railway project → "New Service from GitHub repo"
2. Select the `backend` folder (or set root directory to `backend`)
3. Add environment variables from `.env.example`
4. Railway auto-detects `npm start`

### Frontend
1. Add another service → "Static Site" or deploy to Railway/Vercel/Netlify
2. Set the root directory to `frontend`
3. Edit `frontend/js/config.js`:
   ```js
   window.ENV_API_URL = 'https://your-backend.railway.app/api';
   ```
4. In the backend service, set `CLIENT_URL` to your frontend Railway URL

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/logout` | ✅ | Logout |
| GET  | `/api/auth/me` | ✅ | Get current user |
| GET  | `/api/projects` | ✅ | List projects |
| POST | `/api/projects` | Admin | Create project |
| GET  | `/api/projects/:id` | ✅ | Project detail |
| PATCH| `/api/projects/:id` | Admin | Update project |
| POST | `/api/projects/:id/members` | Admin | Add member |
| DELETE | `/api/projects/:id/members/:uid` | Admin | Remove member |
| GET  | `/api/projects/users` | Admin | List all users |
| GET  | `/api/tasks` | ✅ | List tasks |
| POST | `/api/tasks` | Admin | Create task |
| PATCH| `/api/tasks/:id` | ✅ | Update task |
| DELETE | `/api/tasks/:id` | Admin | Delete task |
| GET  | `/api/dashboard` | ✅ | Dashboard stats |

---

## Tech Stack

- **Backend:** Node.js, Express, Mongoose (MongoDB), bcryptjs, jsonwebtoken
- **Frontend:** HTML5, Vanilla CSS, Vanilla JavaScript (ES6+ modules pattern)
- **Database:** MongoDB Atlas
- **Deployment:** Railway
