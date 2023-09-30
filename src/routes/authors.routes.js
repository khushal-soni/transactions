// routes/authors.js

const express = require('express');
const router = express.Router();
const Author = require('../models/author.model');

// Create a new author
router.post('/', async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ error: 'Error creating author' });
  }
});

// Get all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find().populate('books');
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving authors' });
  }
});

// Get a specific author by ID
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).populate('books');
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving author' });
  }
});

// Update an author by ID
router.put('/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: 'Error updating author' });
  }
});

// Delete an author by ID
router.delete('/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndRemove(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json({ message: 'Author deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting author' });
  }
});

module.exports = router;