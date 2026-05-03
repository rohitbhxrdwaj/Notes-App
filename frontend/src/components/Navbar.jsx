/**
 * Navbar Component
 *
 * Displays navigation bar with user info and logout button
 * Only visible when user is logged in
 */

import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Call parent logout handler
    onLogout();

    // Redirect to login
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>📝 NotesAI</h1>
          <p>AI-Powered Note Taking</p>
        </div>

        {user && (
          <div className="navbar-user">
            <span className="user-name">Welcome, {user.name}!</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
