const express = require('express');
const axios = require('axios');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route   GET /api/notes
 * @desc    Get all notes for the logged-in user
 * @access  Private (requires authentication)
 * @returns { success, notes }
 */
router.get('/', async (req, res) => {
  try {
    // Fetch all notes for the current user, sorted by newest first
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Notes fetched successfully',
      notes,
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 * @access  Private (requires authentication)
 * @body    { title, content }
 * @returns { success, note }
 */
router.post(
  '/',
  [
    body('title', 'Title is required').trim().notEmpty(),
    body('content', 'Content is required').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array(),
        });
      }

      const { title, content } = req.body;

      // Create new note with current user's ID
      const note = new Note({
        title,
        content,
        userId: req.userId,
      });

      await note.save();

      res.status(201).json({
        success: true,
        message: 'Note created successfully',
        note,
      });
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating note',
        error: error.message,
      });
    }
  }
);

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note by ID
 * @access  Private (requires authentication)
 * @param   id - Note ID
 * @returns { success, message }
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find note and verify it belongs to the user
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Verify note belongs to the logged-in user
    if (note.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete your own notes.',
      });
    }

    // Delete the note
    await Note.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting note',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/notes/:id/summarize
 * @desc    Generate AI summary for a note using OpenAI
 * @access  Private (requires authentication)
 * @param   id - Note ID
 * @returns { success, summary }
 */
router.post('/:id/summarize', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the note
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Verify note belongs to the logged-in user
    if (note.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only summarize your own notes.',
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured',
      });
    }

    // Call OpenAI API to generate summary
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that creates concise summaries of text. Keep summaries to 2-3 sentences.',
          },
          {
            role: 'user',
            content: `Please summarize the following note:\n\n${note.content}`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Extract summary from OpenAI response
    const summary = response.data.choices[0].message.content.trim();

    // Optionally save summary to database
    note.summary = summary;
    await note.save();

    res.status(200).json({
      success: true,
      message: 'Summary generated successfully',
      summary,
    });
  } catch (error) {
    console.error('Error generating summary:', error.response?.data || error.message);

    // Handle OpenAI API errors
    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'Invalid OpenAI API key',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error generating summary',
      error: error.message,
    });
  }
});

module.exports = router;
