import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, 
  Activity, 
  Clock, 
  Pill, 
  MapPin, 
  FileText, 
  Mic, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Crown,
  Video,
  Check,
  Zap,
  Brain
} from 'lucide-react';
import { Disclaimers } from '../components/Disclaimers';

export const LandingPage = ({ setActiveTab, onStartTriage }) => {
  const { plan, setIsPremiumModalOpen, setIsTelehealthModalOpen } = useAuth();

  return (
    <div className="space-y-24 py-6">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-teal-500/10 blur-[110px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10 px-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Next-Gen MERN Stack Healthcare Assistant</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Intelligent AI Symptom Triage & <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Personalized Wellness Companion
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Describe your health symptoms in natural text or voice speech. Receive instantaneous non-diagnostic wellness insights powered by Google Gemini AI, track your historical medical timeline, and consult top virtual specialists.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartTriage}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all duration-200"
            >
              <Stethoscope className="w-5 h-5" />
              <span>Start AI Symptom Triage</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-amber-500/10"
            >
              <Crown className="w-5 h-5 text-amber-400" />
              <span>Upgrade to Pro Care</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="block text-2xl md:text-3xl font-black text-emerald-400">99.8%</span>
              <span className="text-xs text-slate-400 font-medium">Uptime Security SLA</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="block text-2xl md:text-3xl font-black text-teal-400">&lt;1.2s</span>
              <span className="text-xs text-slate-400 font-medium">Gemini 1.5 Pro Latency</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="block text-2xl md:text-3xl font-black text-cyan-400">100%</span>
              <span className="text-xs text-slate-400 font-medium">Encrypted JWT Sessions</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="block text-2xl md:text-3xl font-black text-amber-400">24/7</span>
              <span className="text-xs text-slate-400 font-medium">AI Telehealth Support</span>
            </div>
          </div>

        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Comprehensive System Features</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Architected using robust enterprise patterns for seamless healthcare triage and personal record management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Google Gemini AI Triage</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Natural language symptom parsing with automated emergency red-flag heuristics and non-diagnostic recommendations.
            </p>
            <button onClick={() => setActiveTab('triage')} className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:gap-2 transition-all">
              <span>Try Triage Engine</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Telehealth Connect</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Instant virtual doctor chat & 24/7 appointments with board-certified cardiologists, neurologists, and pediatricians.
            </p>
            <button onClick={() => setIsTelehealthModalOpen(true)} className="text-xs font-bold text-cyan-400 flex items-center gap-1 hover:gap-2 transition-all">
              <span>Connect Specialist</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Health History Timeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Interactive timeline with Chart.js analytics graphs, keyword search, severity filtering, and PDF export.
            </p>
            <button onClick={() => setActiveTab('history')} className="text-xs font-bold text-teal-400 flex items-center gap-1 hover:gap-2 transition-all">
              <span>View Timeline</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Medicine Reminders & Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Smart pill identifier simulator, prescription dose scheduling, and browser desktop alert push notifications.
            </p>
            <button onClick={() => setActiveTab('reminders')} className="text-xs font-bold text-amber-400 flex items-center gap-1 hover:gap-2 transition-all">
              <span>Schedule Medications</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Voice Input Speech Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Integrated HTML5 Web Speech API allowing hands-free verbal dictation of health symptoms.
            </p>
            <button onClick={onStartTriage} className="text-xs font-bold text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all">
              <span>Try Speech Input</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">PDF Report Exporter</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Instantly compile patient health logs and emergency profiles into formatted downloadable PDF digests.
            </p>
            <button onClick={() => setActiveTab('history')} className="text-xs font-bold text-rose-400 flex items-center gap-1 hover:gap-2 transition-all">
              <span>Export Reports</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* PREMIUM PLANS SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Membership Tiers</span>
          <h2 className="text-2xl md:text-3xl font-black text-white">Choose Your Healthcare Tier</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Upgrade to Pro Care or VIP Ultra to unlock unlimited AI triages, Gemini 1.5 Pro reasoning, and virtual doctor consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-400">Basic Tier</span>
            <h3 className="text-xl font-bold text-white">Free Plan</h3>
            <div className="text-3xl font-black text-white font-mono">$0</div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 3 AI Triages / day</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Basic Timeline Logs</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Hospital Finder Map</li>
            </ul>
            <button onClick={() => setActiveTab('triage')} className="w-full py-3 rounded-xl bg-slate-800 text-xs font-bold text-white">Current Free Tier</button>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/80 bg-slate-900/90 glow-emerald space-y-4 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase font-extrabold tracking-wider px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950">Most Popular</span>
            <span className="text-xs font-bold text-emerald-400">Pro Tier</span>
            <h3 className="text-xl font-bold text-white">Pro Care Plan</h3>
            <div className="text-3xl font-black text-white font-mono">$9.99 <span className="text-xs text-slate-400">/mo</span></div>
            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited AI Triages</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Gemini 1.5 Pro AI Engine</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited PDF Digest Export</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Smart Pill Scanner</li>
            </ul>
            <button onClick={() => setIsPremiumModalOpen(true)} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs">Upgrade to Pro</button>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/80 bg-slate-900/90 space-y-4">
            <span className="text-xs font-bold text-cyan-400">VIP Tier</span>
            <h3 className="text-xl font-bold text-white">VIP Ultra Plan</h3>
            <div className="text-3xl font-black text-white font-mono">$24.99 <span className="text-xs text-slate-400">/mo</span></div>
            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Everything in Pro Care</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> 24/7 AI Telehealth Connect</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Wearable Device Live Sync</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Family Profiles (5 Users)</li>
            </ul>
            <button onClick={() => setIsPremiumModalOpen(true)} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-xs">Get VIP Ultra</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-slate-800 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">System Workflow</span>
            <h2 className="text-2xl md:text-3xl font-black text-white">How The System Operates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="space-y-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-base">1</div>
              <h4 className="text-sm font-bold text-white">Describe Symptoms</h4>
              <p className="text-xs text-slate-400">Input symptoms via text or verbal microphone speech dictation.</p>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 font-black flex items-center justify-center text-base">2</div>
              <h4 className="text-sm font-bold text-white">AI & Red Flag Check</h4>
              <p className="text-xs text-slate-400">Gemini LLM parses inputs while safety algorithms scan for emergency triggers.</p>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-base">3</div>
              <h4 className="text-sm font-bold text-white">Receive Guidance & Doctors</h4>
              <p className="text-xs text-slate-400">Get non-diagnostic causes, self-care steps, and virtual doctor telehealth connect.</p>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-slate-950 font-black flex items-center justify-center text-base">4</div>
              <h4 className="text-sm font-bold text-white">Track & Export Digest</h4>
              <p className="text-xs text-slate-400">Save entries to your medical timeline and stream PDF reports for clinical visits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER BANNER */}
      <section className="max-w-5xl mx-auto px-4">
        <Disclaimers inline={true} />
      </section>

    </div>
  );
};
