/**
 * Dashboard Page
 *
 * Main page where authenticated users can:
 * - View all their notes
 * - Create new notes
 * - Delete notes
 * - Generate AI summaries
 */

import { useEffect, useState } from "react";
import { notesAPI } from "../api";
import NoteCard from "../components/NoteCard";
import "./Dashboard.css";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /**
   * Fetch all notes for the logged-in user
   * Runs once on component mount
   */
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getAllNotes();
      setNotes(response.data.notes);
      setError("");
    } catch (err) {
      setError("Failed to fetch notes. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle note creation
   */
  const handleCreateNote = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!title.trim() || !content.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await notesAPI.createNote({
        title: title.trim(),
        content: content.trim(),
      });

      // Add new note to the beginning of the list
      setNotes([response.data.note, ...notes]);

      // Clear form
      setTitle("");
      setContent("");
    } catch (err) {
      setError("Failed to create note. Please try again.");
      console.error("Create error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle note deletion
   */
  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter((note) => note._id !== noteId));
  };

  /**
   * Handle summary generation
   */
  const handleSummaryGenerated = (noteId, summary) => {
    // Update the note with new summary
    setNotes(
      notes.map((note) => (note._id === noteId ? { ...note, summary } : note)),
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Create Note Form */}
        <div className="create-note-section">
          <h2>✏️ Create New Note</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleCreateNote} className="note-form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="note-input"
              disabled={submitting}
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here... (You can summarize it with AI later!)"
              className="note-textarea"
              rows="5"
              disabled={submitting}
            />

            <button type="submit" className="create-btn" disabled={submitting}>
              {submitting ? "📝 Creating..." : "➕ Create Note"}
            </button>
          </form>
        </div>

        {/* Notes List */}
        <div className="notes-section">
          <h2>📚 Your Notes ({notes.length})</h2>

          {loading ? (
            <div className="loading-state">
              <p>Loading your notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <p>📭 No notes yet. Create your first note above!</p>
            </div>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onSummaryGenerated={handleSummaryGenerated}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
