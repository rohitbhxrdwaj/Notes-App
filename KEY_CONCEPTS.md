# 🎓 Key Concepts Explained

## 1. JWT Authentication

### What is JWT?

JWT (JSON Web Token) is a way to securely transmit information between client and server.

**Token Structure:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiIsImlhdCI6MTUxNjIzOTAyMn0.signature
│                                            │                                                    │
└── Header (algorithm)                       └── Payload (user data)                           └── Signature (proof)
```

### How It Works

```
1. User logs in
   ↓
2. Backend verifies password
   ↓
3. Backend creates token: jwt.sign({ id: user._id }, secret)
   ↓
4. Token sent to frontend
   ↓
5. Frontend stores token
   ↓
6. On next request, frontend sends: Authorization: Bearer <token>
   ↓
7. Backend verifies token with same secret
   ↓
8. Backend knows it's the same user (ID is in token)
```

### Backend Example

```javascript
const jwt = require("jsonwebtoken");

// Create token after login
const token = jwt.sign(
  { id: user._id }, // Payload (user data)
  process.env.JWT_SECRET, // Secret key
  { expiresIn: "7d" }, // Token expires in 7 days
);

// Verify token from request
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded.id); // Get user ID from token
```

### Frontend Example

```javascript
// Store token after login
localStorage.setItem("token", token);

// Send token with requests
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// Or add via interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 2. Password Hashing with Bcrypt

### Why Hash Passwords?

If database is stolen, hackers can't read user passwords.

```
Plain: "password123"
Hashed: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/U1O"

Even with hashed password, can't reverse it → $2a$10$...
```

### How It Works

```javascript
const bcrypt = require("bcryptjs");

// Hash password before saving
const salt = await bcrypt.genSalt(10); // Generate randomness
const hashed = await bcrypt.hash(password, salt);
// hashed = "$2a$10$..." (different every time)

// Later, verify password on login
const isMatch = await bcrypt.compare(
  "user_entered_password",
  hashedPasswordFromDB,
);
// Returns true/false
```

### Mongoose Hook Example

```javascript
userSchema.pre("save", async function (next) {
  // Only hash if password is modified
  if (!this.isModified("password")) {
    next();
  }

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Now when you do: user.save()
// Password is automatically hashed!
```

---

## 3. Middleware

### What is Middleware?

Functions that run before route handlers.

```
Request
  ↓
Middleware 1 ← Can modify request or stop it
  ↓
Middleware 2
  ↓
Route Handler
  ↓
Response
```

### Express Middleware Example

```javascript
// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next(); // Continue to next middleware
});

// Auth middleware
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next(); // Continue with user ID attached to request
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Now route handlers have access to req.userId
app.get('/api/notes', (req, res) => {
  // req.userId is available!
  const notes = await Note.find({ userId: req.userId });
});
```

---

## 4. Mongoose Schema & Models

### Schema = Structure

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Must provide value
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users with same email
    match: /^[\w.-]+@[\w.-]+\.\w+$/, // Email format
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Don't include in queries by default
  },
});
```

### Model = Database Interaction

```javascript
const User = mongoose.model("User", userSchema);

// Create
const user = new User({ name, email, password });
await user.save();

// Read
const user = await User.findById(id);
const users = await User.find({ email });

// Update
await User.findByIdAndUpdate(id, { name: "New Name" });

// Delete
await User.findByIdAndDelete(id);
```

---

## 5. Axios Interceptors

### Request Interceptor

Modifies every outgoing request.

```javascript
// Before: Manual token for every request
// ❌ Tedious
axios.post("/api/notes", data, {
  headers: { Authorization: `Bearer ${token}` },
});

