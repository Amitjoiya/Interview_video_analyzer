const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// Subscription Plans Configuration
const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    nameHi: 'फ्री',
    price: 0,
    priceYearly: 0,
    credits: 10,
    features: [
      'Basic Resume Analysis',
      '10 Free Credits',
      'Limited Features'
    ],
    featuresHi: [
      'बेसिक रिज्यूमे एनालिसिस',
      '10 फ्री क्रेडिट्स',
      'सीमित फीचर्स'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    nameHi: 'प्रो',
    price: 299,
    priceYearly: 2999,
    credits: 100,
    features: [
      'All Features Unlocked',
      '100 Credits/Month',
      'Interview Video Analysis',
      'Cover Letter Generator',
      'Priority Support',
      'LinkedIn Optimizer'
    ],
    featuresHi: [
      'सभी फीचर्स अनलॉक',
      '100 क्रेडिट्स/महीना',
      'इंटरव्यू वीडियो एनालिसिस',
      'कवर लेटर जनरेटर',
      'प्रायोरिटी सपोर्ट',
      'लिंक्डइन ऑप्टिमाइज़र'
    ],
    popular: true
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    nameHi: 'एंटरप्राइज',
    price: 999,
    priceYearly: 9999,
    credits: -1, // Unlimited
    features: [
      'Unlimited Credits',
      'API Access',
      'Custom Integrations',
      'Dedicated Support',
      'White-label Option',
      'Team Management'
    ],
    featuresHi: [
      'अनलिमिटेड क्रेडिट्स',
      'API एक्सेस',
      'कस्टम इंटीग्रेशन',
      'डेडिकेटेड सपोर्ट',
      'व्हाइट-लेबल ऑप्शन',
      'टीम मैनेजमेंट'
    ]
  }
};

// Credit Packages for purchase
const CREDIT_PACKAGES = [
  { id: 'credits_10', credits: 10, price: 49, popular: false },
  { id: 'credits_25', credits: 25, price: 99, popular: false },
  { id: 'credits_50', credits: 50, price: 179, popular: true },
  { id: 'credits_100', credits: 100, price: 299, popular: false },
  { id: 'credits_250', credits: 250, price: 599, popular: false }
];

// @route   GET /api/subscription/plans
// @desc    Get all subscription plans
// @access  Public
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    plans: SUBSCRIPTION_PLANS,
    creditPackages: CREDIT_PACKAGES
  });
});

// @route   GET /api/subscription/current
// @desc    Get current subscription status
// @access  Private
router.get('/current', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const planDetails = SUBSCRIPTION_PLANS[user.subscription.plan];
    
    res.json({
      success: true,
      subscription: {
        ...user.subscription.toObject(),
        planDetails
      },
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching subscription'
    });
  }
});

// @route   POST /api/subscription/upgrade
// @desc    Upgrade subscription (after payment verification)
// @access  Private
router.post('/upgrade', protect, async (req, res) => {
  try {
    const { plan, period = 'monthly', transactionId } = req.body;
    
    if (!SUBSCRIPTION_PLANS[plan] || plan === 'free') {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan selected'
      });
    }
    
    // Verify transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction || transaction.status !== 'success') {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
    
    const planDetails = SUBSCRIPTION_PLANS[plan];
    const endDate = new Date();
    if (period === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }
    
    // Update user subscription
    const user = await User.findById(req.user._id);
    user.subscription = {
      plan,
      startDate: new Date(),
      endDate,
      status: 'active'
    };
    
    // Add monthly credits
    if (planDetails.credits > 0) {
      user.wallet.credits += planDetails.credits;
      user.wallet.lastRefill = new Date();
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: `Successfully upgraded to ${planDetails.name} plan`,
      subscription: user.subscription,
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error upgrading subscription'
    });
  }
});

// @route   POST /api/subscription/cancel
// @desc    Cancel subscription
// @access  Private
router.post('/cancel', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.subscription.plan === 'free') {
      return res.status(400).json({
        success: false,
        error: 'No active subscription to cancel'
      });
    }
    
    user.subscription.status = 'cancelled';
    await user.save();
    
    // Create cancellation transaction
    await Transaction.create({
      user: user._id,
      type: 'subscription_purchase',
      status: 'cancelled',
      subscriptionPlan: user.subscription.plan,
      description: 'Subscription cancelled by user'
    });
    
    res.json({
      success: true,
      message: 'Subscription cancelled. You can continue using until the end of your billing period.',
      subscription: user.subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error cancelling subscription'
    });
  }
});

module.exports = router;
