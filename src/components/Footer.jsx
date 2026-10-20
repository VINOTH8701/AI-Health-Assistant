import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Activity, Heart, Shield, Crown, Wifi, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  const { setIsPremiumModalOpen } = useAuth();
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    apiService.checkServerHealth().then(res => {
      setServerStatus(res.status === 'online' ? 'Online' : 'Offline (Local)');
    });
  }, []);

  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/90 py-12 px-4 lg:px-8 text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white">AI Health Assistant</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enterprise MERN Stack Healthcare Assistant with Google Gemini Generative AI triage, PDF digest exports, and 24/7 emergency response.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${serverStatus === 'Online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-slate-300 font-mono">REST Server: {serverStatus}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-3">Core Modules</h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-emerald-400 cursor-pointer">AI Symptom Triage</li>
            <li className="hover:text-emerald-400 cursor-pointer">Health History Timeline</li>
            <li className="hover:text-emerald-400 cursor-pointer">Medicine Reminders</li>
            <li className="hover:text-emerald-400 cursor-pointer">Leaflet Hospital Finder</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-3">Premium Services</h4>
          <ul className="space-y-2 text-xs">
            <li onClick={() => setIsPremiumModalOpen(true)} className="hover:text-amber-400 cursor-pointer flex items-center gap-1.5 text-amber-300">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Pro Care & VIP Ultra</span>
            </li>
            <li className="hover:text-emerald-400 cursor-pointer">AI Specialist Telehealth</li>
            <li className="hover:text-emerald-400 cursor-pointer">Smart Pill Scanner</li>
            <li className="hover:text-emerald-400 cursor-pointer">Wearable Device Live Sync</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-3">Compliance & Safety</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>256-bit Encrypted JWT Auth</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Gemini 1.5 Pro AI Engine</span>
            </div>
            <p className="text-[10px] text-slate-500 pt-2">
              Non-diagnostic wellness application for initial triage guidance.
            </p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 AI Health Assistant. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 md:mt-0">
          Built with <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" /> for Next-Gen Healthcare
        </p>
      </div>
    </footer>
  );
};
