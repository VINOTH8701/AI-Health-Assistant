import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calculator, Droplet, Activity, Plus, RefreshCw, HeartPulse, Sparkles } from 'lucide-react';

export const ToolsPage = () => {
  const { user, waterIntake, addWater, resetWater } = useAuth();
  
  // BMI State
  const [heightCm, setHeightCm] = useState(user?.profile?.heightCm || 168);
  const [weightKg, setWeightKg] = useState(user?.profile?.weightKg || 62);

  const calculateBMI = () => {
    const hMeter = heightCm / 100;
    if (hMeter <= 0) return 0;
    return (weightKg / (hMeter * hMeter)).toFixed(1);
  };

  const bmiValue = Number(calculateBMI());

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    if (bmi <= 24.9) return { label: 'Normal Weight', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (bmi <= 29.9) return { label: 'Overweight', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { label: 'Obese Class', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const bmiCat = getBMICategory(bmiValue);

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
          <Calculator className="w-8 h-8 text-indigo-400" />
          <span>Interactive Healthcare Calculation Tools</span>
        </h1>
        <p className="text-xs text-slate-400">
          BMI Index gauge, hydration water tracker, and dynamic health score algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. BMI CALCULATOR */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">BMI Body Mass Index</h3>
              <span className="text-xs text-slate-400">Standard WHO Formula</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Height: {heightCm} cm</span>
              </div>
              <input
                type="range"
                min="120"
                max="220"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Weight: {weightKg} kg</span>
              </div>
              <input
                type="range"
                min="30"
                max="160"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* BMI Result Display */}
          <div className={`p-6 rounded-2xl border border-slate-800 ${bmiCat.bg} text-center space-y-2`}>
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Calculated BMI</span>
            <div className="text-4xl font-black text-white font-mono">{bmiValue}</div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${bmiCat.color} border border-current`}>
              {bmiCat.label}
            </span>
          </div>
        </div>

        {/* 2. HYDRATION WATER TRACKER */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Daily Hydration Water Tracker</h3>
              <span className="text-xs text-slate-400">Target: {waterIntake.targetMl} ml / day</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-200">Current Intake</span>
              <span className="text-lg font-black font-mono text-cyan-400">{waterIntake.currentMl} ml</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (waterIntake.currentMl / waterIntake.targetMl) * 100)}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => addWater(250)}
                className="py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 250 ml
              </button>
              <button
                onClick={() => addWater(500)}
                className="py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 500 ml
              </button>
              <button
                onClick={resetWater}
                className="py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-bold text-xs hover:text-white transition-all flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Optimal daily fluid intake supports cognitive focus, joint lubrication, and cellular metabolism.
          </p>
        </div>

      </div>

    </div>
  );
};
