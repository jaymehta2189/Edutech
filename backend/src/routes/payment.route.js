import express from 'express';
import { auth } from '../middleware/auth.js';
import * as paymentController from '../controller/payment.controller.js';

const router = express.Router();

router.post("/create-payment-intent", auth, paymentController.createPaymentIntent);
router.post("/webhook", express.raw({ type: 'application/json' }), paymentController.handleWebhook);

export default router;