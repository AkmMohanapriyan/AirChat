import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// Helper function to generate verification code
const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, age, country, phoneNumber } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Handle profile photo
    let profilePhoto;
    if (req.file) {  // Changed from req.files to req.file
      profilePhoto = `/uploads/${req.file.filename}`;  // Store path relative to server
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      age,
      country,
      phoneNumber,
      profilePhoto,  // Add profile photo path
      verificationCode,
      verificationCodeExpires
    });

    // Send verification email
    const message = `Your AirChat verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'AirChat Account Verification',
        message
      });

      res.status(201).json({
        success: true,
        message: `Verification code sent to ${user.email}`,
        userId: user._id
      });
    } catch (error) {
      // If email fails, delete the user
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user account
// @route   POST /api/auth/verify
// @access  Public
export const verifyAccount = async (req, res, next) => {
  try {
    const { userId, verificationCode } = req.body;

    const user = await User.findOne({
      _id: userId,
      verificationCode,
      verificationCodeExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set cookie options
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.status(200)
      .cookie('token', token, options)
      .json({
        success: true,
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: user.isVerified,
          profilePhoto: user.profilePhoto
        }
      });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send verification email
    const message = `Your new AirChat verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`;

    await sendEmail({
      email: user.email,
      subject: 'AirChat Account Verification',
      message
    });

    res.status(200).json({
      success: true,
      message: `New verification code sent to ${user.email}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Generate verification code
      const verificationCode = generateVerificationCode();
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      // Send verification email
      const message = `Your AirChat verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`;

      await sendEmail({
        email: user.email,
        subject: 'AirChat Account Verification',
        message
      });

      return res.status(401).json({
        success: false,
        message: 'Account not verified. A new verification code has been sent to your email.',
        needsVerification: true,
        userId: user._id
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set cookie options
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.status(200)
      .cookie('token', token, options)
      .json({
        success: true,
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: user.isVerified,
          profilePhoto: user.profilePhoto
        }
      });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public

// export const forgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'No user found with this email'
//       });
//     }

//     // Generate reset token
//     const resetToken = generateVerificationCode();
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
//     await user.save();

//     // Create reset URL
//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     // Send email
//     const message = `You are receiving this email because you (or someone else) has requested to reset the password for your AirChat account. Your password reset code is: ${resetToken}\n\nIf you did not request this, please ignore this email.`;

//     await sendEmail({
//       email: user.email,
//       subject: 'AirChat Password Reset',
//       message
//     });

//     res.status(200).json({
//       success: true,
//       message: `Password reset code sent to ${user.email}`
//     });
//   } catch (error) {
//     next(error);
//   }
// };


export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Validate email presence
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email'
      });
    }

    // Generate reset token
    const resetToken = generateVerificationCode();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email
    const message = `Your password reset code is: ${resetToken}\nThis code will expire in 10 minutes.`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Code',
      message
    });

    res.status(200).json({
      success: true,
      message: `Verification code sent to ${email}`
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const verifyResetCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    console.log(`Verifying reset code for ${email}: ${code}`);
    
    const user = await User.findOne({ 
      email,
      resetPasswordToken: code,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      console.log('Verification failed:', {
        emailExists: !!await User.findOne({ email }),
        tokenMatch: user?.resetPasswordToken === code,
        tokenExpired: user?.resetPasswordExpire < Date.now()
      });
      
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    console.log('Verification successful for user:', user._id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Verify reset code error:', error);
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const resendResetCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found' });
    }

    // Generate new code
    const resetToken = generateVerificationCode();
    
    // Debugging output
    console.log(`New reset code for ${cleanEmail}: ${resetToken}`);
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email
    const message = `Your new code is: ${resetToken}`;
    await sendEmail({ email: cleanEmail, subject: 'New Verification Code', message });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};


export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    
    const user = await User.findOne({ 
      email,
      resetPasswordToken: code,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set cookie options
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.status(200)
      .cookie('token', token, options)
      .json({
        success: true,
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: user.isVerified,
          profilePhoto: user.profilePhoto
        }
      });
  } catch (error) {
    next(error);
  }
};