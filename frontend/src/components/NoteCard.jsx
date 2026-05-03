/**
 * NoteCard Component
 *
 * Displays a single note with title, content, summary, and action buttons
 * Allows user to:
 * - View note content
 * - Generate AI summary
 * - Delete note
 */

import { useState } from "react";
import { notesAPI } from "../api";
import "./NoteCard.css";

export default function NoteCard({ note, onDelete, onSummaryGenerated }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [summary, setSummary] = useState(note.summary || null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle note deletion
   */
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await notesAPI.deleteNote(note._id);
        onDelete(note._id);
      } catch (err) {
        setError("Failed to delete note");
        console.error("Delete error:", err);
      }
    }
  };

  /**
   * Generate AI summary for the note
   */
  const handleSummarize = async () => {
    setIsSummarizing(true);
    setError(null);

    try {
      const response = await notesAPI.summarizeNote(note._id);
      const generatedSummary = response.data.summary;
      setSummary(generatedSummary);
      onSummaryGenerated(note._id, generatedSummary);
    } catch (err) {
      setError("Failed to generate summary. Check your OpenAI API key.");
      console.error("Summarize error:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Format date to readable format
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <span className="note-date">{formattedDate}</span>
      </div>

      {/* Note Preview or Full Content */}
      <div className="note-content">
        <p className={isExpanded ? "expanded" : "preview"}>
          {isExpanded
            ? note.content
            : note.content.substring(0, 150) +
              (note.content.length > 150 ? "..." : "")}
        </p>
        {note.content.length > 150 && (
          <button
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* AI Summary Section */}
      {summary && (
        <div className="summary-section">
          <h4>✨ AI Summary:</h4>
          <p className="summary-text">{summary}</p>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Action Buttons */}
      <div className="note-actions">
        <button
          className="summarize-btn"
          onClick={handleSummarize}
          disabled={isSummarizing}
        >
          {isSummarizing ? "🔄 Summarizing..." : "🤖 Summarize"}
        </button>
        <button className="delete-btn" onClick={handleDelete}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
