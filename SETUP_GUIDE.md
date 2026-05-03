# 🚀 MERN Notes App - Complete Setup Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running Locally](#running-locally)
6. [Testing the App](#testing-the-app)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## 📝 Project Overview

**NotesAI** is a full-stack MERN application that allows users to:

- 🔐 Sign up and log in securely with JWT authentication
- 📝 Create, view, and delete notes
- 🤖 Generate AI-powered summaries using OpenAI
- 📱 Use a modern, responsive UI with Vite + React

### Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Auth**: JWT (JSON Web Tokens)
- **AI**: OpenAI API (GPT-3.5)
- **HTTP Client**: Axios
- **Styling**: Plain CSS (no dependencies)

---

## 🔧 Prerequisites

Before you start, make sure you have:

1. **Node.js** (v16+) and **npm** - [Download](https://nodejs.org/)
2. **Git** - [Download](https://git-scm.com/)
3. **MongoDB Atlas Account** - [Free account](https://www.mongodb.com/cloud/atlas)
4. **OpenAI Account** - [Sign up](https://platform.openai.com)

### Verify Installations

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

---

## 🛠️ Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:

- `express` - Web framework
- `mongoose` - MongoDB ORM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `express-validator` - Input validation
- `axios` - HTTP client for OpenAI

### Step 3: Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project and cluster
4. Click "Connect"
5. Choose "Drivers" and copy the connection string
6. It will look like: `mongodb+srv://username:password@cluster0.mongodb.net/notes-app?retryWrites=true&w=majority`

### Step 4: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Go to API Keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

### Step 5: Create `.env` File

In the `backend` directory, create a `.env` file:

```bash
# Copy from example
cp .env.example .env
```

Edit `.env` with your credentials:

```
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/notes-app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production_use_random_string
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=5000
NODE_ENV=development
```

⚠️ **Important**:

- `JWT_SECRET` should be a long random string (use a password generator)
- Never commit `.env` to Git
- Keep your API keys secret!

### Step 6: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:

```
╔════════════════════════════════════════╗
║  📝 MERN Notes App - Backend Server    ║
║  🚀 Running on http://localhost:5000    ║
║  🗄️  MongoDB: Connected                ║
║  🔐 JWT Auth: Enabled                  ║
║  🤖 OpenAI Integration: Enabled        ║
╚════════════════════════════════════════╝
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

The `.env.local` file should already exist. Verify it has:

```
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:

```
Local:   http://localhost:5173/
```

---

## 🏃 Running Locally

### Required: Both backend and frontend must be running

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 🧪 Testing the App

### 1. Access the App

Open your browser and go to: `http://localhost:5173`

### 2. Create an Account

- Click "Create one here" on the login page
- Fill in: Name, Email, Password
- Click "Sign Up"

### 3. Create a Note

- Type a title (e.g., "My First Note")
- Type content (e.g., "This is my first note using NotesAI...")
- Click "➕ Create Note"

### 4. Test AI Summary

- Click "🤖 Summarize" on your note
- Wait for OpenAI to generate a summary
- You should see the summary appear below the note

### 5. Test Other Features

- Click "Show more" to expand note content
- Click "🗑️ Delete" to delete a note (with confirmation)
- Click "Logout" to test authentication

### 6. Try Login

- Logout from the app
- Log in with your credentials
- You should see all your previously created notes

---

## 🌐 Deployment

### Backend Deployment (Render)

#### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: MERN Notes App"
git remote add origin https://github.com/yourusername/notes-app.git
git push -u origin main
```

#### Step 2: Deploy to Render

1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: notes-app-backend
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   OPENAI_API_KEY=your_openai_key
   NODE_ENV=production
   ```
7. Click "Deploy"

Your backend will be available at: `https://notes-app-backend.onrender.com`

### Frontend Deployment (Vercel)

#### Step 1: Build for Production

```bash
cd frontend
npm run build
```

#### Step 2: Deploy to Vercel

**Option A: Using CLI**

```bash
npm install -g vercel
vercel
```

**Option B: GitHub Integration**

1. Push frontend to GitHub (or same repo)
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Select GitHub repository
5. Vercel auto-detects Vite
6. Add Environment Variable:
   ```
   VITE_API_URL=https://notes-app-backend.onrender.com/api
   ```
7. Deploy

Your frontend will be available at: `https://notes-app.vercel.app` (example)

---

## 🐛 Troubleshooting

### Backend Issues

#### "Cannot find module 'mongoose'"

```bash
cd backend
npm install
```

#### "MongoDB connection error"

- Check MONGO_URI is correct
- Ensure MongoDB Atlas cluster is active
- Check IP whitelist: MongoDB Atlas → Security → Network Access → Allow 0.0.0.0
- Test connection string locally first

#### "Invalid OpenAI API key"

- Verify key starts with `sk-`
- Check key hasn't been revoked on OpenAI dashboard
- Ensure account has API credits

#### "CORS error in browser"

Backend should be running on `http://localhost:5000`

### Frontend Issues

#### "Cannot connect to backend"

```javascript
// Check in browser DevTools Console
// Expected: GET request to http://localhost:5000/api/health returns 200
```

#### "401 Unauthorized errors"

- Token might be expired → Logout and login again
- Check localStorage has 'token' key
- Clear localStorage: `localStorage.clear()`

#### "Module not found errors"

```bash
cd frontend
rm -rf node_modules
npm install
```

#### "Port 5173 already in use"

```bash
# Kill the process using port 5173 (Mac/Linux)
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Database Issues

#### "Duplicate key error"

You're trying to create a user with an email that already exists

- Use a different email for testing
- Or delete the duplicate in MongoDB

#### Notes not appearing after login

- Check the userId in notes matches logged-in user's ID
- Check notes are being saved with correct userId

---

## 📊 API Endpoints Reference

### Authentication

- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user

### Notes (Protected - require JWT)

- `GET /api/notes` - Get all user's notes
- `POST /api/notes` - Create new note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/summarize` - Generate AI summary

### Test with curl

```bash
# Health check
curl http://localhost:5000/api/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get notes (replace TOKEN with actual token)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/notes
```

---

## 🎓 Learning Resources

### Understanding the Code

**Backend Flow:**

1. User signs up → Password hashed with bcrypt → User created in DB
2. User logs in → Password verified → JWT token generated
3. User creates note → Token verified by auth middleware → Note saved
4. User requests summary → Note fetched → Sent to OpenAI → Summary saved

**Frontend Flow:**

1. User submits form → API call with Axios
2. Response stored in localStorage
3. Token auto-added to all requests via interceptor
4. Invalid tokens trigger logout

### Security Concepts

- **Password Hashing**: Bcrypt makes passwords unreadable
- **JWT Tokens**: Stateless authentication (no server sessions)
- **CORS**: Allows frontend and backend on different domains
- **Environment Variables**: Keep secrets out of code

---

## ✅ Production Checklist

- [ ] Backend running on production server (Render)
- [ ] Frontend running on production server (Vercel)
- [ ] Environment variables configured on both
- [ ] MONGO_URI points to production database
- [ ] JWT_SECRET is a strong random string
- [ ] OpenAI API key is valid and has credits
- [ ] Frontend VITE_API_URL points to production backend
- [ ] CORS allows production frontend URL
- [ ] All features tested on production
- [ ] Error handling working correctly
- [ ] Responsive design tested on mobile
- [ ] No console errors in production

---

## 🚀 Next Steps

After deployment:

1. Share the app with others
2. Collect feedback
3. Add features:
   - Pagination for notes
   - Tags/categories
   - Note sharing
   - Rich text editor
   - File upload
4. Monitor performance with monitoring tools
5. Regular backups of database

---

## 📧 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review error messages carefully
3. Check browser console (F12) for errors
4. Check server logs for API errors
5. Test with curl to isolate frontend/backend issues

Happy coding! 🎉
