import stripe from 'stripe';
import ApiError from '../util/ApiError.js';
import asynchandler from '../util/AsyncHandler.js';
import Payment from '../model/payment.model.js';

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = asynchandler(async (req, res) => {
    const { amount, userID,courseID } = req.body;

    if (!amount || !userID || !courseID) {
        throw new ApiError(400, 'Amount and currency are required');
    }

    try {
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount : amount * 100, // Convert to smallest currency unit 
            currency : 'inr',
            metadata: { userID, courseID },
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw new ApiError(500, 'Failed to create payment intent');
    }
});

export const handleWebhook = asynchandler(async (req, res) => {
    // console.log('Received webhook request:', req.body);
    const sig = req.headers['stripe-signature'];
    let event;
    // console.log('Received webhook event:', req.body);
    try {
        event = stripeClient.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Error verifying webhook signature:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Handle successful payment here
            console.log('PaymentIntent was successful!', paymentIntent);
            await Payment.create({
                user: paymentIntent.metadata.userID,
                course: paymentIntent.metadata.courseID,
                amount: paymentIntent.amount_received / 100, // Convert back to original amount
                paymentMethod: 'credit_card',
                status: 'completed',
                transactionId: paymentIntent.id,
            });
            break;
        case 'payment_intent.payment_failed':
            const paymentFailedIntent = event.data.object;
            // Handle failed payment here
            console.error('PaymentIntent failed:', paymentFailedIntent);
            break;
        default:
            console.warn(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});