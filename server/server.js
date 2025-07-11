const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = 5001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');
const libraryPath = path.join(__dirname, 'Library_db.json'); // 🔹 ADD THIS

// --- API Endpoints ---

// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { role, username, password } = req.body;

    const data = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(data);

    const userListKey = role && `${role.toLowerCase()}s`;
    const userList = db[userListKey];

    if (!userList) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const user = userList.find(u => u.username === username && u.password === password);

    if (user) {
      const { password, ...userToReturn } = user;
      res.json({ ...userToReturn, role });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Existing Book Endpoint (from db.json, not library)
app.get('/api/books', async (req, res) => {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(data);
    res.json(db.books || []);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// --- 7/11 New Library Endpoints ---

// Get all library categories
app.get('/api/library/categories', async (req, res) => {
  try {
    const data = await fs.readFile(libraryPath, 'utf8');
    const library = JSON.parse(data);
    const categories = Object.keys(library);
    res.json(categories);
  } catch (error) {
    console.error("Error reading library categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get books by category
app.get('/api/library/books/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const data = await fs.readFile(libraryPath, 'utf8');
    const library = JSON.parse(data);

    if (!library[category]) {
      return res.status(404).json({ message: `Category '${category}' not found.` });
    }

    res.json(library[category]);
  } catch (error) {
    console.error("Error fetching library books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- Server Startup ---
app.listen(port, () => {
  console.log(`Server is running successfully on http://localhost:${port}`);
  console.log('Waiting for requests... (Press CTRL+C to stop)');
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});
