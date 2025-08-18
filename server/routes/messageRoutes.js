// server/routes/messageRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMessages, sendMessage } from '../controllers/messageController.js';
import { checkBlocked } from '../middleware/blockMiddleware.js';


const router = express.Router();

router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);
router.post('/send', protect, checkBlocked, sendMessage);

export default router;