import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initial user state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ai_health_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('ai_health_jwt') || '');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('gemini_model') || 'gemini-1.5-flash');

  // Subscription Plan State: 'free' | 'pro' | 'vip'
  const [plan, setPlan] = useState(() => {
    const savedPlan = localStorage.getItem('ai_health_plan');
    return savedPlan || (user?.plan || 'pro');
  });

  // Modals visibility state
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isTelehealthModalOpen, setIsTelehealthModalOpen] = useState(false);

  // Wearable Vitals Simulation state
  const [wearableVitals, setWearableVitals] = useState({
    heartRate: 72,
    spO2: 98,
    sleepScore: 88,
    steps: 8420,
    activeCal: 420,
    lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  // Health records & states stored locally with API sync
  const [symptomHistory, setSymptomHistory] = useState(() => {
    const saved = localStorage.getItem('ai_symptom_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'sym_001',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        rawInput: 'Throbbing migraine on the left side of head with mild light sensitivity.',
        inputMode: 'text',
        severityScale: 6,
        durationDays: 2,
        aiAnalysis: {
          summary: 'Symptoms indicate potential migraine without aura or tension-type headache.',
          potentialCauses: ['Migraine', 'Tension Headache', 'Dehydration / Eye Strain'],
          recommendedActions: ['Rest in a quiet, dark room', 'Maintain hydration', 'Apply a cool compress'],
          suggestedSpecialist: 'Neurologist / Primary Care Physician',
          emergencyFlag: false,
          modelUsed: 'gemini-1.5-pro',
          disclaimer: 'This is non-diagnostic AI guidance. Consult a medical professional for clinical diagnosis.'
        }
      },
      {
        id: 'sym_002',
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        rawInput: 'Mild dry cough and tickle in throat after morning walk.',
        inputMode: 'voice',
        severityScale: 3,
        durationDays: 1,
        aiAnalysis: {
          summary: 'Mild upper respiratory irritation likely related to environmental allergy or dry air.',
          potentialCauses: ['Seasonal Allergy', 'Mild Pharyngitis', 'Air Quality Sensitivity'],
          recommendedActions: ['Warm salt water gargle', 'Stay well hydrated with honey tea', 'Monitor temperature'],
          suggestedSpecialist: 'General Physician / Allergist',
          emergencyFlag: false,
          modelUsed: 'gemini-1.5-flash',
          disclaimer: 'This is non-diagnostic AI guidance.'
        }
      }
    ];
  });

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('ai_medicine_reminders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'med_001',
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Every 8 Hours',
        times: ['08:00', '16:00', '00:00'],
        isActive: true,
        startDate: '2026-07-20',
        endDate: '2026-07-28'
      },
      {
        id: 'med_002',
        name: 'Multivitamin Complex',
        dosage: '1 Tablet',
        frequency: 'Once Daily',
        times: ['09:00'],
        isActive: true,
        startDate: '2026-01-01',
        endDate: '2026-12-31'
      }
    ];
  });

  const [waterIntake, setWaterIntake] = useState(() => {
    const saved = localStorage.getItem('ai_water_intake');
    return saved ? JSON.parse(saved) : { currentMl: 1750, targetMl: 2500 };
  });

  // Sync state to local storage & backend
  useEffect(() => {
    if (user) {
      localStorage.setItem('ai_health_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ai_health_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ai_health_plan', plan);
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('gemini_model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('ai_symptom_history', JSON.stringify(symptomHistory));
  }, [symptomHistory]);

  useEffect(() => {
    localStorage.setItem('ai_medicine_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('ai_water_intake', JSON.stringify(waterIntake));
  }, [waterIntake]);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const changeModel = (model) => {
    setSelectedModel(model);
  };

  const upgradePlan = async (newPlan) => {
    setPlan(newPlan);
    if (user) {
      setUser(prev => ({ ...prev, plan: newPlan }));
    }
    await apiService.upgradeSubscription(newPlan);
  };

  const login = async (email, password, selectedRole = 'user', displayName = null) => {
    // Try backend authentication
    const apiResult = await apiService.loginUser(email, password, selectedRole);

    const defaultProfile = {
      age: 32,
      gender: 'Female',
      bloodGroup: 'O+',
      heightCm: 168,
      weightKg: 62,
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Mild Asthma'],
      emergencyContact: {
        name: 'David Morgan',
        relationship: 'Spouse',
        phone: '+1 (555) 234-5678'
      }
    };

    const newUser = apiResult?.user || {
      id: selectedRole === 'admin' ? 'adm_999' : 'usr_' + Date.now(),
      name: displayName || (email ? email.split('@')[0].toUpperCase() : 'User'),
      email: email || (selectedRole === 'admin' ? 'admin@health.org' : 'user@health.org'),
      role: selectedRole,
      plan: plan || 'pro',
      avatar: selectedRole === 'admin' 
        ? 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      profile: defaultProfile
    };

    setUser(newUser);
    setPlan(newUser.plan || 'pro');
    const mockJwt = apiResult?.token || ('jwt_mock_token_' + Date.now());
    setToken(mockJwt);
    localStorage.setItem('ai_health_jwt', mockJwt);
  };

  const register = async (name, email, password, selectedRole = 'user') => {
    await login(email, password, selectedRole, name);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('ai_health_user');
    localStorage.removeItem('ai_health_jwt');
  };

  const addSymptomRecord = async (record) => {
    setSymptomHistory(prev => [record, ...prev]);
    await apiService.saveSymptomRecord(record);
  };

  const deleteSymptomRecord = async (id) => {
    setSymptomHistory(prev => prev.filter(item => item.id !== id));
    await apiService.deleteSymptomRecord(id);
  };

  const addReminder = async (newMed) => {
    setReminders(prev => [newMed, ...prev]);
    await apiService.saveReminder(newMed);
  };

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(med => med.id === id ? { ...med, isActive: !med.isActive } : med));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(med => med.id !== id));
  };

  const updateProfile = async (updatedProfile) => {
    const newProfile = { ...user?.profile, ...updatedProfile };
    setUser(prev => ({
      ...prev,
      profile: newProfile
    }));
    await apiService.saveSymptomRecord({ userId: user?.id, profile: newProfile });
  };

  const addWater = (amountMl) => {
    setWaterIntake(prev => ({
      ...prev,
      currentMl: Math.min(prev.targetMl * 1.5, prev.currentMl + amountMl)
    }));
  };

  const resetWater = () => {
    setWaterIntake(prev => ({ ...prev, currentMl: 0 }));
  };

  const syncWearableVitals = () => {
    setWearableVitals({
      heartRate: 68 + Math.floor(Math.random() * 12),
      spO2: 97 + Math.floor(Math.random() * 3),
      sleepScore: 85 + Math.floor(Math.random() * 10),
      steps: 8500 + Math.floor(Math.random() * 1000),
      activeCal: 450 + Math.floor(Math.random() * 100),
      lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      token,
      plan,
      upgradePlan,
      selectedModel,
      changeModel,
      apiKey,
      saveApiKey,
      login,
      register,
      logout,
      symptomHistory,
      addSymptomRecord,
      deleteSymptomRecord,
      reminders,
      addReminder,
      toggleReminder,
      deleteReminder,
      updateProfile,
      waterIntake,
      addWater,
      resetWater,
      isPremiumModalOpen,
      setIsPremiumModalOpen,
      isTelehealthModalOpen,
      setIsTelehealthModalOpen,
      wearableVitals,
      syncWearableVitals
    }}>
      {children}
    </AuthContext.Provider>
  );
};
