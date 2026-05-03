# Notes App - Backend Documentation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/notes-app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=5000
NODE_ENV=development
```

### 3. Get MongoDB URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string: Copy the MongoDB URI and add it to `.env`

### 4. Get OpenAI API Key

1. Go to [OpenAI](https://platform.openai.com)
2. Sign up or login
3. Create API key in Account → API Keys
4. Add to `.env`

### 5. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Notes (Protected Routes - require JWT token)

- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/summarize` - Generate AI summary

## Common Issues & Fixes

### Issue: "Cannot find module 'dotenv'"

**Fix:** Run `npm install`

### Issue: "MongoError: connect ECONNREFUSED"

**Fix:**

- Check MONGO_URI is correct
- Ensure MongoDB Atlas cluster is active
- Check IP whitelist on MongoDB Atlas (allow 0.0.0.0)

### Issue: "Invalid token"

**Fix:** Token might be expired or malformed. User needs to login again.

### Issue: "OpenAI API Error 401"

**Fix:**

- Check OPENAI_API_KEY is correct
- Ensure account has credits
- Check API key has not been revoked

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Note Collection

```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  summary: String (optional),
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment to Render

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Set Build Command: `npm install`
6. Set Start Command: `npm start`
7. Add environment variables
8. Deploy

## Security Best Practices

✅ Passwords hashed with bcrypt
✅ JWT token-based authentication
✅ User data validation with express-validator
✅ CORS enabled
✅ Environment variables for sensitive data
✅ Input sanitization

## Performance Tips

- Indexes on frequently queried fields (userId, createdAt)
- Pagination can be added for notes (TODO)
- Caching layer with Redis (TODO)
- Rate limiting (TODO)
