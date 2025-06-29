import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

const router = express.Router();

// Handle POST /api/register
router.post('/', async (req, res) => {
  const { username, email, first_name, last_name, mobile_number, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, email, first_name, last_name, mobile_number, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [username, email, first_name, last_name, mobile_number, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Username or email already exists' });
        }
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(201).json({ message: 'User registered successfully' });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
