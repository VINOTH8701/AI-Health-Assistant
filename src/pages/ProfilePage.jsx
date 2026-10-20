import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Crown, Save, Phone, Sparkles } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, plan, setIsPremiumModalOpen } = useAuth();
  
  const [formData, setFormData] = useState({
    age: user?.profile?.age || 32,
    gender: user?.profile?.gender || 'Female',
    bloodGroup: user?.profile?.bloodGroup || 'O+',
    heightCm: user?.profile?.heightCm || 168,
    weightKg: user?.profile?.weightKg || 62,
    allergies: user?.profile?.allergies ? user.profile.allergies.join(', ') : 'Penicillin, Peanuts',
    chronicConditions: user?.profile?.chronicConditions ? user.profile.chronicConditions.join(', ') : 'Mild Asthma',
    emergencyName: user?.profile?.emergencyContact?.name || 'David Morgan',
    emergencyPhone: user?.profile?.emergencyContact?.phone || '+1 (555) 234-5678',
    emergencyRelation: user?.profile?.emergencyContact?.relationship || 'Spouse'
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      age: Number(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      heightCm: Number(formData.heightCm),
      weightKg: Number(formData.weightKg),
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: formData.chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relationship: formData.emergencyRelation
      }
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <User className="w-8 h-8 text-emerald-400" />
            <span>Profile & Medical Records</span>
          </h1>
          <p className="text-xs text-slate-400">
            Configure your personal demographics, allergies, and emergency contact details.
          </p>
        </div>

        {savedMsg && (
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ✓ Changes Saved
          </span>
        )}
      </div>

      {/* Subscription Status Card */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Membership Plan: {plan.toUpperCase()}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Active</span>
            </div>
            <p className="text-xs text-slate-400">Gemini 1.5 Pro reasoning & unlimited triage active.</p>
          </div>
        </div>

        <button
          onClick={() => setIsPremiumModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-black hover:scale-105 transition-all"
        >
          Manage Tier
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* User Card */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500/20"
          />
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Role: {user?.role}
            </span>
          </div>
        </div>

        {/* Demographics Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Demographics & Vitals</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Biological Sex</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Blood Group</label>
              <input
                type="text"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Height (cm)</label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Weight (kg)</label>
              <input
                type="number"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Medical History</h3>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Known Allergies (Comma separated)</label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Pre-existing Chronic Conditions</label>
              <input
                type="text"
                value={formData.chronicConditions}
                onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-400" />
            <span>Emergency Contact Details</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Contact Person Name</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Relationship</label>
              <input
                type="text"
                value={formData.emergencyRelation}
                onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Phone Number</label>
              <input
                type="text"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>

      </form>

    </div>
  );
};
