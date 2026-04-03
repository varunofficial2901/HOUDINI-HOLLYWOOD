# 🎬 Houdini Hollywood — Full Stack Setup Guide

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────┐
│   Frontend      │     │   Admin Panel    │     │   Backend      │
│   React + Vite  │────▶│   React + Vite   │────▶│  FastAPI       │
│   Port 5173     │     │   Port 5174      │     │  Port 8000     │
└─────────────────┘     └──────────────────┘     └───────┬────────┘
                                                          │
                                                   ┌──────▼──────┐
                                                   │   MongoDB   │
                                                   │  Port 27017 │
                                                   └─────────────┘
```

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Python | 3.10+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| MongoDB | 6+ | https://www.mongodb.com/try/download/community |

---

## Quick Start (One Command)

```bash
chmod +x start.sh
bash start.sh
```

---

## Manual Setup

### 1️⃣ MongoDB
```bash
# macOS
brew install mongodb-community && brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod

# Windows
# Start MongoDB from Services or run: mongod
```

### 2️⃣ Backend (FastAPI)
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env .env.local               # Edit .env with your settings

# Seed database (run ONCE — creates admin + courses + pricing)
python seed.py

# Start server
python main.py
# OR with auto-reload:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at: http://localhost:8000
API docs at:     http://localhost:8000/docs

### 3️⃣ Admin Panel
```bash
cd admin-panel
npm install
npm run dev
```
Admin Panel runs at: http://localhost:5174

**Default Admin Login:**
- Email: `admin@houdinivfx.com`
- Password: `Admin@123456`
- ⚠️ Change these in `backend/.env` before production!

### 4️⃣ Frontend (Existing React Site)

#### A. Copy integration files
```bash
# Copy API client
cp frontend-integration/src/api/client.js  frontend/src/api/client.js

# Copy Auth context
mkdir -p frontend/src/context
cp frontend-integration/src/context/AuthContext.jsx  frontend/src/context/AuthContext.jsx

# Add environment variable
echo "VITE_API_URL=http://localhost:8000" >> frontend/.env
```

#### B. Wrap App with AuthProvider
In `frontend/src/App.jsx`, import and wrap:
```jsx
import { AuthProvider } from './context/AuthContext';

// Inside BrowserRouter, wrap MainApp:
<AuthProvider>
  <MainApp />
</AuthProvider>
```

#### C. Wire EnrollNow.jsx
In `frontend/src/pages/EnrollNow.jsx`:
```js
// 1. Add import at top:
import { enrollmentsApi } from "../api/client";

// 2. Replace handleSubmit — see frontend-integration/ENROLL_INTEGRATION.js
```

#### D. Wire Pricing.jsx contact form
In `frontend/src/pages/Pricing.jsx`:
```js
// 1. Add import at top:
import { messagesApi } from "../api/client";

// 2. Replace handleFormSubmit — see frontend-integration/PRICING_INTEGRATION.js
```

#### E. Wire Navbar.jsx sign-in modal
In `frontend/src/components/Navbar.jsx`:
```js
// 1. Add import:
import { useAuth } from "../context/AuthContext";

// 2. Follow guide in frontend-integration/NAVBAR_INTEGRATION.js
```

#### F. Start frontend
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:5173

---

## API Endpoints Reference

### Public (No Auth Required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | List active courses |
| GET | `/api/pricing` | List active pricing plans |
| POST | `/api/enrollments` | Submit enrollment form |
| POST | `/api/messages` | Submit contact message |
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login` | Login (student or admin) |
| POST | `/api/auth/refresh` | Refresh access token |

### Protected (Student Auth Required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/change-password` | Change password |

