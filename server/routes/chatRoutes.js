import express from 'express';
import { clearChatHistory, setChatTheme } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';  // FIX ✅

const router = express.Router();

// Add authentication middleware to protect these routes
router.delete('/:userId/clear', protect, clearChatHistory);   // FIX ✅
router.put('/:chatId/theme', protect, setChatTheme);

export default router;
