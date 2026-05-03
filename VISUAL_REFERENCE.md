# 🎯 NotesAI - Visual Quick Reference

## Project at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                    NotesAI - Full Stack                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  React (Frontend) ←→ Express Server ←→ MongoDB Database    │
│  http://localhost:5173    http://localhost:5000             │
│                                                              │
│  + JWT Authentication   + OpenAI Integration                │
│  + Protected Routes      + Error Handling                   │
│  + Responsive UI         + CORS Enabled                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## File Map

```
NOTESAI/
├── 📁 backend/
│   ├── 📄 server.js ..................... Main Express app
│   ├── 📁 models/
│   │   ├── 📄 User.js ................... User schema (hashed passwords)
│   │   └── 📄 Note.js ................... Note schema (userId reference)
│   ├── 📁 routes/
│   │   ├── 📄 auth.js ................... Login/Signup endpoints
│   │   └── 📄 notes.js .................. CRUD + Summarize endpoints
│   ├── 📁 middleware/
│   │   └── 📄 auth.js ................... JWT verification
│   ├── 📄 package.json .................. Dependencies
│   ├── 📄 .env.example .................. Template for secrets
│   └── 📄 README.md ..................... Backend docs
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📄 App.jsx ................... Main app + routing
│   │   ├── 📄 api.js .................... Axios setup
│   │   ├── 📁 pages/
│   │   │   ├── 📄 Login.jsx ............ Login page
│   │   │   ├── 📄 Signup.jsx ........... Signup page
│   │   │   ├── 📄 Dashboard.jsx ........ Main dashboard
│   │   │   └── 📄 Auth.css ............ Auth page styles
│   │   ├── 📁 components/
│   │   │   ├── 📄 Navbar.jsx ........... Navigation
│   │   │   ├── 📄 Navbar.css .......... Navbar styles
│   │   │   ├── 📄 NoteCard.jsx ........ Note display
│   │   │   ├── 📄 NoteCard.css ....... Note styles
│   │   │   └── 📄 Dashboard.css ..... Dashboard styles
│   │   └── 📄 main.jsx ................. React entry
│   ├── 📄 index.html .................... HTML entry
│   ├── 📄 vite.config.js ................ Vite setup
│   ├── 📄 package.json .................. Dependencies
│   ├── 📄 .env.local .................... API URL
│   └── 📄 README.md ..................... Frontend docs
│
└── 📁 Documentation/
    ├── 📄 README.md ..................... Overview
    ├── 📄 QUICK_START.md ............... 5-min setup ⭐
    ├── 📄 SETUP_GUIDE.md ............... Detailed setup
    ├── 📄 DEPLOYMENT_GUIDE.md .......... Production guide
    ├── 📄 ARCHITECTURE.md .............. Code explanation
    ├── 📄 KEY_CONCEPTS.md .............. Learning guide
    ├── 📄 PROJECT_STRUCTURE.md ........ File guide
    ├── 📄 TROUBLESHOOTING.md ........... Bug fixes
    ├── 📄 CHECKLIST.md ................. Progress tracker
    └── 📄 DOCUMENTATION_INDEX.md ...... Doc map
```

## Data Flow Diagram

```
┌──────────────┐                 ┌──────────────┐                ┌───────────┐
│  React App   │                 │  Express     │                │ MongoDB   │
│ (Frontend)   │ ←─HTTP/JSON─→   │  (Backend)   │ ←─Query─→     │ (Database)│
└──────────────┘                 └──────────────┘                └───────────┘
       ↓                                ↓                              ↓
  - Signup form             - Validate input            - Store users
  - Login form              - Hash password             - Store notes
  - Create note             - Create JWT token          - Check auth
  - Note list               - Call OpenAI API           - Query notes
  - Summarize btn           - Return to frontend
       ↓                                ↓                              ↓
  Token in localStorage    Middleware (auth)         Indexes on userId
  User in localStorage     Error handling
```

## Authentication Flow

```
User Signup/Login
      ↓
   Submit Form
      ↓
   Frontend validates
      ↓
   Call /api/auth/signup or /api/auth/login
      ↓
   Backend receives request
      ↓
   Validate input with express-validator
      ↓
   Find/Create user in MongoDB
      ↓
   Hash password with bcrypt
      ↓
   Generate JWT token (signed with JWT_SECRET)
      ↓
   Return token + user data to frontend
      ↓
   Frontend stores token in localStorage
      ↓
   Token auto-sent with every future request
      ↓
   Backend verifies token with auth middleware
      ↓
   Request allowed to continue
```

## Component Tree

```
<App>
  │
  ├─ useEffect
  │  └─ Check localStorage for token on load
  │
  ├─ useState(user)
  │  └─ Track logged-in user
  │
  └─ <BrowserRouter>
     │
     ├─ <Routes>
     │
     ├─ /login ──────────→ <Login onLogin={handleLogin} />
     │                         ├─ useState(email, password)
     │                         ├─ Call authAPI.login()
     │                         └─ setUser() on success
     │
     ├─ /signup ─────────→ <Signup onLogin={handleLogin} />
     │                         ├─ useState(name, email, password)
     │                         ├─ Call authAPI.signup()
     │                         └─ setUser() on success
     │
     ├─ / (Dashboard) ──→ <Dashboard user={user} />
     │                         ├─ useEffect → fetch notes
     │                         ├─ <form> create note
     │                         └─ {notes.map(note => <NoteCard />)}
     │                                         ├─ useState(expanded, summary)
     │                                         ├─ Button: Summarize
     │                                         └─ Button: Delete
     │
     └─ <Navbar user={user} onLogout={handleLogout} />
                ├─ Display user name
                └─ Logout button
```

