// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Allow frontend requests
app.use(cors());

// Load library JSON
const libraryData = JSON.parse(fs.readFileSync('Library_db.json', 'utf-8'));

// GET all categories
app.get('/api/categories', (req, res) => {
  res.json(Object.keys(libraryData));
});

// GET books for a category
app.get('/api/books/:category', (req, res) => {
  const category = req.params.category;
  const books = libraryData[category];
  if (!books) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(books);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
