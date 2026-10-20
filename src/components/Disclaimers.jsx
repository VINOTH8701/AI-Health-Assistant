import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const Disclaimers = ({ inline = false }) => {
  return (
    <div className={`rounded-xl border p-4 text-xs leading-relaxed ${
      inline 
        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200/90' 
        : 'bg-slate-900/80 border-slate-800 text-slate-400'
    }`}>
      <div className="flex items-center gap-2 mb-1.5 font-bold text-slate-200">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Medical Non-Diagnostic Disclaimer</span>
      </div>
      <p>
        The <strong>AI Health Assistant</strong> is intended solely for educational and preliminary health awareness purposes. 
        It does not issue medical diagnoses, prescribe drugs, or substitute for consultation with qualified healthcare professionals. 
        If you are experiencing a medical emergency, immediately contact your local emergency services (e.g., 911 / 112).
      </p>
    </div>
  );
};