// After: Automatic via interceptor
// ✅ Clean
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Now every request automatically has token!
axios.post("/api/notes", data);
```

### Response Interceptor

Handles responses globally.

```javascript
API.interceptors.response.use(
  (response) => response, // Success: just return
  (error) => {
    // On 401, logout user automatically
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

---

## 6. React Hooks

### useState

Store component state.

```javascript
const [notes, setNotes] = useState([]);
// Initial value: []
// notes: current value
// setNotes: function to update value

// Update state
setNotes([...notes, newNote]); // Add note
setNotes(notes.filter((n) => n._id !== id)); // Remove note
```

### useEffect

Run code after component renders.

```javascript
// Run once on mount (fetch data)
useEffect(() => {
  fetchNotes();
}, []); // Empty dependency array = run once

// Run when dependency changes
useEffect(() => {
  console.log("User changed:", user);
}, [user]); // Run when user changes

// Run after every render
useEffect(() => {
  document.title = `Notes (${notes.length})`;
}); // No dependency array = run every time
```

### useNavigate

Navigate to different routes.

```javascript
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Go to login page
  };
};
```

---

## 7. Async/Await

### What is Async?

Handle long-running operations (API calls, database queries).

```javascript
// Without async/await (callbacks)
// ❌ Hard to read
function getUser() {
  User.findById(id, (error, user) => {
    if (error) {
      console.error(error);
    } else {
      console.log(user);
    }
  });
}

// With async/await
// ✅ Reads like synchronous code
async function getUser() {
  try {
    const user = await User.findById(id);
    console.log(user);
  } catch (error) {
    console.error(error);
  }
}
```

### Usage in Frontend

```javascript
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // Wait for API response
    const response = await authAPI.login({ email, password });

    // Extract token
    const { token } = response.data;

    // Store token
    localStorage.setItem("token", token);

    // Redirect
    navigate("/");
  } catch (error) {
    setError(error.response?.data?.message || "Login failed");
  }
};
```

---

## 8. REST API Design

### What is REST?

Standard way to design APIs using HTTP methods.

```
GET    /api/users/:id      Read one
GET    /api/users          Read all
POST   /api/users          Create
PUT    /api/users/:id      Update
DELETE /api/users/:id      Delete
```

### Request/Response Format

```javascript
// Request
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Note",
  "content": "Content here"
}

// Response (201 Created)
{
  "success": true,
  "message": "Note created",
  "note": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My Note",
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:35:00Z"
  }
}

// Error Response (400 Bad Request)
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "title", "message": "Title is required" }
  ]
}
```

---

## 9. CORS

### What is CORS?

Browser protection: JavaScript can't access data from different origins.

```javascript
// Without CORS:
// Frontend: http://localhost:3000
// Backend: http://localhost:5000
// ❌ Browser blocks all requests

// With CORS:
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
// ✅ Frontend can now access backend
```

### CORS Headers

```
Request from frontend:
Host: http://localhost:3000

Backend responds with:
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, DELETE

Browser sees these headers and allows the response
```

---

## 10. Error Handling

### Pattern

```javascript
try {
  // Attempt operation
  const user = await User.findById(userId);

  if (!user) {
    // Handle not found
    return res.status(404).json({ message: "User not found" });
  }

  // Success response
  res.json({ success: true, user });
} catch (error) {
  // Handle unexpected error
  console.error("Error:", error);
  res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });
}
```

### HTTP Status Codes

```
200 - OK (success)
201 - Created (created new resource)
400 - Bad Request (invalid input)
401 - Unauthorized (no token or invalid token)
403 - Forbidden (token valid but no permission)
404 - Not Found (resource doesn't exist)
500 - Internal Server Error (server error)
```

---

## 11. Modular Code

### Why Modular?

```javascript
// ❌ Bad: Everything in one file
// Thousands of lines
// Hard to find code
// Hard to test
// Hard to reuse

// ✅ Good: Separated into modules
backend/
  models/User.js    (only schema)
  routes/auth.js    (only auth endpoints)
  middleware/auth.js (only auth middleware)
  server.js         (only setup)

// Benefits:
// - Easy to find
// - Easy to test
// - Easy to reuse
// - Easy to maintain
```

---

## 12. Environment Variables

### Why?

```javascript
// ❌ Bad: Secrets in code
const mongoUri = 'mongodb+srv://username:password@...';
const apiKey = 'sk-your-api-key';

// If you push to GitHub, hackers see secrets!

// ✅ Good: Secrets in .env
// .env
MONGO_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...

// .gitignore
.env

// Code
require('dotenv').config();
const mongoUri = process.env.MONGO_URI;
```

### Production Env Variables

```
Development (.env):
MONGO_URI=mongodb://localhost
API_URL=http://localhost:3000

Production (Render/Vercel):
MONGO_URI=mongodb+srv://production@...
API_URL=https://yourapp.com
```

---

## 13. Database Relationships

### One-to-Many

One user has many notes.

```javascript
// Note schema
{
  title: String,
  userId: ObjectId,  // References User
}

// Query user's notes
const notes = await Note.find({ userId: userId });
```

### Many-to-Many

Many notes can have many tags.

```javascript
// Would require junction table
// notes_tags collection
{
  noteId: ObjectId,
  tagId: ObjectId
}
```

---

## 14. State Management

### Local State (Single Component)

```javascript
const [name, setName] = useState("");
// Private to this component
```

### Shared State (Multiple Components)

```javascript
// Pass down from parent
const [user, setUser] = useState(null);
return <Navbar user={user} />;

// Receive in child
const Navbar = ({ user }) => {
  return <span>{user.name}</span>;
};
```

### Global State (Future Improvement)

```javascript
// Redux or Context API
// Needed when many components need same data
const [user, setUser] = useContext(UserContext);
```

---

## 15. Performance Tips

### Frontend

```javascript
// ❌ Refetch every time
useEffect(() => {
  fetchNotes();
}, []); // This is good!

// ❌ Bad: Refetch on every render
useEffect(() => {
  fetchNotes();
}); // No dependency array!

// ✅ Memoize functions
const handleDelete = useCallback((id) => {
  deleteNote(id);
}, []);

// ✅ Lazy load routes
const Dashboard = lazy(() => import("./Dashboard"));
```

### Backend

```javascript
// ✅ Add database indexes
noteSchema.index({ userId: 1, createdAt: -1 });
// Much faster queries!

// ✅ Limit fields in response
User.find().select("name email"); // Don't return password

// ✅ Pagination
Note.find({ userId })
  .skip((page - 1) * limit)
  .limit(limit);
```

---

## Quick Reference

| Concept    | Frontend     | Backend            |
| ---------- | ------------ | ------------------ |
| HTTP       | Axios        | Express            |
| Routing    | React Router | Express Routes     |
| Auth       | localStorage | JWT + Middleware   |
| State      | useState     | req.userId         |
| DB         | N/A          | MongoDB + Mongoose |
| Validation | Client-side  | express-validator  |
| Error      | try/catch    | try/catch          |
| Async      | async/await  | async/await        |

---

For practical examples, see:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Code examples
- Backend/Frontend README files - File-specific explanations
