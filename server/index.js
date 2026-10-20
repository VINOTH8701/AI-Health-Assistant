const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database Store for Server Session
let db = {
  users: [
    {
      id: 'usr_101',
      name: 'Alex Morgan',
      email: 'alex.morgan@health.org',
      role: 'user',
      plan: 'pro',
      status: 'Active',
      registered: '2026-01-15',
      profile: {
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
      }
    },
    {
      id: 'adm_999',
      name: 'Dr. Sarah Jenkins',
      email: 'admin.supervisor@health.org',
      role: 'admin',
      plan: 'vip',
      status: 'Active',
      registered: '2025-11-01',
      profile: {
        age: 42,
        gender: 'Female',
        bloodGroup: 'A+',
        heightCm: 172,
        weightKg: 65,
        allergies: [],
        chronicConditions: [],
        emergencyContact: {
          name: 'Hospital Command',
          relationship: 'Work',
          phone: '+1 (555) 911-0199'
        }
      }
    }
  ],
  symptoms: [
    {
      id: 'sym_001',
      userId: 'usr_101',
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
        disclaimer: 'This is non-diagnostic AI guidance. Consult a medical professional for clinical diagnosis.'
      }
    }
  ],
  reminders: [
    {
      id: 'med_001',
      userId: 'usr_101',
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Every 8 Hours',
      times: ['08:00', '16:00', '00:00'],
      isActive: true,
      startDate: '2026-07-20',
      endDate: '2026-07-28'
    }
  ],
  telehealthDoctors: [
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
  ]
};

// 1. Health & Telemetry
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AI Health Assistant REST Backend Server',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '2.0.0-PRO',
    activeUsersCount: db.users.length,
    symptomsLogged: db.symptoms.length
  });
});

// 2. Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  let user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  
  if (!user) {
    user = {
      id: role === 'admin' ? 'adm_' + Date.now() : 'usr_' + Date.now(),
      name: email ? email.split('@')[0].toUpperCase() : 'USER',
      email: email || 'user@health.org',
      role: role || 'user',
      plan: 'pro',
      status: 'Active',
      registered: new Date().toISOString().split('T')[0],
      profile: {
        age: 30,
        gender: 'Female',
        bloodGroup: 'O+',
        heightCm: 168,
        weightKg: 62,
        allergies: ['Penicillin'],
        chronicConditions: [],
        emergencyContact: { name: 'Emergency Contact', phone: '+1 555-0199', relationship: 'Family' }
      }
    };
    db.users.push(user);
  }

  res.json({
    message: 'Authentication successful',
    token: `jwt_token_${Date.now()}_${user.id}`,
    user
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role } = req.body;
  const newUser = {
    id: role === 'admin' ? 'adm_' + Date.now() : 'usr_' + Date.now(),
    name: name || 'New Patient',
    email: email || `user_${Date.now()}@health.org`,
    role: role || 'user',
    plan: 'free',
    status: 'Active',
    registered: new Date().toISOString().split('T')[0],
    profile: {
      age: 28,
      gender: 'Male',
      bloodGroup: 'B+',
      heightCm: 175,
      weightKg: 70,
      allergies: [],
      chronicConditions: [],
      emergencyContact: { name: 'Family Contact', phone: '+1 555-0100', relationship: 'Parent' }
    }
  };
  db.users.push(newUser);

  res.json({
    message: 'Registration successful',
    token: `jwt_token_${Date.now()}_${newUser.id}`,
    user: newUser
  });
});

// 3. Subscription & Premium Routes
app.get('/api/subscription/status', (req, res) => {
  const userId = req.headers['x-user-id'] || 'usr_101';
  const user = db.users.find(u => u.id === userId) || db.users[0];
  res.json({
    plan: user.plan || 'pro',
    status: 'Active',
    expiresAt: '2027-01-01T00:00:00.000Z',
    features: {
      unlimitedTriage: user.plan !== 'free',
      geminiProModel: user.plan !== 'free',
      pdfDigestExport: true,
      telehealthConnect: user.plan === 'vip',
      pillScanner: user.plan !== 'free',
      wearableSync: true
    }
  });
});

app.post('/api/subscription/upgrade', (req, res) => {
  const { userId, plan } = req.body;
  const targetUser = db.users.find(u => u.id === (userId || 'usr_101')) || db.users[0];
  targetUser.plan = plan || 'pro';

  res.json({
    success: true,
    message: `Successfully upgraded to ${plan.toUpperCase()} Plan!`,
    user: targetUser
  });
});

// 4. Symptom History Routes
app.get('/api/symptoms', (req, res) => {
  res.json({ symptoms: db.symptoms });
});

app.post('/api/symptoms', (req, res) => {
  const newRecord = {
    id: 'sym_' + Date.now(),
    timestamp: new Date().toISOString(),
    ...req.body
  };
  db.symptoms.unshift(newRecord);
  res.status(201).json({ success: true, record: newRecord });
});

app.delete('/api/symptoms/:id', (req, res) => {
  const { id } = req.params;
  db.symptoms = db.symptoms.filter(s => s.id !== id);
  res.json({ success: true, message: 'Record deleted successfully' });
});

// 5. Reminders Routes
app.get('/api/reminders', (req, res) => {
  res.json({ reminders: db.reminders });
});

app.post('/api/reminders', (req, res) => {
  const newRem = {
    id: 'med_' + Date.now(),
    isActive: true,
    ...req.body
  };
  db.reminders.unshift(newRem);
  res.status(201).json({ success: true, reminder: newRem });
});

app.put('/api/reminders/:id', (req, res) => {
  const { id } = req.params;
  db.reminders = db.reminders.map(r => r.id === id ? { ...r, ...req.body } : r);
  res.json({ success: true, reminders: db.reminders });
});

app.delete('/api/reminders/:id', (req, res) => {
  const { id } = req.params;
  db.reminders = db.reminders.filter(r => r.id !== id);
  res.json({ success: true, message: 'Reminder deleted' });
});

// 6. User Profile Routes
app.put('/api/user/profile', (req, res) => {
  const { userId, profile } = req.body;
  const user = db.users.find(u => u.id === (userId || 'usr_101')) || db.users[0];
  user.profile = { ...user.profile, ...profile };
  res.json({ success: true, profile: user.profile, user });
});

// 7. Telehealth Virtual Doctors Route
app.get('/api/telehealth/doctors', (req, res) => {
  res.json({ doctors: db.telehealthDoctors });
});

// 8. Admin Telemetry Routes
app.get('/api/admin/users', (req, res) => {
  res.json({ users: db.users });
});

app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: db.users.length,
    activePlans: {
      free: db.users.filter(u => u.plan === 'free').length,
      pro: db.users.filter(u => u.plan === 'pro').length,
      vip: db.users.filter(u => u.plan === 'vip').length
    },
    totalSymptomsLogged: db.symptoms.length,
    totalReminders: db.reminders.length,
    systemStatus: 'Optimal (100% SLA)'
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`AI Health Assistant Server running on http://localhost:${PORT}`);
});
