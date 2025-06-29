import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { mobile } = req.body;

  if (!mobile) return res.status(400).json({ message: 'Mobile number required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const query = 'SELECT * FROM users WHERE mobile_number = ?';
  db.query(query, [mobile], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const update = 'UPDATE users SET otp_code = ? WHERE mobile_number = ?';
    db.query(update, [otp, mobile], (err2) => {
      if (err2) return res.status(500).json({ message: 'Error saving OTP' });

      console.log(`📲 OTP for ${mobile}: ${otp}`); // simulate SMS
      res.json({ message: 'OTP sent to registered mobile number' });
    });
  });
});

export default router;
