import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Stethoscope, 
  Clock, 
  Pill, 
  Droplet, 
  HeartPulse, 
  Plus, 
  ArrowRight,
  Calculator,
  Crown,
  Video,
  RefreshCw,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const Dashboard = ({ setActiveTab }) => {
  const { 
    user, 
    plan, 
    symptomHistory, 
    reminders, 
    waterIntake, 
    addWater, 
    setIsPremiumModalOpen, 
    setIsTelehealthModalOpen,
    wearableVitals,
    syncWearableVitals
  } = useAuth();

  // Dynamic Health Score Algorithm (0 - 100)
  const calculateHealthScore = () => {
    let score = 92;
    if (symptomHistory.length > 3) score -= 10;
    if (symptomHistory.some(s => s.severityScale >= 7)) score -= 15;
    if (waterIntake.currentMl < waterIntake.targetMl * 0.5) score -= 10;
    if (reminders.some(r => !r.isActive)) score -= 5;
    return Math.max(35, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();

  // Dynamic BMI Calculation from User Profile
  const heightCm = user?.profile?.heightCm || 168;
  const weightKg = user?.profile?.weightKg || 62;
  const heightM = heightCm / 100;
  const bmiVal = (weightKg / (heightM * heightM)).toFixed(1);

  const getBMICategoryLabel = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi <= 24.9) return 'Normal Weight';
    if (bmi <= 29.9) return 'Overweight';
    return 'Obese';
  };

  const bmiCatLabel = getBMICategoryLabel(Number(bmiVal));

  return (
    <div className="space-y-8 py-4">
      
      {/* Welcome & Premium Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>Authenticated Patient Workspace</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>{plan.toUpperCase()} TIER</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Welcome back, {user?.name || 'Patient'}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Monitor your personal wellness score, track active prescription schedules, run Gemini AI symptom triages, and consult telehealth specialists.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsTelehealthModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs hover:bg-cyan-500/30 transition-all"
          >
            <Video className="w-4 h-4" />
            <span>Telehealth Consult</span>
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <Stethoscope className="w-4 h-4" />
            <span>New AI Triage</span>
          </button>
        </div>
      </div>

      {/* Wearable Device Vitals Live Sync Widget */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Wearable Device Live Vitals Sync</h3>
              <span className="text-[10px] text-slate-400">Apple Watch / Fitbit / Galaxy Ring Sync • Last updated {wearableVitals.lastSynced}</span>
            </div>
          </div>

          <button
            onClick={syncWearableVitals}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sync Vitals</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Heart Rate</span>
            <div className="text-lg font-black text-rose-400 font-mono">{wearableVitals.heartRate} <span className="text-xs font-normal">BPM</span></div>
            <span className="text-[10px] text-emerald-400 font-semibold">Normal Resting</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Blood Oxygen (SpO2)</span>
            <div className="text-lg font-black text-cyan-400 font-mono">{wearableVitals.spO2}%</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Optimal Oxygenation</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Sleep Score</span>
            <div className="text-lg font-black text-indigo-400 font-mono">{wearableVitals.sleepScore} <span className="text-xs font-normal">/ 100</span></div>
            <span className="text-[10px] text-indigo-300 font-semibold">7.5 hrs Restful</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Daily Activity</span>
            <div className="text-lg font-black text-emerald-400 font-mono">{wearableVitals.steps} <span className="text-xs font-normal">steps</span></div>
            <span className="text-[10px] text-slate-400 font-semibold">{wearableVitals.activeCal} kcal burned</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Health Score Ring Gauge */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-5">
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="8" fill="transparent" />
              <circle 
                cx="40" cy="40" r="32" 
                stroke={healthScore >= 75 ? '#10b981' : healthScore >= 50 ? '#f59e0b' : '#ef4444'} 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="200" 
                strokeDashoffset={200 - (200 * healthScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-lg font-black text-white">{healthScore}</span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Wellness Index</span>
            <h3 className="text-base font-bold text-white">Health Score</h3>
            <span className={`text-xs font-semibold ${healthScore >= 75 ? 'text-emerald-400' : healthScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {healthScore >= 75 ? 'Optimal Status' : healthScore >= 50 ? 'Moderate Alert' : 'Attention Needed'}
            </span>
          </div>
        </div>

        {/* Water Intake Tracker */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold text-white">Hydration</span>
            </div>
            <span className="text-xs font-mono text-cyan-400">{waterIntake.currentMl} / {waterIntake.targetMl} ml</span>
          </div>
          
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-cyan-400 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, (waterIntake.currentMl / waterIntake.targetMl) * 100)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => addWater(250)}
              className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-bold hover:bg-cyan-500/20 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> 250ml
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className="text-[11px] text-slate-400 hover:text-white"
            >
              Water Goal
            </button>
          </div>
        </div>

        {/* Active Meds Summary */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-400" />
              <span className="text-xs font-bold text-white">Medications</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
              {reminders.filter(r => r.isActive).length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {reminders.length > 0 ? `Active prescription: ${reminders[0].name} (${reminders[0].dosage})` : 'No active prescriptions.'}
          </p>
          <button 
            onClick={() => setActiveTab('reminders')}
            className="text-xs text-teal-400 font-bold flex items-center gap-1 hover:gap-2 transition-all pt-1"
          >
            <span>View Reminders</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BMI Quick Card - Dynamic from Profile */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold text-white">BMI Index</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">{bmiVal} {bmiCatLabel}</span>
          </div>
          <p className="text-xs text-slate-400">Height: {heightCm} cm | Weight: {weightKg} kg</p>
          <button 
            onClick={() => setActiveTab('tools')}
            className="text-xs text-indigo-400 font-bold flex items-center gap-1 hover:gap-2 transition-all pt-1"
          >
            <span>Calculate BMI</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Symptom History Stream (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Recent AI Triage History</span>
            </h3>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs text-emerald-400 font-bold hover:underline"
            >
              View All Logs ({symptomHistory.length})
            </button>
          </div>

          <div className="space-y-3">
            {symptomHistory.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">No symptoms logged yet.</p>
                <button onClick={() => setActiveTab('triage')} className="text-xs text-emerald-400 font-bold underline">
                  Start your first triage session
                </button>
              </div>
            ) : (
              symptomHistory.slice(0, 3).map((item) => (
                <div key={item.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {item.inputMode || 'text'}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.severityScale >= 7 ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      item.severityScale >= 4 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      Severity {item.severityScale}/10
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200">
                    "{item.rawInput}"
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-emerald-400">AI Summary: </span>
                    <span>{item.aiAnalysis?.summary}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Emergency Sidebar (1 col) */}
        <div className="space-y-5">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white">Emergency Assistance</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experiencing acute chest pain, severe shortness of breath, or stroke symptoms?
            </p>
            <a
              href="tel:911"
              className="block w-full py-3 text-center rounded-xl bg-red-600 text-white font-extrabold text-xs shadow-lg hover:bg-red-500 transition-colors"
            >
              Call 911 / 112 Hotline
            </a>
            <button
              onClick={() => setActiveTab('hospitals')}
              className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Find Nearby Hospitals
            </button>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white">Medical Demographics Summary</h4>
            <div className="text-xs space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Blood Group</span>
                <span className="font-bold text-emerald-400">{user?.profile?.bloodGroup || 'O+'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Allergies</span>
                <span className="font-bold">{user?.profile?.allergies ? user.profile.allergies.join(', ') : 'None'}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Emergency Contact</span>
                <span className="font-bold">{user?.profile?.emergencyContact?.name || 'N/A'}</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('profile')}
              className="w-full text-center py-2 text-xs font-bold text-emerald-400 hover:underline"
            >
              Edit Profile Details
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
