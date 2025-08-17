import express from 'express';
import { 
  getFriends, 
  getFriendRequests,
  sendFriendRequest,
  respondToRequest
} from '../controllers/friendController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/friends', protect, getFriends);
router.get('/friend-requests', protect, getFriendRequests);
router.post('/friend-requests', protect, sendFriendRequest);
router.put('/friend-requests/:requestId', protect, respondToRequest);

export default router;