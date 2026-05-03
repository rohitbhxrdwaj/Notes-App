# 🐛 Common Issues & Solutions

## Authentication Issues

### Issue: "Invalid token. Please login again."

**Cause:** Token is corrupted or secret key changed

**Solution:**

```javascript
// Clear localStorage and login again
localStorage.clear();
// Reload page
window.location.reload();
```

---

### Issue: "401 Unauthorized" on protected routes

**Cause:** Token not being sent with request

**Solution:**

```javascript
// Check token exists in localStorage
console.log(localStorage.getItem("token"));

// Verify Authorization header is being sent
// Open DevTools → Network → Check request headers
// Should have: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

### Issue: Token keeps expiring

**Cause:** Token expires after 7 days

**Solution:**

```javascript
// User must login again
// Or increase token expiration in backend:
jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "30d", // Changed from '7d'
});
```

---

## Database Issues

### Issue: "MongoDB connection refused"

**Cause:** Database not running or wrong connection string

**Checklist:**

```
□ Is MongoDB Atlas cluster running? (Check dashboard)
□ Is connection string correct? (Test locally first)
□ Did you use correct username and password?
□ Is IP address whitelisted? (Allow 0.0.0.0 for testing)
□ Is password URL-encoded if it has special characters?
  Example: password"123" → password%22123%25
```

---

### Issue: "E11000 duplicate key error"

**Cause:** Trying to create user with email that already exists

**Solution:**

```bash
# Option 1: Use different email
# Option 2: Delete duplicate in MongoDB
# In MongoDB Compass or Atlas:
# 1. Find users collection
# 2. Find duplicate email
# 3. Delete the document
# 4. Try again
```

---

### Issue: "Cannot read property '\_id' of null"

**Cause:** Querying non-existent user/note

**Solution:**

```javascript
// Always check if document exists before using
const user = await User.findById(userId);
if (!user) {
  return res.status(404).json({ message: "User not found" });
}
// Now safe to use user._id
```

---

## CORS Issues

### Issue: "Access to XMLHttpRequest has been blocked by CORS policy"

**Cause:** Frontend URL not allowed to access backend

**Solution:**

```javascript
// In backend/server.js
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      "https://your-vercel-url.vercel.app", // Production
    ],
    credentials: true,
  }),
);
```

---

### Issue: "Preflight request failed"

**Cause:** Browser blocking OPTIONS request

**Solution:**

```javascript
// Usually auto-handled by cors middleware
// Ensure cors() is called before routes:
app.use(cors());
app.use(express.json());
app.use("/api", routes);
```

---

## Frontend Issues

### Issue: "Cannot find module 'axios'"

**Solution:**

```bash
cd frontend
npm install axios
```

---

### Issue: "Vite port 5173 already in use"

**Solution:**

```bash
# Kill process using port 5173
# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

### Issue: "Blank page, nothing loads"

**Cause:** App.jsx has syntax errors

**Solution:**

```bash
# Check browser console (F12) for errors
# Common mistakes:
# - Missing imports
# - Incorrect component names
# - Typos in jsx

# Try:
npm run build  # See if compilation errors appear
```

---

### Issue: "All routes redirect to login"

**Cause:** User state not being set correctly

**Debug:**

```javascript
// In App.jsx useEffect
console.log("Stored user:", localStorage.getItem("user"));
console.log("Stored token:", localStorage.getItem("token"));
console.log("User state:", user);
```

---

## API Issues

### Issue: "400 Bad Request"

**Cause:** Invalid input data

**Solution:**

```javascript
// Check request body is valid
// Example for creating note:
{
  title: "My Note",        // Required, must be string
  content: "Content here"  // Required, must be string
}

// Check error message in response for details
```

---

### Issue: "500 Internal Server Error"

**Cause:** Server-side error

**Solution:**

```bash
# Check backend console for error logs
# Common causes:
# 1. Unhandled exception in route handler
# 2. Database query failed
# 3. OpenAI API call failed

# See backend console output
```

---

### Issue: "OpenAI API error 401"

**Cause:** Invalid or expired API key

