import express from 'express';
import { sendNewMessageNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/new-message', sendNewMessageNotification);

export default router;