import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { Dashboard } from './pages/Dashboard';
import { AISymptomAnalysis } from './pages/AISymptomAnalysis';
import { HealthHistory } from './pages/HealthHistory';
import { MedicineReminders } from './pages/MedicineReminders';
import { HospitalMap } from './pages/HospitalMap';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ToolsPage } from './pages/ToolsPage';
import { Lock, ShieldAlert } from 'lucide-react';
import { PremiumModal } from './components/PremiumModal';
import { TelehealthModal } from './components/TelehealthModal';
import { PremiumModal } from './components/PremiumModal';
import { TelehealthModal } from './components/TelehealthModal';

// ─────────────────────────────────────────────
// PROTECTED ROUTE WRAPPER
// ─────────────────────────────────────────────
const ProtectedRoute = ({ children, setActiveTab }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 text-center space-y-6 px-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Authentication Required</h2>
          <p className="text-sm text-slate-400 max-w-sm">
            You must be signed in to access this page. Please log in or register to continue.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('auth')}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return children;
};

// ─────────────────────────────────────────────
// ADMIN ROUTE WRAPPER
// ─────────────────────────────────────────────
const AdminRoute = ({ children, setActiveTab }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 text-center space-y-6 px-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-black text-white">Authentication Required</h2>
        <button
          onClick={() => setActiveTab('auth')}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 text-center space-y-6 px-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Access Denied</h2>
          <p className="text-sm text-slate-400 max-w-sm">
            This section is restricted to <strong className="text-amber-400">Admin</strong> accounts only.
            Your current role is <strong className="text-slate-200">{user.role}</strong>.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-8 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold text-sm hover:bg-slate-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return children;
};

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
const MainApp = () => {
  const { user, isPremiumModalOpen, setIsPremiumModalOpen, isTelehealthModalOpen, setIsTelehealthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState(() => (user ? 'dashboard' : 'auth'));

  useEffect(() => {
    if (!user && activeTab !== 'landing' && activeTab !== 'auth') {
      setActiveTab('auth');
    }
  }, [user, activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Sticky Glassmorphism Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">

        {/* ── PUBLIC / INITIAL AUTH ROUTES ── */}
        {activeTab === 'auth' && (
          <AuthPages onAuthSuccess={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
            onStartTriage={() => setActiveTab(user ? 'triage' : 'auth')}
          />
        )}

        {/* ── PROTECTED ROUTES ── */}
        {activeTab === 'dashboard' && (
          <ProtectedRoute setActiveTab={setActiveTab}>
            <Dashboard setActiveTab={setActiveTab} />
          </ProtectedRoute>
        )}

        {activeTab === 'triage' && (
          <ProtectedRoute setActiveTab={setActiveTab}>
            <AISymptomAnalysis setActiveTab={setActiveTab} />
          </ProtectedRoute>
        )}

        {activeTab === 'history' && (
          <ProtectedRoute setActiveTab={setActiveTab}>
            <HealthHistory setActiveTab={setActiveTab} />
          </ProtectedRoute>
        )}

        {activeTab === 'reminders' && (
          <ProtectedRoute setActiveTab={setActiveTab}>
            <MedicineReminders />
          </ProtectedRoute>
        )}

        {activeTab === 'hospitals' && (
          <ProtectedRoute setActiveTab={setActiveTab}>
            <HospitalMap />
          </ProtectedRoute>
        )}

        {activeTab === 'profile' && (
          <ProtectedRoute setActiveTab={setActiveTab}>
            <ProfilePage />
          </ProtectedRoute>
        )}

        {activeTab === 'tools' && (
          <ProtectedRoute setActiveTab={setActiveTab}>
            <ToolsPage />
          </ProtectedRoute>
        )}

        {/* ── ADMIN ROUTE ── */}
        {activeTab === 'admin' && (
          <AdminRoute setActiveTab={setActiveTab}>
            <AdminDashboard />
          </AdminRoute>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
      <TelehealthModal
        isOpen={isTelehealthModalOpen}
        onClose={() => setIsTelehealthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
