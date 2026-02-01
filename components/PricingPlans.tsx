import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { 
  X, Check, Crown, Sparkles, Zap, Shield, Users, 
  ChevronRight, Loader2, Star, Infinity
} from 'lucide-react';

const API_URL = 'http://localhost:5001';

interface PricingPlansProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    nameHi: 'फ्री',
    price: 0,
    priceYearly: 0,
    credits: 10,
    icon: Zap,
    color: 'from-slate-500 to-slate-600',
    features: [
      { text: 'Basic Resume Analysis', textHi: 'बेसिक रिज्यूमे एनालिसिस', included: true },
      { text: '10 Free Credits', textHi: '10 फ्री क्रेडिट्स', included: true },
      { text: 'Email Support', textHi: 'ईमेल सपोर्ट', included: true },
      { text: 'Interview Video Analysis', textHi: 'इंटरव्यू वीडियो एनालिसिस', included: false },
      { text: 'Cover Letter Generator', textHi: 'कवर लेटर जनरेटर', included: false },
      { text: 'Priority Support', textHi: 'प्रायोरिटी सपोर्ट', included: false }
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    nameHi: 'प्रो',
    price: 299,
    priceYearly: 2999,
    credits: 100,
    icon: Crown,
    color: 'from-indigo-500 to-purple-600',
    popular: true,
    features: [
      { text: 'All Features Unlocked', textHi: 'सभी फीचर्स अनलॉक', included: true },
      { text: '100 Credits/Month', textHi: '100 क्रेडिट्स/महीना', included: true },
      { text: 'Interview Video Analysis', textHi: 'इंटरव्यू वीडियो एनालिसिस', included: true },
      { text: 'Cover Letter Generator', textHi: 'कवर लेटर जनरेटर', included: true },
      { text: 'LinkedIn Optimizer', textHi: 'लिंक्डइन ऑप्टिमाइज़र', included: true },
      { text: 'Priority Support', textHi: 'प्रायोरिटी सपोर्ट', included: true }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameHi: 'एंटरप्राइज',
    price: 999,
    priceYearly: 9999,
    credits: -1, // Unlimited
    icon: Shield,
    color: 'from-amber-500 to-orange-600',
    features: [
      { text: 'Unlimited Credits', textHi: 'अनलिमिटेड क्रेडिट्स', included: true },
      { text: 'API Access', textHi: 'API एक्सेस', included: true },
      { text: 'Custom Integrations', textHi: 'कस्टम इंटीग्रेशन', included: true },
      { text: 'Dedicated Support', textHi: 'डेडिकेटेड सपोर्ट', included: true },
      { text: 'White-label Option', textHi: 'व्हाइट-लेबल ऑप्शन', included: true },
      { text: 'Team Management', textHi: 'टीम मैनेजमेंट', included: true }
    ]
  }
];

export const PricingPlans: React.FC<PricingPlansProps> = ({ isOpen, onClose }) => {
  const { user, token, refreshUser, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const isHindi = language === 'hi';

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated || !token) {
      alert(isHindi ? 'पहले लॉगिन करें' : 'Please login first');
      return;
    }

    if (planId === 'free') {
      onClose();
      return;
    }

    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      const packageId = `${planId}_${billingPeriod}`;
      
      // Create order
      const orderResponse = await fetch(`${API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ packageId, type: 'subscription' })
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
        description: `${planId.toUpperCase()} Subscription - ${billingPeriod}`,
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
            alert(isHindi ? 'सब्सक्रिप्शन सफल!' : 'Subscription successful!');
            onClose();
          } else {
            alert(isHindi ? 'पेमेंट वेरिफिकेशन फेल' : 'Payment verification failed');
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
      console.error('Subscription error:', error);
      alert(isHindi ? 'कुछ गलत हो गया' : 'Something went wrong');
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  if (!isOpen) return null;

  const currentPlan = user?.subscription?.plan || 'free';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center pt-10 pb-8 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full text-indigo-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            {isHindi ? 'अपना प्लान चुनें' : 'Choose Your Plan'}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {isHindi ? 'सब्सक्रिप्शन प्लान्स' : 'Subscription Plans'}
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            {isHindi 
              ? 'अपने करियर को नई ऊंचाइयों पर ले जाएं AI Interview Coach के साथ' 
              : 'Take your career to new heights with AI Interview Coach'}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              {isHindi ? 'मासिक' : 'Monthly'}
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-slate-700 rounded-full transition-colors"
            >
              <div className={`absolute top-1 w-5 h-5 bg-indigo-500 rounded-full transition-all ${
                billingPeriod === 'yearly' ? 'left-8' : 'left-1'
              }`} />
            </button>
            <span className={`text-sm flex items-center gap-2 ${billingPeriod === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
              {isHindi ? 'वार्षिक' : 'Yearly'}
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                {isHindi ? '2 महीने फ्री' : '2 months free'}
              </span>
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-10">
          {PLANS.map(plan => {
            const isCurrentPlan = currentPlan === plan.id;
            const price = billingPeriod === 'yearly' ? plan.priceYearly : plan.price;
            const Icon = plan.icon;

            return (
              <div 
                key={plan.id}
                className={`relative rounded-2xl border-2 p-6 transition-all ${
                  plan.popular 
                    ? 'border-indigo-500 bg-gradient-to-b from-indigo-500/10 to-transparent' 
                    : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {isHindi ? 'सबसे लोकप्रिय' : 'MOST POPULAR'}
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                    {isHindi ? 'वर्तमान' : 'Current'}
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {isHindi ? plan.nameHi : plan.name}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">
                      {price === 0 ? (isHindi ? 'फ्री' : 'Free') : `₹${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-slate-400 text-sm">
                        /{billingPeriod === 'yearly' ? (isHindi ? 'साल' : 'year') : (isHindi ? 'महीना' : 'month')}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1 text-slate-400 text-sm">
                    {plan.credits === -1 ? (
                      <>
                        <Infinity className="w-4 h-4 text-amber-400" />
                        <span>{isHindi ? 'अनलिमिटेड क्रेडिट्स' : 'Unlimited Credits'}</span>
                      </>
                    ) : (
                      <span>{plan.credits} {isHindi ? 'क्रेडिट्स/महीना' : 'credits/month'}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-slate-600 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-slate-300' : 'text-slate-500'}>
                        {isHindi ? feature.textHi : feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing || isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                      : isCurrentPlan
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isHindi ? 'प्रोसेसिंग...' : 'Processing...'}
                    </>
                  ) : isCurrentPlan ? (
                    isHindi ? 'वर्तमान प्लान' : 'Current Plan'
                  ) : plan.id === 'free' ? (
                    isHindi ? 'फ्री से शुरू करें' : 'Start Free'
                  ) : (
                    <>
                      {isHindi ? 'अपग्रेड करें' : 'Upgrade'}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pb-8 text-center">
          <p className="text-sm text-slate-500">
            {isHindi 
              ? '🔒 सिक्योर पेमेंट • कभी भी कैंसल करें • 7 दिन की मनी-बैक गारंटी' 
              : '🔒 Secure payment • Cancel anytime • 7-day money-back guarantee'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