## API Endpoints Reference

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    PUBLIC ENDPOINTS (No Token)                        ║
╠═══════════════════════════════════════════════════════════════════════╣
║ POST   /api/auth/signup          Register new user                   ║
║ POST   /api/auth/login           Login user (returns token)          ║
║ GET    /api/health               Health check                        ║
╚═══════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════╗
║            PROTECTED ENDPOINTS (Require JWT Token)                    ║
╠═══════════════════════════════════════════════════════════════════════╣
║ GET    /api/notes                Get user's notes                    ║
║ POST   /api/notes                Create new note                     ║
║ DELETE /api/notes/:id            Delete note                        ║
║ POST   /api/notes/:id/summarize  Generate AI summary                ║
╚═══════════════════════════════════════════════════════════════════════╝
```

## Request Format

```
HTTP Request:
─────────────

POST /api/auth/login
Content-Type: application/json
Authorization: (not needed for public endpoints)

{
  "email": "user@example.com",
  "password": "password123"
}

HTTP Response:
──────────────

200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Setup Commands Quick Guide

```bash
# Backend Setup
cd backend
npm install
cp .env.example .env
# Edit .env with:
# - MONGO_URI (from MongoDB Atlas)
# - JWT_SECRET (generate random string)
# - OPENAI_API_KEY (from OpenAI)
npm run dev
# Output: 🚀 Running on http://localhost:5000

# Frontend Setup
cd frontend
npm install
npm run dev
# Output: Local: http://localhost:5173/
```

## Environment Variables

```
Backend (.env):
───────────────
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key_here_use_32_characters_minimum
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=5000
NODE_ENV=development

Frontend (.env.local):
─────────────────────
VITE_API_URL=http://localhost:5000/api
```

## Common Workflows

### User Registration Flow

```
1. User clicks "Sign up"
2. Fills in: Name, Email, Password
3. Frontend validates inputs
4. Calls POST /api/auth/signup
5. Backend validates again
6. Hashes password
7. Creates user in MongoDB
8. Generates JWT token
9. Returns token to frontend
10. Frontend stores token in localStorage
11. Redirects to dashboard
12. Dashboard fetches user's notes
```

### Create Note Flow

```
1. User enters note title & content
2. Clicks "Create Note"
3. Frontend validates
4. Calls POST /api/notes with token in header
5. Backend auth middleware verifies token
6. Extracts userId from token
7. Creates note with userId
8. Saves to MongoDB
9. Returns saved note
10. Frontend adds note to state
11. Note appears in list
```

### Summarize Note Flow

```
1. User clicks "Summarize" button
2. Frontend calls POST /api/notes/:id/summarize
3. Backend auth middleware verifies token
4. Backend checks user owns the note
5. Extracts note content
6. Sends to OpenAI API with GPT-3.5-turbo
7. OpenAI returns summary
8. Backend saves summary to MongoDB
9. Returns summary to frontend
10. Frontend displays summary below note
```

## Deployment Targets

```
Backend (Node.js + MongoDB)
────────────────────────────
Platform: Render (render.com)
Port: 10000 (assigned by Render)
Database: MongoDB Atlas (cloud)
URL: https://your-backend.onrender.com

Frontend (React + Vite)
──────────────────────
Platform: Vercel (vercel.com)
Port: 443 (HTTPS)
Build: npm run build → dist folder
URL: https://your-frontend.vercel.app
```

## Development Ports

```
Backend:     http://localhost:5000
Frontend:    http://localhost:5173
Database:    N/A (cloud hosted)
```

## Key Libraries & Versions

```
Backend:
────────
Express.js ............. Web framework
Mongoose ............... MongoDB ORM
Bcryptjs ............... Password hashing
JsonWebToken ........... JWT auth
Cors ................... Cross-origin
Axios .................. HTTP (for OpenAI)
Express-validator ...... Input validation

Frontend:
────────
React .................. UI library
React Router ........... Routing
Axios .................. HTTP client
Vite ................... Build tool
```

## Documentation Quick Links

```
Start here: QUICK_START.md (5 min)
     ↓
Detailed: SETUP_GUIDE.md (30 min)
     ↓
Understand: ARCHITECTURE.md (20 min)
     ↓
Learn: KEY_CONCEPTS.md (30 min)
     ↓
Deploy: DEPLOYMENT_GUIDE.md (20 min)
     ↓
Stuck?: TROUBLESHOOTING.md (10 min)
```

## Success Indicators

✅ Backend running on http://localhost:5000
✅ Frontend running on http://localhost:5173
✅ Can sign up new account
✅ Can log in with credentials
✅ Can create notes
✅ Can see notes in list
✅ Can summarize notes (with OpenAI)
✅ Can delete notes
✅ No errors in browser console (F12)
✅ No errors in backend logs

## Next Steps After Setup

1. ✅ Read SETUP_GUIDE.md
2. ✅ Run backend & frontend
3. ✅ Test all features
4. ✅ Read ARCHITECTURE.md
5. ✅ Understand data flow
6. ✅ Read KEY_CONCEPTS.md
7. ✅ Modify some code
8. ✅ Read DEPLOYMENT_GUIDE.md
9. ✅ Deploy to production
10. ✅ Add new features

---

**Ready? Start with:** [QUICK_START.md](./QUICK_START.md) 🚀