### Admin Only
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/enrollments` | List all enrollments |
| PATCH | `/api/enrollments/:id` | Update enrollment status |
| DELETE | `/api/enrollments/:id` | Delete enrollment |
| GET | `/api/courses/admin/all` | List all courses |
| POST | `/api/courses` | Create course |
| PATCH | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |
| GET | `/api/pricing/admin/all` | List all plans |
| PATCH | `/api/pricing/:id` | Update pricing plan |
| GET | `/api/messages` | List messages |
| PATCH | `/api/messages/:id/read` | Mark as read |
| DELETE | `/api/messages/:id` | Delete message |
| GET | `/api/admin/students` | List students |
| PATCH | `/api/admin/students/:id/toggle` | Activate/deactivate |

---

## Environment Variables

### Backend `backend/.env`
| Variable | Default | Description |
|---|---|---|
| `MONGODB_URL` | `mongodb://localhost:27017` | MongoDB connection |
| `DB_NAME` | `houdini_hollywood` | Database name |
| `SECRET_KEY` | `changeme...` | **Change this!** JWT secret |
| `ADMIN_EMAIL` | `admin@houdinivfx.com` | Seed admin email |
| `ADMIN_PASSWORD` | `Admin@123456` | Seed admin password |
| `ALLOWED_ORIGINS` | `localhost:5173,5174` | CORS allowed origins |

### Frontend `frontend/.env`
| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend API URL |

---

## MongoDB Collections

| Collection | Purpose |
|---|---|
| `users` | Students + Admin accounts |
| `enrollments` | Course enrollment submissions |
| `courses` | Course catalog with lessons |
| `pricing_plans` | Starter / Pro / Master plans |
| `contact_messages` | Messages from Pricing page |

---

## Production Deployment

### Backend
```bash
# Use a production ASGI server
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

### Frontend + Admin Panel
```bash
# Build for production
cd frontend && npm run build      # outputs to dist/
cd admin-panel && npm run build   # outputs to dist/

# Serve with nginx, or a static host (Netlify, Vercel, etc.)
```

### Nginx config (example)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/frontend/dist;
        try_files $uri /index.html;
    }

    # Admin panel
    location /admin {
        root /var/www/admin-panel/dist;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Security Checklist (Before Go-Live)

- [ ] Change `SECRET_KEY` in `.env` to a 64-char random string
- [ ] Change `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- [ ] Set `ALLOWED_ORIGINS` to your actual domain(s)
- [ ] Enable HTTPS (use Let's Encrypt / Certbot)
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Configure MongoDB authentication
- [ ] Set up regular MongoDB backups

---

## Project Structure

```
houdini-hollywood/
├── backend/                    ← FastAPI backend
│   ├── main.py                 ← App entry point
│   ├── seed.py                 ← DB seeder (run once)
│   ├── requirements.txt
│   ├── .env                    ← ⚠️ Configure this
│   ├── core/
│   │   ├── config.py           ← Settings
│   │   ├── database.py         ← MongoDB connection
│   │   └── security.py        ← JWT + bcrypt
│   ├── models/
│   │   └── schemas.py          ← Pydantic models
│   └── routers/
│       ├── auth.py             ← Auth endpoints
│       ├── enrollments.py      ← Enrollment CRUD
│       ├── courses.py          ← Courses CRUD
│       ├── pricing.py          ← Pricing CRUD
│       ├── messages.py         ← Contact messages
│       └── admin.py            ← Dashboard + students
│
├── admin-panel/                ← React admin dashboard
│   └── src/
│       ├── App.jsx             ← Routes
│       ├── api/client.js       ← Axios + all API calls
│       ├── context/AuthContext.jsx
│       ├── components/
│       │   ├── AdminLayout.jsx ← Sidebar + topbar
│       │   └── UI.jsx          ← Reusable components
│       └── pages/
│           ├── LoginPage.jsx
│           ├── Dashboard.jsx   ← Stats + charts
│           ├── Enrollments.jsx ← Manage enrollments
│           ├── Courses.jsx     ← Manage courses
│           ├── Pricing.jsx     ← Manage plans
│           ├── Messages.jsx    ← Contact messages
│           └── Students.jsx    ← Student accounts
│
├── frontend-integration/       ← Drop-in files for your existing frontend
│   ├── src/api/client.js
│   ├── src/context/AuthContext.jsx
│   ├── ENROLL_INTEGRATION.js
│   ├── PRICING_INTEGRATION.js
│   ├── NAVBAR_INTEGRATION.js
│   └── frontend.env
│
└── start.sh                    ← One-command startup
```
