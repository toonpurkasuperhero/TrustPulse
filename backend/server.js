const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { computeRiskScore } = require('./riskEngine');
const { offboardUser } = require('./offboardingService');

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

// Mocked Data for B2B/Personas
const db = {
  organizations: [
    { orgId: 'org_1', name: 'Acme Corp', domain: 'acme.com', plan: 'enterprise', seatCount: 500, createdAt: '2023-01-01T00:00:00Z', ssoEnabled: true },
    { orgId: 'org_2', name: 'Startup Inc', domain: 'startup.io', plan: 'team', seatCount: 20, createdAt: '2025-01-01T00:00:00Z', ssoEnabled: false }
  ],
  users: [
    { userId: 'u_1', email: 'safe@trustpulse.com', orgId: 'org_1', role: 'member', employmentStatus: 'active', lastActiveAt: new Date().toISOString() },
    { userId: 'u_2', email: 'breach@trustpulse.com', orgId: 'org_1', role: 'member', employmentStatus: 'active', lastActiveAt: new Date().toISOString() },
    { userId: 'u_3', email: 'admin@acme.com', orgId: 'org_1', role: 'admin', employmentStatus: 'active', lastActiveAt: new Date().toISOString() }
  ],
  apps: [
    { appId: 'a_1', userId: 'u_1', orgId: 'org_1', name: 'Uber', scopes: ['Location'], scopeSensitivity: 'low', lastUsedAt: '2026-07-06T10:00:00Z', status: 'active', dataCategoriesTouched: ['location'] },
    { appId: 'a_2', userId: 'u_1', orgId: 'org_1', name: 'Google Maps', scopes: ['Location'], scopeSensitivity: 'low', lastUsedAt: '2026-07-07T08:00:00Z', status: 'active', dataCategoriesTouched: ['location'] },
    { appId: 'a_3', userId: 'u_1', orgId: 'org_1', name: 'Spotify', scopes: ['Media'], scopeSensitivity: 'low', lastUsedAt: '2026-07-05T10:00:00Z', status: 'active', dataCategoriesTouched: ['media'] },
    
    { appId: 'a_4', userId: 'u_2', orgId: 'org_1', name: 'Uber', scopes: ['Location', 'Camera'], scopeSensitivity: 'medium', lastUsedAt: '2026-07-06T10:00:00Z', status: 'active', dataCategoriesTouched: ['location', 'camera'] },
    { appId: 'a_5', userId: 'u_2', orgId: 'org_1', name: 'Snapchat', scopes: ['Camera', 'Microphone', 'Contacts'], scopeSensitivity: 'high', lastUsedAt: '2025-08-01T10:00:00Z', dormantSince: '2025-09-01T00:00:00Z', status: 'dormant', dataCategoriesTouched: ['media', 'contacts'] },
    { appId: 'a_6', userId: 'u_2', orgId: 'org_1', name: 'Old Game', scopes: ['Contacts', 'Storage', 'Location'], scopeSensitivity: 'high', lastUsedAt: '2023-01-15T10:00:00Z', dormantSince: '2023-02-15T00:00:00Z', status: 'dormant', dataCategoriesTouched: ['contacts', 'files', 'location'] },
    { appId: 'a_7', userId: 'u_2', orgId: 'org_1', name: 'Fitness Tracker', scopes: ['Health', 'Location'], scopeSensitivity: 'critical', lastUsedAt: '2024-02-10T08:00:00Z', dormantSince: '2024-03-10T00:00:00Z', status: 'dormant', dataCategoriesTouched: ['health', 'location'] }
  ],
  canaries: [
    { canaryId: 'c_1', userId: 'u_2', orgId: 'org_1', platformName: 'DarkWebForum_A', status: 'active' }
  ],
  auditLog: [
    { logId: 'log_1', orgId: 'org_1', actorId: 'u_3', action: 'revoke', targetAppId: 'a_5', timestamp: '2026-07-13T12:00:00Z' },
    { logId: 'log_2', orgId: 'org_1', actorId: 'system', action: 'offboard_user', targetUserId: 'u_4', timestamp: '2026-07-14T09:00:00Z' },
    { logId: 'log_3', orgId: 'org_1', actorId: 'system', action: 'revoke', targetAppId: 'a_7', timestamp: '2026-07-14T09:00:05Z' }
  ]
};

