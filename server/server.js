const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get('/api/user/:role/:username', (req, res) => {
  const { role, username } = req.params;
  const data = {
    student: {
      username,
      role,
      pages: ['Library', 'Booking', 'Assignments'],
    },
    teacher: {
      username,
      role,
      pages: ['Library', 'Schedule', 'Assignments'],
    },
  };

  res.json(data[role] || { error: 'Invalid role' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
