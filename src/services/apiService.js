/**
 * API Service for AI Health Assistant
 * Communicates with Express REST backend at http://localhost:5000/api
 * Performs offline fallback seamlessly if backend is disconnected.
 */

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ai_health_jwt') || '';
  const user = JSON.parse(localStorage.getItem('ai_health_user') || '{}');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'x-user-id': user.id || 'usr_101'
  };
};

export const apiService = {
  // Health & Server Telemetry
  async checkServerHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch {
      // Offline fallback
    }
    return { status: 'offline', system: 'Local Storage Engine', version: '2.0.0-ClientOnly' };
  },

  // Auth API
  async loginUser(email, password, role) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  async registerUser(name, email, password, role) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  // Subscription API
  async getSubscriptionStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/subscription/status`, {
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { plan: 'pro', status: 'Active' };
  },

  async upgradeSubscription(plan) {
    try {
      const res = await fetch(`${API_BASE_URL}/subscription/upgrade`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ plan })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { success: true, plan };
  },

  // Symptom History API
  async fetchSymptoms() {
    try {
      const res = await fetch(`${API_BASE_URL}/symptoms`, {
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.symptoms;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async saveSymptomRecord(record) {
    try {
      const res = await fetch(`${API_BASE_URL}/symptoms`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(record)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { success: true, record };
  },

  async deleteSymptomRecord(id) {
    try {
      await fetch(`${API_BASE_URL}/symptoms/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      // Fallback
    }
  },

  // Medicine Reminders API
  async fetchReminders() {
    try {
      const res = await fetch(`${API_BASE_URL}/reminders`, {
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.reminders;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async saveReminder(reminder) {
    try {
      const res = await fetch(`${API_BASE_URL}/reminders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reminder)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { success: true, reminder };
  },

  // Telehealth Doctors API
  async fetchDoctors() {
    try {
      const res = await fetch(`${API_BASE_URL}/telehealth/doctors`, {
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.doctors;
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 'doc_1',
        name: 'Dr. Elena Rostova',
        specialty: 'Cardiology & Internal Medicine',
        hospital: 'St. Jude General Hospital',
        rating: 4.9,
        experienceYears: 14,
        availability: 'Today at 3:30 PM',
        fee: '$0 (VIP Inclusive)',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'doc_2',
        name: 'Dr. Marcus Vance',
        specialty: 'Neurology & Headache Specialist',
        hospital: 'Metro Neuroscience Institute',
        rating: 4.95,
        experienceYears: 18,
        availability: 'Tomorrow at 10:00 AM',
        fee: '$0 (VIP Inclusive)',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'doc_3',
        name: 'Dr. Priya Sharma',
        specialty: 'Pediatric Care & Allergy Specialist',
        hospital: 'City Children Hospital',
        rating: 4.88,
        experienceYears: 11,
        availability: 'Today at 5:00 PM',
        fee: '$0 (VIP Inclusive)',
        image: 'https://images.unsplash.com/photo-1594824813571-2153349aed06?w=150&auto=format&fit=crop&q=80'
      }
    ];
  }
};
