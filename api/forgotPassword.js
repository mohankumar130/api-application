import express from 'express';
import crypto from 'crypto';
import db from '../config/db.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { usernameOrEmail } = req.body;

  if (!usernameOrEmail) {
    return res.status(400).json({ message: 'Username or Email is required' });
  }

  const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.query(query, [usernameOrEmail, usernameOrEmail], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (results.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    const updateQuery = `UPDATE users SET reset_token = ? WHERE id = ?`;

    db.query(updateQuery, [resetToken, results[0].id], (err2) => {
      if (err2) return res.status(500).json({ message: 'Error saving token' });

      // Simulate email/SMS
      console.log(`🔑 Reset token for ${usernameOrEmail}: ${resetToken}`);
      res.json({ message: 'Reset token generated. Check console log for token.' });
    });
  });
});

export default router;
