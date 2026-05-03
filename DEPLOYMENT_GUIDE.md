# 🚀 Deployment Guide

Deploy NotesAI to production using Render (backend) and Vercel (frontend).

## Part 1: Backend Deployment (Render)

### Prerequisites

- GitHub account with code pushed
- Render account (free)
- MongoDB Atlas database
- OpenAI API key

### Step-by-Step

#### 1. Prepare Code for GitHub

```bash
# In your project root
git init
git add .
git commit -m "Initial commit: NotesAI"
git remote add origin https://github.com/yourusername/notes-app.git
git push -u origin main
```

#### 2. Deploy to Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub and select `notes-app` repository
4. Fill in details:
   - **Name**: `notes-app-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

5. Add Environment Variables (click "Add Environment Variable"):

   ```
   MONGO_URI = mongodb+srv://username:password@cluster0.mongodb.net/notes-app?retryWrites=true&w=majority
   JWT_SECRET = your-super-secret-key-here-change-this
   OPENAI_API_KEY = sk-your-openai-key-here
   NODE_ENV = production
   PORT = 10000
   ```

6. Click "Create Web Service"

⏱️ Deployment takes 2-5 minutes.

#### 3. Verify Backend Deployment

Your backend URL will be: `https://notes-app-backend.onrender.com`

Test it:

```bash
curl https://notes-app-backend.onrender.com/api/health
# Should return: {"status":"Server is running"}
```

---

## Part 2: Frontend Deployment (Vercel)

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? notes-app
# - Framework? Vite
# - Root directory? .
# - Environments? Add VITE_API_URL
```

### Option B: GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Select GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:

   ```
   VITE_API_URL = https://notes-app-backend.onrender.com/api
   ```

6. Click "Deploy"

Your frontend URL will be: `https://notes-app.vercel.app` (example)

---

## Part 3: Connect Frontend to Backend

After deploying both:

### Update Frontend Environment Variables

**On Vercel Dashboard:**

1. Go to Project Settings → Environment Variables
2. Update `VITE_API_URL`:
   ```
   https://notes-app-backend.onrender.com/api
   ```
3. Redeploy by pushing new code or clicking "Redeploy"

### Update Backend CORS Settings

Edit `backend/server.js`:

```javascript
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://notes-app.vercel.app" // Your Vercel URL
        : "http://localhost:5173",
    credentials: true,
  }),
);
```

Push this change to trigger a new build on Render.

---

## Part 4: Testing Production

1. Go to your frontend URL: `https://notes-app.vercel.app`
2. Create an account
3. Create a note
4. Test summarization
5. Logout and login

---

## Common Deployment Issues

### Render Backend Issues

**"Build failed"**

- Check build logs on Render dashboard
- Ensure `npm start` works locally: `NODE_ENV=production npm start`

**"Application failed to boot"**

- Check environment variables (especially MONGO_URI)
- MongoDB Atlas cluster might be sleeping → restart it
- Check logs on Render dashboard

**"Cannot connect to MongoDB"**

- MONGO_URI might be wrong
- IP whitelist might be restrictive
- MongoDB Atlas: Security → Network Access → Allow 0.0.0.0

### Vercel Frontend Issues

**"Cannot reach backend"**

- Check VITE_API_URL is correct
- Ensure backend is deployed and running
- Check browser console for CORS errors

**"Build failed"**

- Check build logs
- Ensure `npm run build` works locally

**"Blank page or 404 errors"**

- Check "Output Directory" is set to `dist`
- Ensure file paths use forward slashes

---

## Environment Variables Checklists

### Backend (.env on Render)

- [ ] MONGO_URI - Connection string from MongoDB Atlas
- [ ] JWT_SECRET - Long random string (32+ characters)
- [ ] OPENAI_API_KEY - Key from OpenAI (starts with `sk-`)
- [ ] NODE_ENV - Set to `production`
- [ ] PORT - Can be left blank (Render assigns it)

### Frontend (Vercel Environment Variables)

- [ ] VITE_API_URL - Backend production URL
  - Example: `https://notes-app-backend.onrender.com/api`

---

## Performance Optimization

### Backend (Render)

- Free tier sleeps after 15 minutes of inactivity
- For production, upgrade to paid plan (~$7/month)
- Monitor: Render Dashboard → Metrics

### Frontend (Vercel)

- Automatic optimization
- CDN enabled by default
- Analytics available in dashboard

---

## Database Backups

### MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. Click "Backup"
3. Create automated backups:
   - Cluster Tier > M2 (paid) enables automated backups
   - Free tier: manual snapshots only

### Best Practices

- Enable automatic backups before going live
- Test restore procedures
- Keep backup copies in secure location

---

## Monitoring & Maintenance

### Render

- Check status page: render.com/status
- Monitor logs: Dashboard → Logs
- Set up error notifications

### Vercel

- Check analytics: Dashboard → Analytics
- Monitor function logs
- Set up deployment notifications

### MongoDB

- Monitor query performance
- Check storage usage
- Enable slow query logs

---

## Security Checklist

- [ ] Never commit `.env` files to Git
- [ ] Use strong `JWT_SECRET` (32+ random characters)
- [ ] Rotate API keys regularly
- [ ] Enable HTTPS (automatic on Render & Vercel)
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Enable 2FA on all accounts
- [ ] Regular security audits

---

## Update Procedures

### Update Backend

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push origin main
# Render auto-deploys on push
```

### Update Frontend

```bash
cd frontend
# Make changes
git add .
git commit -m "Update feature X"
git push origin main
# Vercel auto-deploys on push
```

---

## Rollback Procedures

### Render

1. Dashboard → Logs
2. Find working deployment
3. Click three dots → Re-deploy

### Vercel

1. Dashboard → Deployments
2. Find working deployment
3. Click → Promote to Production

---

## Upgrade to Premium (Optional)

### Render

- Free tier: $0/month (sleeps after 15 min)
- Pro tier: $7/month (always on)
- [Pricing](https://render.com/pricing)

### Vercel

- Free tier: $0/month
- Pro tier: $20/month (advanced features)
- [Pricing](https://vercel.com/pricing)

### MongoDB

- Free tier: 512MB (good for testing)
- M0: $0/month (512MB)
- M10: $57/month (10GB)
- [Pricing](https://www.mongodb.com/cloud/atlas/pricing)

---

## Post-Deployment

1. Share your app with users
2. Monitor logs and performance
3. Collect user feedback
4. Plan features for next iteration
5. Consider adding:
   - Email notifications
   - Rate limiting
   - Pagination
   - Advanced search
   - User profile page

---

Need help? Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.
