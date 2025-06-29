import express from 'express';
import registerRoute from './register.js';
import loginRoute from './login.js';
import forgotPassword from './forgotPassword.js';
import resetPassword from './resetPassword.js';
import sendOtp from './sendOtp.js';
import verifyOtp from './verifyOtp.js';

const router = express.Router();

router.use('/register', registerRoute);
router.use('/login', loginRoute);
router.use('/forgot-password', forgotPassword);
router.use('/reset-password', resetPassword);
router.use('/send-otp', sendOtp);
router.use('/verify-otp', verifyOtp);

router.get('/health', (req, res) => {
  res.json({ status: 'API is Healthy -- up and running!' });
});

export default router;
