# 🎯 Quick Start Guide

Get NotesAI running in 5 minutes!

## Prerequisites

- Node.js (v16+)
- MongoDB Atlas account (free)
- OpenAI account with API key (free trial available)

## Backend Setup (5 min)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env and add:
# - MONGO_URI (from MongoDB Atlas)
# - JWT_SECRET (any random string)
# - OPENAI_API_KEY (from OpenAI)

# Start server
npm run dev
# Should show: 🚀 Running on http://localhost:5000
```

## Frontend Setup (3 min)

```bash
# In another terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# Should show: Local: http://localhost:5173/
```

## Test It!

1. Open `http://localhost:5173` in your browser
2. Click "Create one here" to sign up
3. Create a note
4. Click "🤖 Summarize" to generate AI summary
5. Done! 🎉

## Where to Get Credentials

### MongoDB URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account → Create cluster → Get connection string
3. Replace `password` with your password in the connection string

### OpenAI API Key

1. Go to [OpenAI](https://platform.openai.com)
2. Sign up → API Keys → Create new key
3. Copy the key (starts with `sk-`)

### JWT_SECRET

Any random string, e.g.:

```
my_super_secret_key_12345!@#$%
```

## Troubleshooting

**Backend won't connect to MongoDB?**

- Check connection string in `.env`
- Allow `0.0.0.0` in MongoDB Atlas Network Access
- Verify password doesn't have special characters (or URL encode them)

**Frontend shows "Cannot connect to backend"?**

- Ensure backend is running on port 5000
- Check browser console (F12) for CORS errors

**401 Unauthorized errors?**

- Logout and login again
- Token might be expired

---

For detailed setup, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

For deployment, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
