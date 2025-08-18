// server/routes/userRoutes.js
import express from 'express';
import { protect , verifyToken} from "../middleware/authMiddleware.js";
import { getUsers , blockUser , getMe , updateProfile} from "../controllers/userController.js";

const router = express.Router();

router.get('/', protect, getUsers);
router.put('/block/:id', verifyToken, blockUser);

router.get('/me', protect, getMe); // make sure this exists

router.put('/update-profile', protect, updateProfile);


export default router;