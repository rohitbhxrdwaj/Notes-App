# NotesAI - Full-Stack MERN Application

A modern, production-ready notes application with AI-powered summarization using OpenAI.

## ✨ Features

✅ **User Authentication**

- Secure signup and login with JWT
- Password hashing with bcrypt
- Protected routes

✅ **Note Management**

- Create, read, and delete notes
- User-specific notes (privacy)
- Chronological sorting

✅ **AI Summarization**

- One-click AI summaries using OpenAI GPT-3.5
- Summaries saved to database
- Automatic error handling

✅ **Modern UI**

- Clean, responsive design
- Mobile-friendly interface
- Smooth animations and transitions
- No external UI libraries (pure CSS)

✅ **Production Ready**

- Error handling and validation
- Security best practices
- Environment variable configuration
- Deployment guides included

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Add your credentials to .env

# Frontend
cd frontend
npm install
```

### 2. Start Development Servers

```bash
# Terminal 1: Backend (port 5000)
cd backend && npm run dev

# Terminal 2: Frontend (port 5173)
cd frontend && npm run dev
```

### 3. Open App

Visit `http://localhost:5173` and create an account!

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed instructions
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Code explanation
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - File organization

## 🛠️ Tech Stack

**Frontend:** React 18 + Vite + Axios
**Backend:** Node.js + Express + MongoDB
**Auth:** JWT (JSON Web Tokens)
**AI:** OpenAI API (GPT-3.5)
**Database:** MongoDB Atlas

## 📋 Requirements

- Node.js v16+
- MongoDB Atlas account (free)
- OpenAI API key (free trial available)

## 🏗️ Project Structure

```
notes-app/
├── backend/           # Express server + MongoDB
├── frontend/          # React + Vite app
└── docs/             # Documentation files
```

## 🌐 Deployment

**Backend:** Render (render.com)
**Frontend:** Vercel (vercel.com)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for instructions.

## 🔒 Security Features

- Passwords hashed with bcrypt
- JWT token authentication
- CORS protection
- Input validation
- Authorization checks
- Environment variable secrets

## 📖 Learning Resources

This project is great for learning:

- Full-stack JavaScript development
- REST API design
- Database modeling with Mongoose
- JWT authentication
- React hooks and routing
- Modern web development best practices

## 🤝 Contributing

This is a personal learning project. Feel free to fork and modify!

## 📝 License

MIT License - feel free to use this project for portfolio or learning.

## 🆘 Need Help?

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review error messages in browser console (F12)
3. Check backend server output
4. See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed help

---

**Ready to get started?** → [QUICK_START.md](./QUICK_START.md)

**Questions about the code?** → [ARCHITECTURE.md](./ARCHITECTURE.md)

**Deploying to production?** → [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
