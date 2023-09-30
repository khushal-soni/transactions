const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');
const Author = require('../models/author.model');

// Create a new book
router.post('/', async (req, res) => {
  let responseString;
  try {
    const session = await Book.startSession();

    let book;
    await session.withTransaction(async () => {
      book = new Book(req.body);
      await book.save({ session });

      console.log(book);

      const updatedAuthor = await Author.findByIdAndUpdate(
        { _id: book.author }, { $push: { books: book } }, { new: true }
      ).session(session);
      console.log(updatedAuthor);

      if (!updatedAuthor) {
        await session.abortTransaction();
        return responseString = {
          status: 'FAILURE',
          message: 'Rolling Back because author was not updated',
        };
      }

      responseString = book;
    });

    await session.endSession();

    res.status(201).json(responseString);
  } catch (error) {
    res.status(500).json({ error: 'Error creating book' });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving books' });
  }
});

// Get a specific book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving book' });
  }
});

// Update a book by ID
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error updating book' });
  }
});

// Delete a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting book' });
  }
});

module.exports = router;