import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pill, Plus, Bell, Trash2, CheckCircle2, Clock, Camera, Sparkles, AlertCircle, Scan } from 'lucide-react';

export const MedicineReminders = () => {
  const { reminders, addReminder, toggleReminder, deleteReminder, plan, setIsPremiumModalOpen } = useAuth();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedMed, setScannedMed] = useState(null);

  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('500mg');
  const [frequency, setFrequency] = useState('Once Daily');
  const [time, setTime] = useState('08:00');
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const newMed = {
      id: 'med_' + Date.now(),
      name: medName,
      dosage,
      frequency,
      times: [time],
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31'
    };

    addReminder(newMed);
    setMedName('');
    setShowAddModal(false);
  };

  const triggerTestAlert = (name, dosageStr) => {
    const alertText = `Time to take ${name} (${dosageStr})`;
    setNotificationMsg(`🔔 REMINDER: ${alertText}!`);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('💊 AI Health Assistant - Medicine Alert', {
        body: alertText,
        icon: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png'
      });
    }

    setTimeout(() => setNotificationMsg(null), 6000);
  };

  const handleScanPill = () => {
    if (plan === 'free') {
      setIsPremiumModalOpen(true);
      return;
    }

    setShowScannerModal(true);
    setIsScanning(true);
    setScannedMed(null);

    setTimeout(() => {
      setIsScanning(false);
      const mockScanned = {
        name: 'Atorvastatin (Lipitor)',
        dosage: '20mg',
        frequency: 'Once Daily',
        purpose: 'Cholesterol management & Cardiovascular Support'
      };
      setScannedMed(mockScanned);
    }, 1800);
  };

  const handleApplyScanned = () => {
    if (scannedMed) {
      setMedName(scannedMed.name);
      setDosage(scannedMed.dosage);
      setFrequency(scannedMed.frequency);
      setShowScannerModal(false);
      setShowAddModal(true);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <Pill className="w-8 h-8 text-teal-400" />
            <span>Medication Reminders & Pill Scanner</span>
          </h1>
          <p className="text-xs text-slate-400">
            Configure prescription schedules, daily dosage alerts, and smart pill identification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScanPill}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-teal-500/40 text-teal-300 text-xs font-bold hover:bg-slate-800"
          >
            <Scan className="w-4 h-4 text-teal-400" />
            <span>Smart Pill Scanner</span>
          </button>

          {notificationPermission !== 'granted' && 'Notification' in window && (
            <button
              onClick={requestNotificationPermission}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Enable Alerts</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* Test Notification Banner */}
      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-teal-500/20 border border-teal-500/50 text-teal-200 text-xs font-bold flex items-center justify-between animate-bounce shadow-xl">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-teal-400 animate-pulse" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-xs text-teal-400 underline hover:text-white">Dismiss</button>
        </div>
      )}

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reminders.length === 0 ? (
          <div className="md:col-span-2 glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No active medication reminders</h3>
            <p className="text-xs text-slate-500">Click "Add Medication" to schedule dosage alerts.</p>
          </div>
        ) : (
          reminders.map((med) => (
            <div key={med.id} className={`glass-panel p-6 rounded-3xl border transition-all ${
              med.isActive ? 'border-slate-800 hover:border-teal-500/40' : 'border-slate-900 opacity-60'
            }`}>
              
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                    med.isActive ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">{med.name}</h3>
                    <span className="text-xs text-slate-400">{med.dosage} • {med.frequency}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleReminder(med.id)}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                    med.isActive 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {med.isActive ? 'Active' : 'Paused'}
                </button>
              </div>

              <div className="pt-3 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    <span>Scheduled Times</span>
                  </span>
                  <span className="font-mono font-bold text-white">{med.times?.join(', ')}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => triggerTestAlert(med.name, med.dosage)}
                    className="text-xs font-bold text-teal-400 flex items-center gap-1.5 hover:underline"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Test Notification</span>
                  </button>

                  <button
                    onClick={() => deleteReminder(med.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Pill Scanner Modal */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scan className="w-5 h-5 text-teal-400" />
                <span>Smart Pill Scanner Simulator</span>
              </h3>
              <button onClick={() => setShowScannerModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {isScanning ? (
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <Scan className="w-12 h-12 text-teal-400 mx-auto animate-pulse" />
                <span className="text-xs text-slate-300 font-bold block">Analyzing Pill Image with Computer Vision…</span>
              </div>
            ) : (
              scannedMed && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-400">Match Identified</span>
                  <h4 className="text-base font-extrabold text-white">{scannedMed.name}</h4>
                  <p className="text-xs text-slate-300">Dosage: {scannedMed.dosage} | Frequency: {scannedMed.frequency}</p>
                  <p className="text-xs text-slate-400">Indication: {scannedMed.purpose}</p>

                  <button
                    onClick={handleApplyScanned}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400"
                  >
                    Add to Medication Schedule
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-400" />
              <span>Schedule New Medication</span>
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Medication / Supplement Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amoxicillin, Paracetamol, Vitamin D3"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Dosage</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="Once Daily">Once Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Every 8 Hours">Every 8 Hours</option>
                    <option value="As Needed">As Needed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Alert Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 text-xs font-black hover:bg-teal-400 transition-colors"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
