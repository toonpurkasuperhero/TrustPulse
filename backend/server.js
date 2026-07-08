const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Mocked Data for Personas
let userApps = {
  'safe@trustpulse.com': [
    { id: 1, name: 'Uber', lastUsed: '2026-07-06T10:00:00Z', permissions: ['Location'], status: 'active', trustScore: 92 },
    { id: 2, name: 'Google Maps', lastUsed: '2026-07-07T08:00:00Z', permissions: ['Location'], status: 'active', trustScore: 95 },
    { id: 3, name: 'Spotify', lastUsed: '2026-07-05T10:00:00Z', permissions: ['Media'], status: 'active', trustScore: 88 }
  ],
  'breach@trustpulse.com': [
    { id: 4, name: 'Uber', lastUsed: '2026-07-06T10:00:00Z', permissions: ['Location', 'Camera'], status: 'active', trustScore: 90 },
    { id: 5, name: 'Snapchat', lastUsed: '2025-08-01T10:00:00Z', permissions: ['Camera', 'Microphone', 'Contacts'], status: 'dormant', trustScore: 45 },
    { id: 6, name: 'Old Game', lastUsed: '2023-01-15T10:00:00Z', permissions: ['Contacts', 'Storage', 'Location'], status: 'dormant', trustScore: 12 },
    { id: 7, name: 'Fitness Tracker', lastUsed: '2024-02-10T08:00:00Z', permissions: ['Health', 'Location'], status: 'dormant', trustScore: 38 },
  ]
};

app.get('/api/apps', (req, res) => {
  const email = req.query.email || 'safe@trustpulse.com';
  // Return empty if not found to handle generic logins
  res.json(userApps[email] || []);
});

app.post('/api/apps/:id/revoke', (req, res) => {
  const { id } = req.params;
  const email = req.query.email;
  
  if (userApps[email]) {
    const appIndex = userApps[email].findIndex(a => a.id === parseInt(id));
    if (appIndex !== -1) {
      userApps[email][appIndex].status = 'revoked';
      return res.json({ success: true, app: userApps[email][appIndex] });
    }
  }
  res.status(404).json({ error: 'App not found' });
});

app.post('/api/revoke-all-dormant', (req, res) => {
  const email = req.query.email;
  if (userApps[email]) {
    userApps[email] = userApps[email].map(app => {
      if (app.status === 'dormant') {
        return { ...app, status: 'revoked' };
      }
      return app;
    });
    return res.json({ success: true, apps: userApps[email] });
  }
  res.json({ success: false });
});

// Canary Network WebSocket & Mock Trigger
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.post('/api/trigger-breach', (req, res) => {
  const mockBreach = {
    source: 'ICMR / Aadhaar Database (Dark Web Forum)',
    timestamp: new Date().toISOString(),
    recordsExposed: 815000000,
    severity: 'CRITICAL',
    message: 'Your Canary identifier was found in a new database dump.',
    confidenceThreshold: 'High (Spam detected from known 3rd-party malicious node. Confirmed by 42 independent users.)'
  };
  
  io.emit('canary-alert', mockBreach);
  res.json({ success: true, breach: mockBreach });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
