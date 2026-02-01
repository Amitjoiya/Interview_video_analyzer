const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Credit costs for each feature
const CREDIT_COSTS = {
  resumeAnalysis: 2,
  interviewAnalysis: 5,
  coverLetters: 3,
  jobAnalysis: 2,
  emailsWritten: 1,
  linkedinOptimizations: 2,
  chatMessages: 1, // per 10 messages
  salaryCoaching: 2
};

// Feature names mapping for display
const FEATURE_NAMES = {
  resumeAnalysis: 'Resume Analysis',
  interviewAnalysis: 'Interview Video Analysis',
  coverLetters: 'Cover Letter Generation',
  jobAnalysis: 'Job Analysis',
  emailsWritten: 'Email Writer',
  linkedinOptimizations: 'LinkedIn Optimization',
  chatMessages: 'AI Chat',
  salaryCoaching: 'Salary Coach'
};

// Middleware to check and deduct credits
const checkCredits = (feature) => {
  return async (req, res, next) => {
    try {
      // If no user is logged in, allow with limited functionality or deny
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Please login to use this feature',
          requiresAuth: true
        });
      }
      
      const creditCost = CREDIT_COSTS[feature];
      
      if (creditCost === undefined) {
        console.error(`Unknown feature: ${feature}`);
        return next(); // Allow if feature not in list
      }
      
      // Check if enterprise plan (unlimited)
      if (req.user.subscription.plan === 'enterprise' && req.user.isSubscriptionActive()) {
        req.creditCost = 0;
        req.feature = feature;
        return next();
      }
      
      // Check if user has enough credits
      if (!req.user.hasCredits(creditCost)) {
        return res.status(402).json({
          success: false,
          error: 'Insufficient credits',
          message: `You need ${creditCost} credits for ${FEATURE_NAMES[feature]}. You have ${req.user.wallet.credits} credits.`,
          required: creditCost,
          available: req.user.wallet.credits,
          feature: feature,
          featureName: FEATURE_NAMES[feature]
        });
      }
      
      // Store credit info for later deduction (after successful operation)
      req.creditCost = creditCost;
      req.feature = feature;
      
      next();
    } catch (error) {
      console.error('Credit check error:', error);
      return res.status(500).json({
        success: false,
        error: 'Error checking credits'
      });
    }
  };
};

// Middleware to deduct credits after successful operation
const deductCredits = async (req, res, next) => {
  // Only deduct if there's a credit cost and operation was successful
  if (req.creditCost && req.creditCost > 0 && req.user && res.statusCode < 400) {
    try {
      const user = await User.findById(req.user._id);
      const newBalance = await user.deductCredits(req.creditCost, req.feature);
      
      // Log transaction
      await Transaction.logCreditUsage(
        req.user._id,
        req.creditCost,
        req.feature,
        newBalance
      );
      
      // Add credit info to response
      if (res.locals.responseData) {
        res.locals.responseData.creditsUsed = req.creditCost;
        res.locals.responseData.remainingCredits = newBalance;
      }
    } catch (error) {
      console.error('Credit deduction error:', error);
      // Don't fail the request, just log the error
    }
  }
  next();
};

// Helper to wrap async route handlers with credit deduction
const withCreditDeduction = (feature, handler) => {
  return async (req, res, next) => {
    try {
      // Run the actual handler
      const result = await handler(req, res, next);
      
      // If successful and we have credit cost, deduct
      if (req.creditCost && req.creditCost > 0 && req.user) {
        const user = await User.findById(req.user._id);
        const newBalance = await user.deductCredits(req.creditCost, feature);
        
        await Transaction.logCreditUsage(
          req.user._id,
          req.creditCost,
          feature,
          newBalance
        );
        
        // If result is an object, add credit info
        if (result && typeof result === 'object') {
          result.creditsUsed = req.creditCost;
          result.remainingCredits = newBalance;
        }
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  };
};

// Get credit cost for a feature
const getCreditCost = (feature) => {
  return CREDIT_COSTS[feature] || 0;
};

// Get all credit costs
const getAllCreditCosts = () => {
  return Object.entries(CREDIT_COSTS).map(([feature, cost]) => ({
    feature,
    name: FEATURE_NAMES[feature],
    cost
  }));
};

module.exports = {
  checkCredits,
  deductCredits,
  withCreditDeduction,
  getCreditCost,
  getAllCreditCosts,
  CREDIT_COSTS,
  FEATURE_NAMES
};
