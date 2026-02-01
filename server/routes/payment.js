const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// Initialize Razorpay
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Credit packages pricing
const CREDIT_PACKAGES = {
  credits_10: { credits: 10, price: 4900 }, // price in paise
  credits_25: { credits: 25, price: 9900 },
  credits_50: { credits: 50, price: 17900 },
  credits_100: { credits: 100, price: 29900 },
  credits_250: { credits: 250, price: 59900 }
};

// Subscription pricing
const SUBSCRIPTION_PRICES = {
  pro_monthly: { plan: 'pro', period: 'monthly', price: 29900 },
  pro_yearly: { plan: 'pro', period: 'yearly', price: 299900 },
  enterprise_monthly: { plan: 'enterprise', period: 'monthly', price: 99900 },
  enterprise_yearly: { plan: 'enterprise', period: 'yearly', price: 999900 }
};

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order for credits or subscription
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        error: 'Payment gateway not configured'
      });
    }
    
    const { packageId, type } = req.body; // type: 'credits' or 'subscription'
    
    let amount, description, metadata;
    
    if (type === 'credits') {
      const pkg = CREDIT_PACKAGES[packageId];
      if (!pkg) {
        return res.status(400).json({
          success: false,
          error: 'Invalid package selected'
        });
      }
      amount = pkg.price;
      description = `${pkg.credits} Credits Purchase`;
      metadata = { type: 'credits', packageId, credits: pkg.credits };
    } else if (type === 'subscription') {
      const sub = SUBSCRIPTION_PRICES[packageId];
      if (!sub) {
        return res.status(400).json({
          success: false,
          error: 'Invalid subscription selected'
        });
      }
      amount = sub.price;
      description = `${sub.plan.toUpperCase()} ${sub.period} Subscription`;
      metadata = { type: 'subscription', packageId, plan: sub.plan, period: sub.period };
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment type'
      });
    }
    
    // Create Razorpay order
    // Receipt must be max 40 characters
    const shortReceipt = `ord_${Date.now().toString(36)}`;
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: shortReceipt,
      notes: {
        userId: req.user._id.toString(),
        ...metadata
      }
    });
    
    // Create pending transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      type: type === 'credits' ? 'credit_purchase' : 'subscription_purchase',
      amount: amount / 100, // Convert from paise to rupees
      credits: metadata.credits || 0,
      razorpayOrderId: order.id,
      status: 'pending',
      description,
      metadata,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      },
      transactionId: transaction._id,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating payment order'
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment and add credits/subscription
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;
    
    // Find pending transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction || transaction.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction'
      });
    }
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature !== razorpay_signature) {
      transaction.status = 'failed';
      await transaction.save();
      
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
    
    // Update transaction
    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    transaction.status = 'success';
    
    const user = await User.findById(req.user._id);
    
    // Process based on type
    if (transaction.metadata.type === 'credits') {
      const credits = transaction.metadata.credits;
      user.wallet.credits += credits;
      user.wallet.totalPurchased += credits;
      transaction.balanceAfter = user.wallet.credits;
    } else if (transaction.metadata.type === 'subscription') {
      const { plan, period } = transaction.metadata;
      const endDate = new Date();
      if (period === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }
      
      user.subscription = {
        plan,
        startDate: new Date(),
        endDate,
        status: 'active'
      };
      
      // Add monthly credits based on plan
      const planCredits = plan === 'pro' ? 100 : 0; // Enterprise is unlimited
      if (planCredits > 0) {
        user.wallet.credits += planCredits;
        user.wallet.lastRefill = new Date();
      }
      
      transaction.subscriptionPlan = plan;
      transaction.subscriptionPeriod = period;
    }
    
    await user.save();
    await transaction.save();
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      wallet: user.wallet,
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Error verifying payment'
    });
  }
});

// @route   POST /api/payment/webhook
// @desc    Razorpay webhook for payment events
// @access  Public (verified by signature)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (webhookSecret) {
      const signature = req.headers['x-razorpay-signature'];
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');
      
      if (signature !== expectedSignature) {
        return res.status(400).json({ error: 'Invalid signature' });
      }
    }
    
    const event = req.body.event;
    const payload = req.body.payload;
    
    switch (event) {
      case 'payment.captured':
        // Payment successful - already handled in verify
        console.log('Payment captured:', payload.payment.entity.id);
        break;
        
      case 'payment.failed':
        // Update transaction status
        const orderId = payload.payment.entity.order_id;
        await Transaction.findOneAndUpdate(
          { razorpayOrderId: orderId },
          { status: 'failed' }
        );
        break;
        
      case 'refund.created':
        // Handle refund
        console.log('Refund created:', payload.refund.entity.id);
        break;
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// @route   GET /api/payment/config
// @desc    Get payment configuration (for frontend)
// @access  Public
router.get('/config', (req, res) => {
  res.json({
    success: true,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || null,
    isConfigured: !!razorpay,
    creditPackages: Object.entries(CREDIT_PACKAGES).map(([id, pkg]) => ({
      id,
      credits: pkg.credits,
      price: pkg.price / 100 // Convert to rupees
    })),
    subscriptionPrices: Object.entries(SUBSCRIPTION_PRICES).map(([id, sub]) => ({
      id,
      plan: sub.plan,
      period: sub.period,
      price: sub.price / 100
    }))
  });
});

module.exports = router;
