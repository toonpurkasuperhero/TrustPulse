import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function AlertsFeed({ socket, orgId, api_url }) {
  const [alerts, setAlerts] = useState([
    { severity: 'CRITICAL', source: 'Snowflake Analytics', recordsExposed: 450000, confidenceThreshold: 'High Confidence' },
    { severity: 'HIGH', source: 'Slack Webhook Gateway', recordsExposed: 12000, confidenceThreshold: 'Medium Confidence' }
  ]);

  useEffect(() => {
    if (socket) {
      socket.emit('join-org', orgId);
      
      const handleAlert = (data) => {
        setAlerts(prev => [data, ...prev]);
      };
      
      socket.on('canary-alert', handleAlert);
      return () => {
        socket.off('canary-alert', handleAlert);
      };
    }
  }, [socket, orgId]);

  const triggerBreach = async () => {
    try {
      await fetch(`${api_url}/api/trigger-breach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId })
      });
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="card" style={{ gridColumn: '1 / -1' }}>
      <div className="card-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bell size={24} />
          <div className="card-title">Alerts Feed</div>
        </div>
        <button className="btn btn-secondary" onClick={triggerBreach}>Simulate Org Breach</button>
      </div>
      <p className="card-desc">Real-time alerts for compromised canaries and high-risk events within your organization.</p>
      
      <div className="app-list">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', padding: '2rem 0', textAlign: 'center' }}>No alerts in the feed.</p>
          ) : (
            alerts.map((alert, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flash-alert" style={{ marginBottom: '1rem' }}>
                <ShieldAlert size={40} />
                <div style={{ flex: 1 }}>
                  <h4>{alert.severity} Breach Detected</h4>
                  <p>Source: {alert.source} &bull; Records Exposed: {alert.recordsExposed?.toLocaleString()}</p>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--alert-text)', fontWeight: 600 }}>
                    <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> 
                    {alert.confidenceThreshold}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
