import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Stethoscope, Video, MessageSquare, Star, Clock, CheckCircle2, X, Send, Sparkles, User } from 'lucide-react';

export const TelehealthModal = ({ isOpen, onClose }) => {
  const { plan, setIsPremiumModalOpen } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isConsultationBooked, setIsConsultationBooked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiService.fetchDoctors().then(docs => setDoctors(docs));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartConsultation = (doc) => {
    if (plan !== 'vip' && plan !== 'pro') {
      setIsPremiumModalOpen(true);
      return;
    }

    setSelectedDoc(doc);
    setChatMode(true);
    setChatMessages([
      {
        sender: 'doctor',
        text: `Hello! I am ${doc.name}, Specialist in ${doc.specialty} at ${doc.hospital}. How may I assist with your symptoms today?`
      }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !selectedDoc) return;

    const userText = inputMsg;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');

    // Doctor response simulation
    setTimeout(() => {
      let docReply = `Thank you for sharing. Based on your inputs, I recommend continuing your rest, keeping hydrated, and scheduling a follow-up if symptoms persist past 48 hours.`;
      if (userText.toLowerCase().includes('pain') || userText.toLowerCase().includes('headache')) {
        docReply = `I understand. For headache/pain symptoms, ensure adequate room ventilation, avoid screen glare, and take prescribed medication as directed.`;
      }
      setChatMessages(prev => [...prev, { sender: 'doctor', text: docReply }]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">AI Specialist Telehealth Consultation</h2>
              <p className="text-xs text-slate-400">Virtual doctor appointments & live medical chat support 24/7</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan check notice */}
        {plan !== 'vip' && plan !== 'pro' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <span>🔒 Telehealth Connect is an exclusive feature for Pro & VIP Ultra members.</span>
            <button
              onClick={() => {
                onClose();
                setIsPremiumModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-extrabold"
            >
              Upgrade Now
            </button>
          </div>
        )}

        {/* Chat mode or Doctor List */}
        {chatMode && selectedDoc ? (
          <div className="space-y-4">
            
            {/* Active Doctor Banner */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selectedDoc.image} alt={selectedDoc.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedDoc.name}</h4>
                  <p className="text-xs text-slate-400">{selectedDoc.specialty}</p>
                </div>
              </div>
              <button
                onClick={() => setChatMode(false)}
                className="text-xs text-slate-400 hover:text-white font-bold"
              >
                Back to Directory
              </button>
            </div>

            {/* Chat Box */}
            <div className="h-64 overflow-y-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.sender === 'user' ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-semibold'
                      : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask Dr. Elena Rostova a clinical question..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>

          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Board-Certified Specialists</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div key={doc.id} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4">
                  <div className="flex items-start gap-3">
                    <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/30" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{doc.name}</h4>
                      <p className="text-xs text-cyan-400 font-semibold">{doc.specialty}</p>
                      <span className="text-[11px] text-slate-400">{doc.hospital}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{doc.rating} ({doc.experienceYears} yrs)</span>
                    </div>
                    <span className="text-slate-400 font-mono">{doc.availability}</span>
                  </div>

                  <button
                    onClick={() => handleStartConsultation(doc)}
                    className="w-full py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Start Virtual Consultation</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
