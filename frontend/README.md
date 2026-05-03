# Notes App - Frontend Documentation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file (or update the existing one):

```
VITE_API_URL=http://localhost:5000/api
```

For production (e.g., Vercel):

```
VITE_API_URL=https://your-backend-url.com/api
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Project Structure

```
frontend/src/
├── App.jsx              # Main app component with routing
├── api.js               # Axios setup and API endpoints
├── main.jsx             # React entry point
├── pages/
│   ├── Login.jsx        # Login page
│   ├── Signup.jsx       # Signup page
│   ├── Dashboard.jsx    # Main dashboard
│   └── Auth.css         # Auth pages styling
├── components/
│   ├── Navbar.jsx       # Navigation bar
│   ├── NoteCard.jsx     # Individual note card
│   ├── Navbar.css       # Navbar styling
│   └── NoteCard.css     # Note card styling
└── App.css              # Main app styling
```

## Key Features Explained

### Authentication Flow

1. User signs up/logs in
2. Backend returns JWT token
3. Token stored in `localStorage`
4. Token auto-sent with every API request via interceptor
5. On 401 (unauthorized), token cleared and user redirected to login

### Protected Routes

- Login & Signup pages redirect to dashboard if already logged in
- Dashboard only accessible with valid JWT token
- Invalid/expired tokens trigger automatic logout

### API Integration

- `api.js` provides centralized API setup
- All requests automatically include Authorization header
- Error handling for common API issues
- Response interceptor handles 401 errors

### Note Management

- Create notes with title and content
- Delete notes with confirmation
- View all user notes (most recent first)
- Generate AI summaries with one click

## Common Issues & Fixes

### Issue: "Cannot connect to backend"

**Fix:**

- Ensure backend is running on port 5000
- Check VITE_API_URL in .env.local
- Check CORS settings in backend

### Issue: "401 Unauthorized" on every request

**Fix:**

- Token might be expired. User needs to login again
- Check if token exists in localStorage
- Verify JWT_SECRET matches between frontend and backend

### Issue: "Module not found" errors

**Fix:**

- Run `npm install`
- Clear node_modules: `rm -rf node_modules && npm install`

### Issue: Vite dev server won't start

**Fix:**

- Port 5173 might be in use
- Change port in vite.config.js
- Kill process: `lsof -ti:5173 | xargs kill -9` (Mac/Linux)

## Browser DevTools Tips

1. **Network Tab**: Monitor API requests and responses
2. **Console**: Check for errors and logs
3. **Application Tab**: View localStorage (token and user data)
4. **Vue DevTools**: Install for React debugging (search "React DevTools")

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Select GitHub repository
5. Vercel auto-detects Vite configuration
6. Add Environment Variables
7. Deploy

### Environment Variables on Vercel

Add in Project Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.com/api
```

## Production Checklist

- [ ] Backend deployed and running
- [ ] VITE_API_URL points to production backend
- [ ] JWT tokens working correctly
- [ ] OpenAI API key configured on backend
- [ ] CORS settings allow production frontend URL
- [ ] No console errors in production build
- [ ] Responsive design tested on mobile
- [ ] All authentication flows tested

## Performance Optimization

✅ Code splitting (React lazy loading)
✅ CSS minification (Vite auto)
✅ Image optimization (use lighter formats)
✅ Efficient re-renders (React hooks)

Future improvements:

- Add pagination for notes list
- Implement caching (LocalStorage)
- Service Worker for offline support
- Image/file upload support
