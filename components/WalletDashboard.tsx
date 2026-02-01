import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { 
  Wallet, Coins, TrendingUp, TrendingDown, Clock, 
  ChevronRight, Plus, History, CreditCard, Sparkles,
  FileText, Video, PenTool, Search, Mail, Linkedin, MessageSquare, BadgeDollarSign,
  X, Loader2, Check, AlertCircle
} from 'lucide-react';

const API_URL = 'http://localhost:5001';

// Credit costs for each feature
const CREDIT_COSTS = [
  { feature: 'resumeAnalysis', name: 'Resume Analysis', nameHi: 'रिज्यूमे एनालिसिस', cost: 2, icon: FileText },
  { feature: 'interviewAnalysis', name: 'Interview Video Analysis', nameHi: 'इंटरव्यू वीडियो एनालिसिस', cost: 5, icon: Video },
  { feature: 'coverLetters', name: 'Cover Letter', nameHi: 'कवर लेटर', cost: 3, icon: PenTool },
  { feature: 'jobAnalysis', name: 'Job Analysis', nameHi: 'जॉब एनालिसिस', cost: 2, icon: Search },
  { feature: 'emailsWritten', name: 'Email Writer', nameHi: 'ईमेल राइटर', cost: 1, icon: Mail },
  { feature: 'linkedinOptimizations', name: 'LinkedIn Optimizer', nameHi: 'लिंक्डइन ऑप्टिमाइज़र', cost: 2, icon: Linkedin },
  { feature: 'chatMessages', name: 'AI Chat (10 msgs)', nameHi: 'AI चैट (10 msg)', cost: 1, icon: MessageSquare },
  { feature: 'salaryCoaching', name: 'Salary Coach', nameHi: 'सैलरी कोच', cost: 2, icon: BadgeDollarSign }
];

// Credit packages for purchase
const CREDIT_PACKAGES = [
  { id: 'credits_10', credits: 10, price: 49, popular: false },
  { id: 'credits_25', credits: 25, price: 99, popular: false },
  { id: 'credits_50', credits: 50, price: 179, popular: true },
  { id: 'credits_100', credits: 100, price: 299, popular: false },
  { id: 'credits_250', credits: 250, price: 599, popular: false }
];

interface Transaction {
  _id: string;
  type: string;
  credits: number;
  amount: number;
  feature?: string;
  status: string;
  description: string;
  createdAt: string;
}

