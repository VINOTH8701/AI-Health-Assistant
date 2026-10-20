import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Activity, AlertTriangle, Key, Search, UserX, CheckCircle2 } from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  
  const [usersList, setUsersList] = useState([
    { id: 'usr_101', name: 'Alex Morgan', email: 'alex.morgan@health.org', role: 'user', status: 'Active', registered: '2026-01-15' },
    { id: 'adm_999', name: 'Dr. Sarah Jenkins', email: 'admin.supervisor@health.org', role: 'admin', status: 'Active', registered: '2025-11-01' },
    { id: 'usr_102', name: 'Robert Vance', email: 'r.vance@tech.co', role: 'user', status: 'Active', registered: '2026-03-22' },
    { id: 'usr_103', name: 'Elena Rostova', email: 'elena.r@wellness.io', role: 'user', status: 'Suspended', registered: '2026-05-10' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const toggleUserStatus = (id) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    }));
  };

  if (user?.role !== 'admin') {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-red-500/30 text-center space-y-4 max-w-md mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-white">Access Denied: Admin Privilege Required</h2>
        <p className="text-xs text-slate-400">
          This module is protected by Role-Based Access Control (RBAC). Please log in with administrative credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <span>Administrative Control & Audit Panel</span>
          </h1>
          <p className="text-xs text-slate-400">
            System health telemetry, user lifecycle controls, and AI prompt request logging.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Superadmin Mode
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-bold">Total Registered Users</span>
          <h3 className="text-2xl font-black text-white">{usersList.length}</h3>
          <span className="text-[10px] text-emerald-400">+12% this month</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-bold">Gemini AI Queries (Today)</span>
          <h3 className="text-2xl font-black text-teal-400">1,420</h3>
          <span className="text-[10px] text-teal-400">Avg latency 1.1s</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-bold">Red-Flag Emergencies</span>
          <h3 className="text-2xl font-black text-red-400">14</h3>
          <span className="text-[10px] text-red-400">Direct 911 redirects</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-bold">System Health SLA</span>
          <h3 className="text-2xl font-black text-emerald-400">99.98%</h3>
          <span className="text-[10px] text-emerald-400">Operational</span>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>User Directory & Permission Manager</span>
          </h3>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">
                    <div>{u.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                      u.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{u.registered}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        u.status === 'Active'
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {u.status === 'Active' ? 'Suspend' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
