// Authentication routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt'); // Uncomment if implementing hashed passwords

// For simplicity, using a mock user list
const users = [
  { id: 1, username: 'patient1', password: 'password', role: 'patient' },
  { id: 2, username: 'insurer1', password: 'password', role: 'insurer' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const payload = { user: { id: user.id, role: user.role } };
  jwt.sign(payload, 'your_jwt_secret', { expiresIn: 360000 }, (err, token) => {
    if (err) throw err;
    res.json({ token, role: user.role });
  });
});

module.exports = router;
