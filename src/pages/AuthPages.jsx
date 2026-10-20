import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Lock, Mail, Eye, EyeOff, Activity } from 'lucide-react';

export const AuthPages = ({ onAuthSuccess }) => {
  const { login, register } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState(role === 'admin' ? 'admin@health.org' : 'alex.morgan@health.org');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('Alex Morgan');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginTab) {
      login(email, password, role);
    } else {
      register(name, email, password, role);
    }
    if (onAuthSuccess) onAuthSuccess();
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('admin.supervisor@health.org');
      setName('Dr. Sarah Jenkins (Admin)');
    } else {
      setEmail('alex.morgan@health.org');
      setName('Alex Morgan');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <Activity className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {isLoginTab ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access your AI Health Assistant workspace
          </p>
        </div>

        {/* Login / Register Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isLoginTab ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isLoginTab ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Role Selector (Demo Tool) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Account Access Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange('user')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'user'
                  ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient / User</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'admin'
                  ? 'border-amber-500/80 bg-amber-500/10 text-amber-300'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>System Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {!isLoginTab && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all mt-4"
          >
            {isLoginTab ? `Sign In as ${role.toUpperCase()}` : 'Create Account'}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center">
          Protected by JWT auth & 256-bit bcrypt password hashing
        </p>

      </div>
    </div>
  );
};
