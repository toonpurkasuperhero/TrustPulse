function offboardUser(userId, orgId, db, auditLog) {
  const user = db.users.find(u => u.userId === userId && u.orgId === orgId);
  if (!user) throw new Error("User not found");

  user.employmentStatus = 'offboarded';
  
  const userApps = db.apps.filter(a => a.userId === userId && a.orgId === orgId);
  
  const revokedApps = [];
  const flaggedApps = [];

  userApps.forEach(app => {
    if (['high', 'critical'].includes(app.scopeSensitivity)) {
      app.status = 'revoked';
      revokedApps.push(app);
      
      auditLog.push({
        logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        orgId,
        actorId: 'system_automation',
        action: 'revoke',
        targetAppId: app.appId,
        timestamp: new Date().toISOString()
      });
    } else {
      app.status = 'flagged_for_review';
      flaggedApps.push(app);
    }
  });

  auditLog.push({
    logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    orgId,
    actorId: 'system_automation',
    action: 'offboard',
    targetUserId: userId,
    timestamp: new Date().toISOString()
  });

  return { user, revokedApps, flaggedApps };
}

module.exports = { offboardUser };
