const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  
  // Subscription Details
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'pending'],
      default: 'active'
    },
    razorpaySubscriptionId: {
      type: String,
      default: null
    }
  },
  
  // Wallet / Credits
  wallet: {
    credits: {
      type: Number,
      default: 10 // Free users get 10 credits to start
    },
    totalPurchased: {
      type: Number,
      default: 0
    },
    totalUsed: {
      type: Number,
      default: 0
    },
    lastRefill: {
      type: Date,
      default: Date.now
    }
  },
  
  // Usage Stats
  usage: {
    resumeAnalysis: { type: Number, default: 0 },
    interviewAnalysis: { type: Number, default: 0 },
    coverLetters: { type: Number, default: 0 },
    jobAnalysis: { type: Number, default: 0 },
    emailsWritten: { type: Number, default: 0 },
    linkedinOptimizations: { type: Number, default: 0 },
    chatMessages: { type: Number, default: 0 },
    salaryCoaching: { type: Number, default: 0 }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLogin: {
    type: Date,
    default: Date.now
  },
  
  resetPasswordToken: String,
  resetPasswordExpire: Date
  
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user has enough credits
userSchema.methods.hasCredits = function(amount) {
  return this.wallet.credits >= amount;
};

// Deduct credits
userSchema.methods.deductCredits = async function(amount, feature) {
  if (!this.hasCredits(amount)) {
    throw new Error('Insufficient credits');
  }
  this.wallet.credits -= amount;
  this.wallet.totalUsed += amount;
  
  // Update usage stats
  if (this.usage[feature] !== undefined) {
    this.usage[feature] += 1;
  }
  
  await this.save();
  return this.wallet.credits;
};

// Add credits
userSchema.methods.addCredits = async function(amount) {
  this.wallet.credits += amount;
  this.wallet.totalPurchased += amount;
  await this.save();
  return this.wallet.credits;
};

// Check subscription status
userSchema.methods.isSubscriptionActive = function() {
  if (this.subscription.plan === 'free') return true;
  if (this.subscription.status !== 'active') return false;
  if (this.subscription.endDate && new Date() > this.subscription.endDate) return false;
  return true;
};

// Get plan limits
userSchema.methods.getPlanLimits = function() {
  const limits = {
    free: {
      monthlyCredits: 10,
      features: ['resumeAnalysis', 'coverLetters']
    },
    pro: {
      monthlyCredits: 100,
      features: ['all']
    },
    enterprise: {
      monthlyCredits: -1, // Unlimited
      features: ['all', 'api', 'priority']
    }
  };
  return limits[this.subscription.plan] || limits.free;
};

module.exports = mongoose.model('User', userSchema);
