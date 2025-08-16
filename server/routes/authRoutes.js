// routes/authRoutes.js
import express from 'express';
import {
  register,
  verifyAccount,
  resendVerification,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyResetCode,
  resendResetCode,
  getMe
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', upload.single('profilePhoto'), register);
router.post('/verify', verifyAccount);
router.post('/resend-verification', resendVerification);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/resend-reset-code', resendResetCode);
router.put('/reset-password', resetPassword);
router.get('/me', protect, getMe);

export default router;