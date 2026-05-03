# 📖 Project Structure Guide

## Full Directory Tree

```
notes-app/
│
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema with password hashing
│   │   └── Note.js              # Note schema with userId reference
│   │
│   ├── routes/
│   │   ├── auth.js              # Signup & login endpoints
│   │   └── notes.js             # CRUD + AI summarization endpoints
│   │
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   │
│   ├── server.js                # Main Express server
│   ├── package.json             # Backend dependencies
│   ├── .env.example             # Environment variable template
│   ├── .gitignore               # Files to ignore in Git
│   └── README.md                # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page component
│   │   │   ├── Signup.jsx       # Signup page component
│   │   │   ├── Dashboard.jsx    # Main notes dashboard
│   │   │   └── Auth.css         # Login/Signup styling
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation bar component
│   │   │   ├── Navbar.css       # Navbar styling
│   │   │   ├── NoteCard.jsx     # Individual note component
│   │   │   ├── NoteCard.css     # Note card styling
│   │   │   └── Dashboard.css    # Dashboard styling
│   │   │
│   │   ├── App.jsx              # Main app with routing
│   │   ├── App.css              # Global styles
│   │   ├── api.js               # Axios setup and API calls
│   │   └── main.jsx             # React entry point
│   │
│   ├── index.html               # HTML entry point
│   ├── vite.config.js           # Vite configuration
│   ├── package.json             # Frontend dependencies
│   ├── .env.local               # Frontend environment variables
│   ├── .gitignore               # Files to ignore in Git
│   └── README.md                # Frontend documentation
│
├── SETUP_GUIDE.md               # Complete setup instructions
├── QUICK_START.md               # 5-minute quick start
├── DEPLOYMENT_GUIDE.md          # Production deployment
├── ARCHITECTURE.md              # Code explanation & architecture
├── TROUBLESHOOTING.md           # Common issues & solutions
└── README.md                    # This file (overall docs)
```

## File Purposes

### Backend Files

#### `models/User.js`

- Defines MongoDB schema for users
- Includes password hashing middleware
- `matchPassword()` method for login verification

#### `models/Note.js`

- Defines MongoDB schema for notes
- Links notes to users via `userId`
- Includes database indexes for performance

#### `middleware/auth.js`

- Verifies JWT tokens
- Extracts user ID from token
- Protects routes from unauthorized access

#### `routes/auth.js`

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user and return token

#### `routes/notes.js`

- `GET /api/notes` - Get user's notes
- `POST /api/notes` - Create new note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/summarize` - Generate AI summary

#### `server.js`

- Initializes Express app
- Connects to MongoDB
- Sets up CORS
- Defines routes
- Starts server on port 5000

### Frontend Files

#### `src/api.js`

- Sets up Axios instance
- Configures base URL
- Adds request/response interceptors
- Exports API functions

#### `src/App.jsx`

- Main component with React Router
- Manages authentication state
- Protects routes
- Handles app-level logic

#### `src/pages/Login.jsx`

- Login form component
- Email and password inputs
- Validates and submits to backend
- Stores token on success

#### `src/pages/Signup.jsx`

- Signup form component
- Name, email, password inputs
- Client-side validation
- Creates account and auto-login

#### `src/pages/Dashboard.jsx`

- Main app after login
- Create note form
- List of user's notes
- Note management

#### `src/components/Navbar.jsx`

- Navigation bar (shown when logged in)
- Displays user name
- Logout button

#### `src/components/NoteCard.jsx`

- Individual note display
- Show/hide full content
- Summarize button
- Delete button with confirmation

---

## Data Flow

### Create Note Flow

```
User fills form
    ↓ (Dashboard.jsx)
Click "Create Note"
    ↓
API call (api.js)
    ↓
Backend receives POST /api/notes
    ↓
Auth middleware verifies token
    ↓
Route handler (routes/notes.js)
    ↓
Create note in MongoDB
    ↓
Return saved note
    ↓ (api.js response)
Frontend adds to notes list
    ↓ (Dashboard.jsx)
