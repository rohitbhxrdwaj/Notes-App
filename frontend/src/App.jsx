/**
 * Main App Component
 *
 * Handles:
 * - Routing between pages (Login, Signup, Dashboard)
 * - Authentication state management
 * - Protected routes
 * - Token verification on app load
 */

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize app by checking if user is already logged in
   * This runs once when component mounts
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Show navbar only when user is logged in */}
      {user && <Navbar user={user} onLogout={handleLogout} />}

      <Routes>
        {/* Login Page - redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
        />

        {/* Signup Page - redirect to dashboard if already logged in */}
        <Route
          path="/signup"
          element={
            user ? <Navigate to="/" /> : <Signup onLogin={handleLogin} />
          }
        />

        {/* Dashboard Page - only accessible when logged in */}
        <Route
          path="/"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
