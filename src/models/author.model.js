const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: String,
  books: [
    {
      id: mongoose.Schema.Types.ObjectId,
      title: String,
      price: Number,
    },
  ],
});

module.exports = mongoose.model('Author', authorSchema);