User sees new note
```

### AI Summarization Flow

```
User clicks "Summarize"
    ↓ (NoteCard.jsx)
API call (api.js)
    ↓
Backend POST /api/notes/:id/summarize
    ↓
Auth middleware verifies token
    ↓
Route handler:
  - Verify user owns note
  - Send to OpenAI API
  - Get summary back
  - Save to database
    ↓
Return summary
    ↓ (api.js)
Frontend displays summary
    ↓ (NoteCard.jsx)
```

---

## Component Hierarchy

```
<App>
├── <BrowserRouter>
│   ├── <Navbar/>  (shown only when logged in)
│   └── <Routes>
│       ├── /login      → <Login/>
│       ├── /signup     → <Signup/>
│       └── /           → <Dashboard/>
│           └── <NoteCard/> × N
│               ├── <button> Summarize
│               └── <button> Delete
```

---

## State Management

### App Level

```javascript
// App.jsx
const [user, setUser] = useState(null);
// Passed down to Navbar and Dashboard
```

### Page Level

```javascript
// Dashboard.jsx
const [notes, setNotes] = useState([]);
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [loading, setLoading] = useState(true);
```

### Component Level

```javascript
// NoteCard.jsx
const [isExpanded, setIsExpanded] = useState(false);
const [summary, setSummary] = useState(note.summary || null);
const [isSummarizing, setIsSummarizing] = useState(false);
```

---

## Database Schema

### Users Collection

```javascript
db.users.insertOne({
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$...", // bcrypt hash
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z"),
});
```

### Notes Collection

```javascript
db.notes.insertOne({
  _id: ObjectId("507f1f77bcf86cd799439012"),
  title: "My First Note",
  content: "This is the content of my note...",
  summary: "A concise summary of the note...", // optional
  userId: ObjectId("507f1f77bcf86cd799439011"), // reference to user
  createdAt: ISODate("2024-01-15T10:35:00Z"),
  updatedAt: ISODate("2024-01-15T10:35:00Z"),
});
```

---

## Configuration Files

### Backend .env

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
OPENAI_API_KEY=...
PORT=5000
NODE_ENV=development
```

### Frontend .env.local

```
VITE_API_URL=http://localhost:5000/api
```

### Vite Config

```javascript
// Auto-detects React
// Dev server on port 5173
// Proxy API requests to backend
```

---

## Key Technologies

### Backend Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ORM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **cors** - Cross-origin support
- **axios** - HTTP client (for OpenAI)
- **express-validator** - Input validation
- **dotenv** - Environment variables

### Frontend Dependencies

- **react** - UI library
- **react-dom** - React rendering
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **vite** - Build tool (dev only)

---

## Common File Modifications

### Add a new API endpoint

1. Create route handler in `routes/notes.js`
2. Add endpoint function in `src/api.js`
3. Call from component using `notesAPI.newFunction()`

### Add new route/page

1. Create component in `src/pages/NewPage.jsx`
2. Import in `src/App.jsx`
3. Add `<Route>` in `<Routes>`

### Style changes

- Global: `src/App.css`
- Component-specific: Component folder
- Use CSS Grid/Flexbox for layout

---

## Performance Considerations

- Database indexes on frequently queried fields
- Lazy loading for routes (future improvement)
- Memoization of components (future improvement)
- Pagination for large note lists (future improvement)

---

## Security Considerations

- Passwords hashed with bcrypt
- JWT token verification on protected routes
- Authorization checks (user can only access own notes)
- Input validation with express-validator
- Environment variables for secrets
- CORS enabled for frontend only

---

## Future Architecture Improvements

1. **Redux/Context API** - For complex state management
2. **Service Layer** - Abstract API calls
3. **Error Boundary** - Handle component errors
4. **Custom Hooks** - Reusable logic
5. **Testing** - Jest + React Testing Library
6. **TypeScript** - Type safety
7. **Logging** - Winston or Morgan
8. **Rate Limiting** - Prevent abuse

---

For detailed explanations, see [ARCHITECTURE.md](./ARCHITECTURE.md)