**Solution:**

```bash
# 1. Verify key starts with "sk-"
# 2. Check key hasn't been revoked
# 3. Login to OpenAI and check account status
# 4. Try creating new key at platform.openai.com/api-keys
# 5. Update .env and restart server
```

---

### Issue: "OpenAI rate limit exceeded"

**Cause:** Made too many requests too quickly

**Solution:**

```javascript
// Add delay between requests in frontend
const handleSummarize = async () => {
  setIsSummarizing(true);
  // Wait 1 second before making request
  setTimeout(async () => {
    // Make API call
  }, 1000);
};
```

---

## Testing Issues

### Issue: "Notes not appearing after creation"

**Cause:** Notes created but not fetched

**Solution:**

```javascript
// After creating note, ensure useEffect runs to fetch
// Or manually add note to state:
const response = await notesAPI.createNote(data);
setNotes([response.data.note, ...notes]); // Add to beginning
```

---

### Issue: "Delete not working"

**Cause:** Frontend not updating after delete

**Solution:**

```javascript
// After delete, remove from state:
await notesAPI.deleteNote(noteId);
setNotes(notes.filter((n) => n._id !== noteId));
```

---

### Issue: "Summary not appearing"

**Cause:** API call failed or response not handled

**Solution:**

```javascript
// Check:
// 1. OpenAI API key is valid
// 2. Account has credits
// 3. Network request succeeded (check DevTools Network tab)
// 4. Response contains 'summary' field

// Add error handling:
try {
  const response = await notesAPI.summarizeNote(id);
  setSummary(response.data.summary);
} catch (error) {
  console.error("Error:", error.response?.data);
  setError("Failed to generate summary");
}
```

---

## Development Tips

### Enable Debug Mode

**Frontend:**

```javascript
// In api.js
API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data);
    return Promise.reject(error);
  },
);
```

**Backend:**

```javascript
// In routes/notes.js
router.post("/notes", async (req, res) => {
  console.log("Request body:", req.body);
  console.log("User ID:", req.userId);
  // ... rest of code
});
```

### Use Network Monitoring

```bash
# In browser DevTools:
1. Open Network tab
2. Clear existing requests
3. Perform action (create note, login, etc.)
4. Check request/response in Network tab
5. Look for:
   - Status code (200 = success, 400+ = error)
   - Request headers (Authorization present?)
   - Response body (error message?)
```

### Test with cURL

```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456"}'

# Get token from response, then test protected route:
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/notes
```

---

## Performance Issues

### Issue: App is slow

**Solutions:**

```javascript
// 1. Avoid unnecessary re-renders
useCallback(() => {
  // memoized function
}, [dependencies]);

// 2. Lazy load routes
const Dashboard = lazy(() => import("./pages/Dashboard"));

// 3. Optimize API calls
// Don't fetch on every keystroke, use debounce
```

---

### Issue: Notes load slowly

**Solution:**

```javascript
// Add pagination to backend:
router.get("/notes?page=1&limit=10", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const notes = await Note.find({ userId: req.userId })
    .skip((page - 1) * limit)
    .limit(limit);
});
```

---

## Getting Help

1. **Check the Logs**
   - Browser console (F12)
   - Backend server output
   - Database logs (MongoDB Atlas)

2. **Read Error Messages Carefully**
   - They usually tell you exactly what's wrong
   - Stack trace shows file and line number

3. **Use DevTools**
   - Network tab: see API requests
   - Console tab: see errors
   - Storage tab: check localStorage

4. **Search Online**
   - Copy exact error message into Google
   - Check Stack Overflow
   - Check GitHub issues

5. **Isolate the Problem**
   - Does it happen on both frontend and backend?
   - Can you reproduce it consistently?
   - Does it happen on specific data?

---

## Report a Bug

When reporting issues, include:

```
- Exact error message
- Steps to reproduce
- What you expected to happen
- What actually happened
- Browser/Node.js version
- Any code changes you made
- Screenshot if possible
```

---

Still stuck? Check:

- [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- Backend/Frontend README files
