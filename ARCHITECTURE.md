# 📚 Code Explanation & Architecture

## Project Overview

NotesAI is a three-tier application:

- **Frontend** (React + Vite) - User interface
- **Backend** (Express.js) - API server
- **Database** (MongoDB) - Data storage

## Authentication Flow

```
User Signs Up
    ↓
Password hashed with bcrypt
    ↓
User saved to MongoDB
    ↓
JWT token generated
    ↓
Token sent to frontend
    ↓
Frontend stores token in localStorage
    ↓
Token sent with every request in Authorization header
    ↓
Backend verifies token with auth middleware
    ↓
Route handler executes (user is authenticated)
```

## Backend Architecture

### 1. User Model (`models/User.js`)

```javascript
// User schema structure
{
  _id: ObjectId,          // MongoDB auto-generated ID
  name: String,           // User's name
  email: String,          // Unique email
  password: String,       // Hashed password (NOT plain text)
  createdAt: Date,        // Auto-created by Mongoose
  updatedAt: Date         // Auto-updated by Mongoose
}
```

**Key Methods:**

- `save()` - Before saving, password is hashed automatically via pre-hook
- `matchPassword()` - Compares input password with hashed password

### 2. Note Model (`models/Note.js`)

```javascript
// Note schema structure
{
  _id: ObjectId,          // MongoDB auto-generated ID
  title: String,          // Note title
  content: String,        // Note content
  summary: String,        // AI-generated summary
  userId: ObjectId,       // Reference to User (ownership)
  createdAt: Date,        // Auto-created
  updatedAt: Date         // Auto-updated
}
```

**Key Feature:** `userId` field links notes to specific user (privacy)

### 3. Auth Middleware (`middleware/auth.js`)

Runs before protected routes:

```javascript
// 1. Extract token from header
const token = req.headers.authorization?.split(" ")[1];
// Authorization: "Bearer eyJhbGciOiJIUzI1NiIs..."
//                           ↑ We extract this part

// 2. Verify token with secret key
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 3. Attach user ID to request
req.userId = decoded.id;
// Now route handler can access req.userId
```

### 4. Auth Routes (`routes/auth.js`)

**Signup Endpoint:**

```
POST /api/auth/signup
Body: { name, email, password }
Response: { token, user }
```

**Process:**

1. Validate input (name, email format, password length)
2. Check if email already exists
3. Create new user (password auto-hashes)
4. Generate JWT token (valid 7 days)
5. Return token and user info

**Login Endpoint:**

```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

**Process:**

1. Validate input
2. Find user by email
3. Compare passwords with bcrypt
4. Generate JWT token
5. Return token and user info

### 5. Notes Routes (`routes/notes.js`)

**Get All Notes:**

```
GET /api/notes
Headers: { Authorization: "Bearer token" }
Response: { notes: [...] }
```

**Create Note:**

```
POST /api/notes
Headers: { Authorization: "Bearer token" }
Body: { title, content }
Response: { note }
```

**Delete Note:**

```
DELETE /api/notes/:id
Headers: { Authorization: "Bearer token" }
Response: { success: true }
```

**Summarize Note:**

```
POST /api/notes/:id/summarize
Headers: { Authorization: "Bearer token" }
Process:
  1. Verify user owns the note
  2. Send note content to OpenAI API
  3. Get summary from OpenAI
  4. Save summary to database
  5. Return summary to frontend
Response: { summary }
```

---

## Frontend Architecture

### 1. API Setup (`src/api.js`)

**Axios Instance:**

```javascript
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request Interceptor: Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

**Why Interceptors?**

- DRY principle: No need to add token manually to every request
- Centralized error handling: All 401 errors handled in one place

### 2. App Component (`src/App.jsx`)

**Purpose:** Main router and authentication state

```javascript
// Check if user is logged in on app load
useEffect(() => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  if (user && token) {
    setUser(JSON.parse(user));
  }
}, []);

// Routes:
// /login → Login page (only if not logged in)
// /signup → Signup page (only if not logged in)
// / → Dashboard (only if logged in)
```

### 3. Authentication Pages

**Login Flow:**

```
User enters email & password
    ↓
Click "Login"
    ↓
API call: POST /api/auth/login
    ↓
Backend returns token + user
    ↓
Store in localStorage
    ↓
Update state
    ↓
Redirect to dashboard
```

**Signup Flow:**

```
User enters name, email, password
    ↓
Validate (password length, match, etc.)
    ↓
Click "Sign Up"
    ↓
API call: POST /api/auth/signup
    ↓
Backend returns token + user
    ↓
Store in localStorage
    ↓
Redirect to dashboard
```

### 4. Dashboard (`src/pages/Dashboard.jsx`)

**Features:**

1. **Create Note Form:**
   - Input validation
   - API call to create note
   - Update UI with new note
   - Clear form fields

2. **Notes List:**
   - Fetch notes on component mount
   - Display in reverse chronological order
   - Show empty state if no notes

