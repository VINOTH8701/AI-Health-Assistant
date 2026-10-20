import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, Navigation } from 'lucide-react';

export const EmergencyBanner = ({ onFindHospitals }) => {
  return (
    <div className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border-2 border-red-500/80 rounded-2xl p-6 shadow-2xl glow-red space-y-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <span className="inline-block px-3 py-1 rounded-full bg-red-600/40 border border-red-400 text-red-200 text-[10px] font-extrabold uppercase tracking-widest">
            High Severity Emergency Warning
          </span>
          <h2 className="text-xl font-black text-white tracking-tight">
            POTENTIALLY LIFE-THREATENING SYMPTOMS DETECTED
          </h2>
          <p className="text-xs text-red-200/90 leading-relaxed">
            The symptoms entered match medical red-flag criteria (such as cardiovascular or respiratory emergency distress). Do not wait for online AI suggestions.
          </p>
        </div>
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-red-800/60">
        <a
          href="tel:911"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs shadow-lg hover:bg-red-500 transition-colors"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call 911 / 112 Emergency</span>
        </a>

        {onFindHospitals && (
          <button
            onClick={onFindHospitals}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Locate Nearest Emergency ER</span>
          </button>
        )}
      </div>
    </div>
  );
};
