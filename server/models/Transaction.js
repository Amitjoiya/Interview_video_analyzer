const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  type: {
    type: String,
    enum: ['credit_purchase', 'credit_used', 'subscription_purchase', 'subscription_renewal', 'refund', 'bonus'],
    required: true
  },
  
  // For purchases
  amount: {
    type: Number,
    default: 0 // Amount in INR (paise for Razorpay)
  },
  
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Credits involved
  credits: {
    type: Number,
    default: 0
  },
  
  // For credit usage
  feature: {
    type: String,
    enum: ['resumeAnalysis', 'interviewAnalysis', 'coverLetters', 'jobAnalysis', 'emailsWritten', 'linkedinOptimizations', 'chatMessages', 'salaryCoaching', null],
    default: null
  },
  
  // Payment details
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'upi', 'card', 'netbanking', 'wallet', 'free', null],
    default: null
  },
  
  // Razorpay specific
  razorpayOrderId: {
    type: String,
    default: null
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  razorpaySignature: {
    type: String,
    default: null
  },
  
  // Subscription details (if subscription transaction)
  subscriptionPlan: {
    type: String,
    enum: ['free', 'pro', 'enterprise', null],
    default: null
  },
  
  subscriptionPeriod: {
    type: String,
    enum: ['monthly', 'yearly', null],
    default: null
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  
  // Additional info
  description: {
    type: String,
    default: ''
  },
  
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Balance after transaction
  balanceAfter: {
    type: Number,
    default: 0
  },
  
  // IP and device info for security
  ipAddress: {
    type: String,
    default: null
  },
  
  userAgent: {
    type: String,
    default: null
  }
  
}, {
  timestamps: true
});

// Indexes for faster queries
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ razorpayOrderId: 1 });
transactionSchema.index({ razorpayPaymentId: 1 });

// Static method to get user's transaction history
transactionSchema.statics.getUserHistory = async function(userId, options = {}) {
  const { limit = 20, skip = 0, type = null } = options;
  
  const query = { user: userId };
  if (type) query.type = type;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

// Static method to get user's spending summary
transactionSchema.statics.getUserSummary = async function(userId) {
  const result = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), status: 'success' } },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        totalCredits: { $sum: '$credits' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result.reduce((acc, item) => {
    acc[item._id] = {
      totalAmount: item.totalAmount,
      totalCredits: item.totalCredits,
      count: item.count
    };
    return acc;
  }, {});
};

// Create a credit usage transaction
transactionSchema.statics.logCreditUsage = async function(userId, credits, feature, balanceAfter) {
  return this.create({
    user: userId,
    type: 'credit_used',
    credits: -credits,
    feature,
    status: 'success',
    balanceAfter,
    description: `Used ${credits} credit(s) for ${feature}`
  });
};

module.exports = mongoose.model('Transaction', transactionSchema);
