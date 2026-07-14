import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, ShieldAlert, Users, AppWindow } from 'lucide-react';

export default function OrgOverview({ orgId, api_url }) {
  const [summary, setSummary] = useState(null);
  const [networkSignal, setNetworkSignal] = useState(null);

  useEffect(() => {
    fetch(`${api_url}/api/org/${orgId}/dashboard-summary`)
      .then(r => r.json())
      .then(data => setSummary(data));
      
    fetch(`${api_url}/api/canary-network/platform-status`)
      .then(r => r.json())
      .then(data => setNetworkSignal(data));
  }, [orgId, api_url]);

  if (!summary) return <div>Loading overview...</div>;

  const elevatedNodes = networkSignal?.platforms?.filter(p => p.status === 'elevated') || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-grid">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-header">
          <Shield size={24} />
          <div className="card-title">Organization Trust Health</div>
        </div>
        <div className="health-score">
          <motion.div className="score-circle" animate={{ color: summary.trustHealthScore < 50 ? 'var(--badge-text-dormant)' : 'var(--text-primary)', borderColor: summary.trustHealthScore < 50 ? 'var(--badge-text-dormant)' : 'var(--text-primary)' }}>
            {summary.trustHealthScore}
          </motion.div>
          <div className="score-info">
            <h3>Global Trust Score</h3>
            <p>Based on {summary.totalAppsConnected} active connections. {summary.dormantAppsCount} apps are dormant and require attention.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <Activity size={24} />
          <div className="card-title">Canary Network Signal</div>
        </div>
        <p className="card-desc">Corroborated alerts across the TrustPulse global network.</p>
        {elevatedNodes.length > 0 ? (
          elevatedNodes.map(node => (
            <div key={node.name} className="flash-alert" style={{ marginBottom: '1rem', padding: '1rem' }}>
              <ShieldAlert size={24} />
              <div>
                <h4 style={{ fontSize: '1rem' }}>Elevated Risk: {node.name}</h4>
                <p style={{ fontSize: '0.8rem' }}>{node.corroborationCount} independent users reported breaches in the last 48 hours.</p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>All monitored nodes are currently stable.</p>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <AppWindow size={24} />
          <div className="card-title">Top Riskiest Apps</div>
        </div>
        <div className="app-list">
          {summary.topRiskiestApps.map(app => (
            <div key={app.appId} className="app-item">
              <div className="app-info">
                <div className="app-details">
                  <strong>{app.name}</strong>
                  <div className={`badge ${app.status}`}>{app.status}</div>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: app.riskScore < 30 ? '#22c55e' : (app.riskScore < 70 ? '#eab308' : '#ef4444') }}>
                  {app.riskScore}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>RISK SCORE</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
