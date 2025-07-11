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

// --- API Endpoints ---

// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { role, username, password } = req.body;

    const data = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(data);

    // Use a more robust way to access the user list
    const userListKey = role && `${role.toLowerCase()}s`; // "student" -> "students"
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

// Books Endpoint
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

// --- Server Startup ---
app.listen(port, () => {
  console.log(`Server is running successfully on http://localhost:${port}`);
  console.log('Waiting for requests... (Press CTRL+C to stop)');
}).on('error', (err) => {
  // Catch startup errors like "Port in use"
  console.error('Failed to start server:', err);
});
