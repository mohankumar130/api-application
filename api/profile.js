import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: 'Token required' });

  const token = authHeader.split(' ')[1]; // 'Bearer <token>'

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: 'Welcome to dashboard', user });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
});

export default router;
