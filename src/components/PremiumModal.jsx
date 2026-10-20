import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Crown, Check, X, ShieldCheck, Zap, Stethoscope, FileText, Smartphone } from 'lucide-react';

export const PremiumModal = ({ isOpen, onClose }) => {
  const { plan, upgradePlan } = useAuth();
  const [selectedTier, setSelectedTier] = useState(plan || 'pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async (tier) => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800)); // Checkout latency simulation
    await upgradePlan(tier);
    setIsProcessing(false);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1500);
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Basic',
      price: '$0',
      period: 'forever',
      badge: 'Basic Tier',
      color: 'border-slate-800 bg-slate-900/60',
      buttonBg: 'bg-slate-800 text-slate-300 hover:bg-slate-700',
      features: [
        '3 AI Symptom Triages / day',
        'Built-in Healthcare Engine',
        'Basic Health Log Timeline',
        'Emergency Room Locator'
      ],
      unavailable: [
        'Gemini 1.5 Pro AI Engine',
        'Unlimited AI Analysis',
        'Health PDF Report Digest',
        'AI Telehealth Specialist Connect',
        'Smart Pill Scanner Simulator'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Care',
      price: '$9.99',
      period: 'per month',
      badge: 'Most Popular 🔥',
      popular: true,
      color: 'border-emerald-500/80 bg-slate-900/90 glow-emerald',
      buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/30 hover:scale-105',
      features: [
        'Unlimited AI Symptom Triages',
        'Google Gemini 1.5 Pro Model',
        'Unlimited PDF Digest Exports',
        'Browser Desktop Medication Push Alerts',
        'Hydration & BMI Calculation Tools',
        'Smart Medication Pill Scanner'
      ],
      unavailable: [
        'Priority 24/7 Telehealth Video Connect'
      ]
    },
    {
      id: 'vip',
      name: 'VIP Ultra',
      price: '$24.99',
      period: 'per month',
      badge: 'Complete Care 💎',
      color: 'border-cyan-500/80 bg-gradient-to-b from-slate-900 to-cyan-950/40',
      buttonBg: 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-lg shadow-cyan-500/30 hover:scale-105',
      features: [
        'Everything in Pro Care Plan',
        '24/7 AI Specialist Telehealth Connect',
        'Priority Virtual Doctor Consultations',
        'Live Wearable Device Vitals Sync',
        'Executive Family Health Profiles (5 Users)',
        'VIP Concierge Medical Assistant Support'
      ],
      unavailable: []
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Upgrade to Premium Membership</h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Current: {plan.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">Unlock Gemini 1.5 Pro AI reasoning, telehealth connect, and PDF digests.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-200 text-sm font-bold text-center animate-bounce">
            🎉 Subscription successfully updated to {selectedTier.toUpperCase()} Plan!
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {plans.map((p) => {
            const isCurrent = plan === p.id;
            return (
              <div 
                key={p.id} 
                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-6 relative ${p.color} ${
                  isCurrent ? 'ring-2 ring-emerald-400' : ''
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase font-extrabold tracking-wider px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                    {p.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400">{p.badge}</span>
                    <h3 className="text-lg font-black text-white">{p.name}</h3>
                    <div className="flex items-baseline gap-1 pt-1">
                      <span className="text-3xl font-black text-white font-mono">{p.price}</span>
                      <span className="text-xs text-slate-400 font-medium">/{p.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-200">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {p.unavailable.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600 line-through">
                        <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isCurrent || isProcessing}
                  onClick={() => {
                    setSelectedTier(p.id);
                    handleUpgrade(p.id);
                  }}
                  className={`w-full py-3 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 ${p.buttonBg} ${
                    isCurrent ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing && selectedTier === p.id ? (
                    <span>Activating Subscription…</span>
                  ) : isCurrent ? (
                    <span>Active Plan</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Upgrade to {p.name}</span>
                    </>
                  )}
                </button>

              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Cancel anytime with 1-click. 256-bit encrypted checkout guarantee.</span>
          </div>
          <span className="text-emerald-400 font-bold hidden md:inline">Instant Access Unlocked</span>
        </div>

      </div>
    </div>
  );
};