// Map old email queries to new userId
const emailToUserId = {
  'safe@trustpulse.com': 'u_1',
  'breach@trustpulse.com': 'u_2',
  'admin@acme.com': 'u_3'
};

// -- Personal View Endpoints -- //

app.get('/api/apps', (req, res) => {
  const email = req.query.email || 'safe@trustpulse.com';
  const userId = emailToUserId[email];
  if (!userId) return res.json([]);
  
  const userApps = db.apps.filter(a => a.userId === userId);
  
  // Compute risk score on the fly
  const appsWithScores = userApps.map(app => {
    const risk = computeRiskScore(app);
    return { ...app, trustScore: 100 - risk.score, riskDetails: risk, id: parseInt(app.appId.split('_')[1]) }; // Adding id for frontend compatibility
  });
  
  res.json(appsWithScores);
});

app.post('/api/apps/:id/revoke', (req, res) => {
  const { id } = req.params;
  const email = req.query.email;
  const userId = emailToUserId[email];
  
  // Handle string appId or parsed integer id for backward compatibility
  const stringAppId = `a_${id}`;
  
  const app = db.apps.find(a => (a.appId === id || a.appId === stringAppId) && a.userId === userId);
  if (app) {
    app.status = 'revoked';
    
    if (app.orgId) {
      db.auditLog.push({
        logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        orgId: app.orgId,
        actorId: userId,
        action: 'revoke',
        targetAppId: app.appId,
        timestamp: new Date().toISOString()
      });
    }
    
    return res.json({ success: true, app: { ...app, id: parseInt(app.appId.split('_')[1]) } });
  }
  res.status(404).json({ error: 'App not found' });
});

app.post('/api/revoke-all-dormant', (req, res) => {
  const email = req.query.email;
  const userId = emailToUserId[email];
  
  const userApps = db.apps.filter(a => a.userId === userId);
  const revoked = [];
  
  userApps.forEach(app => {
    if (app.status === 'dormant') {
      app.status = 'revoked';
      revoked.push(app);
      if (app.orgId) {
        db.auditLog.push({
          logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          orgId: app.orgId,
          actorId: userId,
          action: 'revoke',
          targetAppId: app.appId,
          timestamp: new Date().toISOString()
        });
      }
    }
  });
  
  // Return apps array as the frontend expects it for update
  return res.json({ success: true, apps: userApps.map(a => ({ ...a, id: parseInt(a.appId.split('_')[1]) })) });
});

// -- Org Admin Console Endpoints -- //

// Mock Middleware to get org context
app.use('/api/org/:orgId', (req, res, next) => {
  const org = db.organizations.find(o => o.orgId === req.params.orgId);
  if (!org) return res.status(404).json({ error: 'Organization not found' });
  req.org = org;
  next();
});

app.get('/api/org/:orgId/dashboard-summary', (req, res) => {
  const orgApps = db.apps.filter(a => a.orgId === req.params.orgId);
  const dormantCount = orgApps.filter(a => a.status === 'dormant').length;
  
  const appsWithScores = orgApps.map(app => {
    const risk = computeRiskScore(app);
    return { ...app, riskScore: risk.score };
  }).sort((a, b) => b.riskScore - a.riskScore);
  
  const topRiskiest = appsWithScores.slice(0, 5);
  const avgTrustScore = appsWithScores.length 
    ? 100 - (appsWithScores.reduce((sum, a) => sum + a.riskScore, 0) / appsWithScores.length)
    : 100;
    
  res.json({
    trustHealthScore: Math.round(avgTrustScore),
    dormantAppsCount: dormantCount,
    totalAppsConnected: orgApps.length,
    topRiskiestApps: topRiskiest
  });
});