3. **Note Card (`src/components/NoteCard.jsx`):**
   - Display note title, content, date
   - Show/hide full content (expand button)
   - Delete button with confirmation
   - Summarize button that calls AI

### 5. Navbar (`src/components/Navbar.jsx`)

```javascript
// Shows when user is logged in
// Displays:
// - App title
// - User's name
// - Logout button

// On logout:
// 1. Clear token from localStorage
// 2. Clear user data from localStorage
// 3. Redirect to login page
```

---

## Data Flow Diagram

```
Frontend                          Backend                    Database
────────────────────────────────────────────────────────────────────

[Signup Form]
     │
     ├─→ POST /auth/signup
     │         │
     │         └─→ Validate
     │              │
     │              ├─→ Check email exists
     │              │
     │              └─→ Hash password (bcrypt)
     │                   │
     │                   └─→ Save to MongoDB ←──────────┐
     │                                                  │
     │                   Generate JWT token            [User Collection]
     │                        │
     │    ←────────────────────┴──────────────
     │    (token + user)
     │
[Store token in localStorage]
[Store user info in localStorage]
[Redirect to dashboard]


[Create Note Form]
     │
     ├─→ POST /notes (with token in header)
     │         │
     │    [Auth Middleware]
     │    Verify token
     │         │
     │         └─→ Extract userId from token
     │              │
     │              ├─→ Create note with userId
     │              │
     │              └─→ Save to MongoDB ←──────────────┐
     │                                                  │
     │    ←────────────────────────────────────────────┴──
     │    (saved note)
     │
[Add note to UI]


[Click Summarize]
     │
     ├─→ POST /notes/:id/summarize (with token)
     │         │
     │    [Auth Middleware]
     │    Verify token & ownership
     │         │
     │         ├─→ Fetch note from MongoDB
     │         │
     │         └─→ Call OpenAI API ←───────────────┐
     │              │                              │
     │              └─→ Get summary            [OpenAI Server]
     │                   │
     │                   └─→ Save to MongoDB
     │
     │    ←────────────────────────────
     │    (summary)
     │
[Display summary in UI]
```

---

## Security Implementation

### 1. Password Security

- Passwords hashed with bcrypt (one-way encryption)
- Even database admins can't see plain passwords
- Passwords never logged or transmitted in plain text

### 2. JWT Authentication

- Token is signed with secret key
- Cannot be forged without the secret
- Token expires after 7 days
- Prevents unauthorized access to protected routes

### 3. Authorization

- Each note has `userId` field
- Users can only access/delete their own notes
- Backend verifies ownership before operations

### 4. CORS

- Restricts which domains can access backend
- Frontend must be whitelisted

---

## Error Handling Strategy

### Frontend

```javascript
try {
  const response = await API.post("/notes", { title, content });
  // Success: update UI
} catch (error) {
  if (error.response?.status === 400) {
    // Validation error: show to user
    setError(error.response.data.message);
  } else if (error.response?.status === 401) {
    // Unauthorized: interceptor handles (redirects to login)
  } else {
    // Other error: show generic message
    setError("An error occurred. Please try again.");
  }
}
```

### Backend

```javascript
try {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors });
  }

  // Perform operation
  const user = await User.findOne({ email });

  // Handle not found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Success response
  res.json({ success: true, data });
} catch (error) {
  // Unexpected error
  res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });
}
```

---

## Performance Considerations

### Database Indexes

```javascript
// In Note schema:
noteSchema.index({ userId: 1, createdAt: -1 });
// Allows fast query: db.notes.find({ userId }).sort({ createdAt: -1 })
```

### API Response Structure

```javascript
{
  success: true,           // Indicates success/failure
  message: "...",         // Human-readable message
  data: { ... },          // Actual data
  errors: [ ... ]         // Validation errors (if any)
}
```

### Frontend Optimization

- State management with React hooks
- Efficient re-renders (no unnecessary updates)
- Loading states prevent multiple submissions
- Client-side validation reduces server requests

---

## Common Patterns Used

### 1. Middleware Pattern

Authentication middleware checks token before route handler runs

### 2. Model-View-Controller (MVC)

- **Model**: User.js, Note.js (database schema)
- **View**: React components (UI)
- **Controller**: Route handlers (business logic)

### 3. Interceptor Pattern

Axios interceptors handle repetitive tasks (adding token, error handling)

### 4. Protected Routes

Frontend and backend both protect routes:

- Frontend: Only show routes if logged in
- Backend: Check token before accessing data

---

## Future Improvements

1. **Pagination**: Load notes in batches instead of all at once
2. **Search**: Full-text search for notes
3. **Tags**: Categorize notes with tags
4. **Sharing**: Share notes with other users
5. **Rich Text**: Use rich text editor instead of plain textarea
6. **Offline Mode**: Service workers for offline access
7. **WebSockets**: Real-time updates
8. **Cloud Storage**: Image/file upload
9. **Notifications**: Email notifications for shared notes
10. **Analytics**: Track note creation patterns

---

This architecture is production-ready and follows industry best practices! 🚀
