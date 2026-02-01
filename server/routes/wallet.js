const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');
const { getAllCreditCosts } = require('../middleware/creditCheck');

// @route   GET /api/wallet
// @desc    Get wallet details
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      wallet: {
        credits: user.wallet.credits,
        totalPurchased: user.wallet.totalPurchased,
        totalUsed: user.wallet.totalUsed,
        lastRefill: user.wallet.lastRefill
      },
      subscription: user.subscription,
      creditCosts: getAllCreditCosts()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching wallet'
    });
  }
});

// @route   GET /api/wallet/transactions
// @desc    Get transaction history
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      type: type || null
    };
    
    const transactions = await Transaction.getUserHistory(req.user._id, options);
    const total = await Transaction.countDocuments({ user: req.user._id });
    
    res.json({
      success: true,
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching transactions'
    });
  }
});

// @route   GET /api/wallet/summary
// @desc    Get spending summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    const summary = await Transaction.getUserSummary(req.user._id);
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      summary,
      usage: user.usage,
      wallet: user.wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching summary'
    });
  }
});

// @route   GET /api/wallet/credit-costs
// @desc    Get credit costs for all features
// @access  Public
router.get('/credit-costs', (req, res) => {
  res.json({
    success: true,
    creditCosts: getAllCreditCosts()
  });
});

// @route   POST /api/wallet/add-credits
// @desc    Add credits (after successful payment verification)
// @access  Private (called internally after payment verification)
router.post('/add-credits', protect, async (req, res) => {
  try {
    const { credits, transactionId } = req.body;
    
    // Verify transaction exists and is successful
    const transaction = await Transaction.findById(transactionId);
    if (!transaction || transaction.status !== 'success') {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction'
      });
    }
    
    // Add credits to user
    const user = await User.findById(req.user._id);
    const newBalance = await user.addCredits(credits);
    
    res.json({
      success: true,
      message: `${credits} credits added successfully`,
      newBalance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error adding credits'
    });
  }
});

module.exports = router;
