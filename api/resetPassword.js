import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    return res.status(400).json({ message: 'Token and new password required' });

  const hashed = await bcrypt.hash(newPassword, 10);

  const query = `UPDATE users SET password = ?, reset_token = NULL WHERE reset_token = ?`;
  db.query(query, [hashed, token], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (result.affectedRows === 0)
      return res.status(400).json({ message: 'Invalid or expired token' });

    res.json({ message: 'Password reset successful' });
  });
});

export default router;
