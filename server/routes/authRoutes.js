// routes/authRoutes.js
// import express from 'express';
// import {
//   register,
//   verifyAccount,
//   resendVerification,
//   login,
//   logout,
//   forgotPassword,
//   resetPassword,
//   verifyResetCode,
//   resendResetCode,
//   getMe
// } from '../controllers/authController.js';
// import { protect } from '../middleware/authMiddleware.js';
// import upload from '../middleware/uploadMiddleware.js';

// const router = express.Router();

// router.post('/register', upload.single('profilePhoto'), register);
// router.post('/verify', verifyAccount);
// router.post('/resend-verification', resendVerification);
// router.post('/login', login);
// router.get('/logout', logout);
// router.post('/forgot-password', forgotPassword);
// router.post('/verify-reset-code', verifyResetCode);
// router.post('/resend-reset-code', resendResetCode);
// router.put('/reset-password', resetPassword);
// router.get('/me', protect, getMe);

// export default router;




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



// export default router;export const verifyAccount = async (req, res, next) => {
//   try {
//     const { userId, verificationCode } = req.body;

//     const user = await User.findOne({
//       _id: userId,
//       verificationCode,
//       verificationCodeExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired verification code'
//       });
//     }

//     // Mark user as verified
//     user.isVerified = true;
//     user.verificationCode = undefined;
//     user.verificationCodeExpires = undefined;
//     await user.save();

//     // Generate token
//     const token = generateToken(user._id);

//     // Set cookie options
//     const options = {
//       expires: new Date(
//         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//       ),
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict'
//     };

//     res.status(200)
//       .cookie('token', token, options)
//       .json({
//         success: true,
//         token,
//         user: {
//           _id: user._id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           isVerified: user.isVerified,
//           profilePhoto: user.profilePhoto
//         }
//       });
//   } catch (error) {
//     next(error);
//   }
// };