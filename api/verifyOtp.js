import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { mobile, otp, newPassword } = req.body;

  if (!mobile || !otp || !newPassword)
    return res.status(400).json({ message: 'All fields required' });

  const query = 'SELECT * FROM users WHERE mobile_number = ? AND otp_code = ?';
  db.query(query, [mobile, otp], async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (results.length === 0)
      return res.status(400).json({ message: 'Invalid OTP or mobile number' });

    const hashed = await bcrypt.hash(newPassword, 10);
    const update = 'UPDATE users SET password = ?, otp_code = NULL WHERE mobile_number = ?';

    db.query(update, [hashed, mobile], (err2) => {
      if (err2) return res.status(500).json({ message: 'Password update failed' });
      res.json({ message: 'Password reset successful' });
    });
  });
});

export default router;