interface WalletDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ isOpen, onClose }) => {
  const { user, token, refreshUser } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'topup' | 'history'>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'history' && token) {
      fetchTransactions();
    }
  }, [isOpen, activeTab, token]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/wallet/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyCredits = async (packageId: string) => {
    if (!token) return;
    
    setSelectedPackage(packageId);
    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await fetch(`${API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ packageId, type: 'credits' })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        alert(orderData.error || 'Failed to create order');
        return;
      }

      // Load Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'AI Interview Coach',
        description: 'Credit Purchase',
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch(`${API_URL}/api/payment/verify`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              transactionId: orderData.transactionId
            })
          });

          const verifyData = await verifyResponse.json();
          
          if (verifyData.success) {
            await refreshUser();
            alert('Credits added successfully!');
            setActiveTab('overview');
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email
        },
        theme: {
          color: '#6366f1'
        }
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  if (!isOpen) return null;

  const isHindi = language === 'hi';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isHindi ? 'मेरा वॉलेट' : 'My Wallet'}
              </h2>
              <p className="text-sm text-slate-400">
                {isHindi ? 'क्रेडिट्स और ट्रांजेक्शन मैनेज करें' : 'Manage credits & transactions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl">
                <Coins className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{isHindi ? 'उपलब्ध क्रेडिट्स' : 'Available Credits'}</p>
                <p className="text-4xl font-bold text-white">{user?.wallet?.credits || 0}</p>
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div className="px-4 py-2 bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-400">{isHindi ? 'कुल खरीदे' : 'Total Purchased'}</p>
                <p className="text-lg font-semibold text-green-400">{user?.wallet?.totalPurchased || 0}</p>
              </div>
              <div className="px-4 py-2 bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-400">{isHindi ? 'कुल उपयोग' : 'Total Used'}</p>
                <p className="text-lg font-semibold text-orange-400">{user?.wallet?.totalUsed || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          {[
            { id: 'overview', label: isHindi ? 'ओवरव्यू' : 'Overview', icon: Wallet },
            { id: 'topup', label: isHindi ? 'टॉप-अप' : 'Top-up', icon: Plus },
            { id: 'history', label: isHindi ? 'हिस्ट्री' : 'History', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'text-indigo-400 border-b-2 border-indigo-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {isHindi ? 'क्रेडिट उपयोग' : 'Credit Usage'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CREDIT_COSTS.map(item => (
                    <div 
                      key={item.feature}
                      className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <item.icon className="w-5 h-5 text-indigo-400" />
                        <span className="text-xs font-medium text-slate-300">
                          {isHindi ? item.nameHi : item.name}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-amber-400">{item.cost}</p>
                      <p className="text-xs text-slate-500">{isHindi ? 'क्रेडिट्स' : 'credits'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                  <div>
                    <p className="font-medium text-white">
                      {isHindi ? 'प्रो प्लान अपग्रेड करें' : 'Upgrade to Pro'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {isHindi 
                        ? 'हर महीने 100 क्रेडिट्स पाएं + सभी फीचर्स अनलॉक करें' 
                        : 'Get 100 credits/month + unlock all features'}
                    </p>
                  </div>
                  <button className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                    {isHindi ? 'अपग्रेड' : 'Upgrade'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Top-up Tab */}
          {activeTab === 'topup' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">
                {isHindi ? 'क्रेडिट पैकेज चुनें' : 'Select Credit Package'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CREDIT_PACKAGES.map(pkg => (
                  <div 
                    key={pkg.id}
                    className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                      pkg.popular 
                        ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => !isProcessing && handleBuyCredits(pkg.id)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full">
                        {isHindi ? 'लोकप्रिय' : 'POPULAR'}
                      </div>
                    )}
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/20 rounded-full mb-3">
                        <Coins className="w-6 h-6 text-amber-400" />
                      </div>
                      <p className="text-3xl font-bold text-white">{pkg.credits}</p>
                      <p className="text-sm text-slate-400 mb-4">{isHindi ? 'क्रेडिट्स' : 'Credits'}</p>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-2xl font-bold text-white">₹{pkg.price}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        ₹{(pkg.price / pkg.credits).toFixed(1)}/{isHindi ? 'क्रेडिट' : 'credit'}
                      </p>
                      <button 
                        disabled={isProcessing && selectedPackage === pkg.id}
                        className={`mt-4 w-full py-2 rounded-lg font-medium transition-colors ${
                          pkg.popular
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                      >
                        {isProcessing && selectedPackage === pkg.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isHindi ? 'प्रोसेसिंग...' : 'Processing...'}
                          </>
                        ) : (
                          isHindi ? 'खरीदें' : 'Buy Now'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-slate-500">
                {isHindi 
                  ? '🔒 सिक्योर पेमेंट by Razorpay • UPI, Cards, Net Banking supported' 
                  : '🔒 Secure payment by Razorpay • UPI, Cards, Net Banking supported'}
              </p>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">
                    {isHindi ? 'कोई ट्रांजेक्शन नहीं' : 'No transactions yet'}
                  </p>
                </div>
              ) : (
                transactions.map(tx => (
                  <div 
                    key={tx._id}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'credit_used' 
                          ? 'bg-red-500/20' 
                          : 'bg-green-500/20'
                      }`}>
                        {tx.type === 'credit_used' ? (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{tx.description}</p>
                        <p className="text-sm text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        tx.credits > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tx.credits > 0 ? '+' : ''}{tx.credits} credits
                      </p>
                      {tx.amount > 0 && (
                        <p className="text-sm text-slate-500">₹{tx.amount}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Small credit balance component for header
export const CreditBalance: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-700/50"
    >
      <Coins className="w-4 h-4 text-amber-400" />
      <span className="font-semibold text-white">{user?.wallet?.credits || 0}</span>
    </button>
  );
};

export default WalletDashboard;
