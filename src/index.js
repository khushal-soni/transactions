const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Load environment variables
require('dotenv').config();

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.json());

// Define routes
const booksRoute = require('./routes/books.routes');
const authorsRoute = require('./routes/authors.routes');

app.use('/books', booksRoute);
app.use('/authors', authorsRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* const Book = require('./models/book.model');
const Author = require('./models/author.model');

seedDatabase();

// Insert some dummy data for books and authors
async function seedDatabase () {
  try {
    // Create authors
    const author1 = new Author({ name: 'Author 1' });
    const author2 = new Author({ name: 'Author 2' });

    await author1.save();
    await author2.save();

    // Create books
    const book1 = new Book({ title: 'Book 1', author: author1._id, price: 20 });
    const book2 = new Book({ title: 'Book 2', author: author1._id, price: 25 });
    const book3 = new Book({ title: 'Book 3', author: author2._id, price: 30 });

    await book1.save();
    await book2.save();
    await book3.save();

    console.log('Dummy data inserted successfully');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  }
} */
