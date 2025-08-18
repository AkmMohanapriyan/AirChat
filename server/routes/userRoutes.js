// server/routes/userRoutes.js
import express from 'express';
import { protect , verifyToken} from "../middleware/authMiddleware.js";
import { getUsers , blockUser } from "../controllers/userController.js";

const router = express.Router();

router.get('/', protect, getUsers);
router.put('/block/:id', verifyToken, blockUser);

export default router;