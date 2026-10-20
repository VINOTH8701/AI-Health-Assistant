import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Stethoscope, 
  Clock, 
  Pill, 
  MapPin, 
  User, 
  ShieldCheck, 
  LogOut, 
  Key, 
  Menu, 
  X, 
  Sparkles,
  Calculator,
  Crown,
  Video
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout, apiKey, saveApiKey, plan, setIsPremiumModalOpen, setIsTelehealthModalOpen } = useAuth();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSaveKey = () => {
    saveApiKey(tempKey);
    setShowKeyModal(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'triage', label: 'AI Triage', icon: Stethoscope, highlight: true },
    { id: 'history', label: 'Health History', icon: Clock },
    { id: 'reminders', label: 'Medicine Alerts', icon: Pill },
    { id: 'hospitals', label: 'Hospital Finder', icon: MapPin },
    { id: 'tools', label: 'Health Tools', icon: Calculator },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: ShieldCheck, admin: true });
  }

  return (
    <>
      <nav className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('landing')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  AI Health Assistant
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {plan.toUpperCase()}
                </span>
              </div>
              <span className="block text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
                MERN + Gemini Triage
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          {user && (
            <div className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive 
                        ? item.admin 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                        : item.highlight
                          ? 'text-emerald-400 hover:bg-emerald-500/10'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.highlight && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Actions & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Telehealth Quick Connect */}
            <button
              onClick={() => setIsTelehealthModalOpen(true)}
              className="p-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-500/20 transition-all"
              title="Virtual AI Doctor Telehealth"
            >
              <Video className="w-4 h-4" />
              <span className="hidden lg:inline">Telehealth</span>
            </button>

            {/* Premium Upgrade Button */}
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 hover:scale-105 transition-all shadow-md shadow-amber-500/20"
            >
              <Crown className="w-4 h-4" />
              <span>{plan === 'free' ? 'Upgrade Pro' : 'PRO Active'}</span>
            </button>

            {/* Gemini API Key Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                apiKey 
                  ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' 
                  : 'border-slate-700 text-slate-400 hover:border-slate-600 bg-slate-900'
              }`}
              title="Configure Google Gemini API Key"
            >
              <Key className="w-4 h-4" />
              <span className="hidden lg:inline">{apiKey ? 'Key Set' : 'Gemini Key'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div className="text-left leading-tight hidden lg:block">
                    <span className="block text-xs font-bold text-slate-200">{user.name}</span>
                    <span className={`text-[10px] uppercase tracking-wider font-extrabold ${user.role === 'admin' ? 'text-amber-400' : 'text-slate-400'}`}>
                      {user.role}
                    </span>
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                Sign In / Register
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <Crown className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-800 space-y-2">
            {user && navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    activeTab === item.id 
                      ? 'bg-emerald-500 text-slate-950 font-bold' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsTelehealthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs text-cyan-400 font-semibold flex items-center gap-2 px-2 py-1"
              >
                <Video className="w-4 h-4" />
                <span>Telehealth</span>
              </button>

              <button
                onClick={() => {
                  setShowKeyModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs text-emerald-400 font-semibold flex items-center gap-2 px-2 py-1"
              >
                <Key className="w-4 h-4" />
                <span>Gemini Key</span>
              </button>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-400 font-semibold flex items-center gap-2 px-2 py-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab('auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs text-emerald-400 font-bold"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Gemini API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Google Gemini API Key</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your custom <strong>Google Gemini API key</strong> for live LLM responses. If empty, the built-in intelligent medical triage fallback engine will run.
            </p>

            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 font-mono"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