app.get('/api/org/:orgId/apps', (req, res) => {
  const orgApps = db.apps.filter(a => a.orgId === req.params.orgId);
  const enriched = orgApps.map(app => {
    const user = db.users.find(u => u.userId === app.userId);
    const risk = computeRiskScore(app);
    return { ...app, riskScore: risk.score, riskDetails: risk, ownerEmail: user?.email };
  });
  res.json(enriched);
});

app.get('/api/org/:orgId/members', (req, res) => {
  const orgMembers = db.users.filter(u => u.orgId === req.params.orgId);
  const enriched = orgMembers.map(user => {
    const userApps = db.apps.filter(a => a.userId === user.userId);
    return { ...user, appCount: userApps.length };
  });
  res.json(enriched);
});

app.post('/api/org/:orgId/members/:userId/offboard', (req, res) => {
  try {
    const result = offboardUser(req.params.userId, req.params.orgId, db, db.auditLog);
    res.json({ success: true, result });
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/org/:orgId/apps/:appId/revoke', (req, res) => {
  const app = db.apps.find(a => a.appId === req.params.appId && a.orgId === req.params.orgId);
  if (app) {
    app.status = 'revoked';
    db.auditLog.push({
      logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      orgId: req.params.orgId,
      actorId: 'admin_action',
      action: 'revoke',
      targetAppId: app.appId,
      timestamp: new Date().toISOString()
    });
    return res.json({ success: true, app });
  }
  res.status(404).json({ error: 'App not found' });
});

app.get('/api/org/:orgId/audit-log', (req, res) => {
  res.json(db.auditLog.filter(l => l.orgId === req.params.orgId));
});

app.get('/api/org/:orgId/export/compliance-report', (req, res) => {
  const logs = db.auditLog.filter(l => l.orgId === req.params.orgId);
  // Basic CSV conversion
  const csv = [
    ['Log ID', 'Actor ID', 'Action', 'Target', 'Timestamp'].join(','),
    ...logs.map(l => [l.logId, l.actorId, l.action, l.targetAppId || l.targetUserId, l.timestamp].join(','))
  ].join('\n');
  
  res.header('Content-Type', 'text/csv');
  res.attachment('compliance_report.csv');
  res.send(csv);
});

app.post('/api/org/:orgId/upgrade', (req, res) => {
  const { plan } = req.body;
  if(req.org) {
    req.org.plan = plan;
    res.json({ success: true, org: req.org });
  } else {
    res.status(404).send();
  }
});

app.get('/api/canary-network/platform-status', (req, res) => {
  // Mock aggregated view for demo
  res.json({
    platforms: [
      { name: 'DarkWebForum_A', corroborationCount: 42, status: 'elevated', lastTrippedAt: new Date().toISOString() },
      { name: 'TelegramDump_Bot', corroborationCount: 3, status: 'monitoring', lastTrippedAt: new Date(Date.now() - 86400000).toISOString() }
    ]
  });
});

// -- Websocket Alerting -- //
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join-org', (orgId) => {
    socket.join(orgId);
    console.log(`Socket ${socket.id} joined org ${orgId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.post('/api/trigger-breach', (req, res) => {
  const { orgId } = req.body; // Can trigger for a specific org
  
  const mockBreach = {
    source: 'ICMR / Aadhaar Database (Dark Web Forum)',
    timestamp: new Date().toISOString(),
    recordsExposed: 815000000,
    severity: 'CRITICAL',
    message: 'Your Canary identifier was found in a new database dump.',
    confidenceThreshold: 'High (Spam detected from known 3rd-party malicious node. Confirmed by 42 independent users.)'
  };
  
  if (orgId) {
    io.to(orgId).emit('canary-alert', mockBreach);
  } else {
    io.emit('canary-alert', mockBreach); // fallback to all
  }
  
  res.json({ success: true, breach: mockBreach });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
