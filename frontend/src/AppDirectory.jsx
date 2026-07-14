import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppWindow, XOctagon, ChevronDown, ChevronUp } from 'lucide-react';

export default function AppDirectory({ orgId, api_url }) {
  const [apps, setApps] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchApps();
  }, [orgId, api_url]);

  const fetchApps = () => {
    fetch(`${api_url}/api/org/${orgId}/apps`)
      .then(r => r.json())
      .then(data => setApps(data));
  };

  const handleRevoke = async (appId) => {
    try {
      await fetch(`${api_url}/api/org/${orgId}/apps/${appId}/revoke`, { method: 'POST' });
      fetchApps();
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="card" style={{ gridColumn: '1 / -1' }}>
      <div className="card-header">
        <AppWindow size={24} />
        <div className="card-title">App Directory</div>
      </div>
      <p className="card-desc">Comprehensive view of all connected applications across your organization.</p>
      
      <div className="app-list">
        {apps.map(app => (
          <div key={app.appId} className="app-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="app-info">
                <div className="app-details">
                  <strong>{app.name}</strong>
                  <div className={`badge ${app.status}`}>{app.status}</div>
                  <div className="meta">Owner: {app.ownerEmail} &bull; Used: {new Date(app.lastUsedAt).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: app.riskScore < 30 ? '#22c55e' : (app.riskScore < 70 ? '#eab308' : '#ef4444') }}>
                    {app.riskScore}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>RISK SCORE</div>
                </div>
                
                <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setExpandedId(expandedId === app.appId ? null : app.appId)}>
                  {expandedId === app.appId ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {app.status !== 'revoked' && (
                  <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => handleRevoke(app.appId)} title="Revoke App Access">
                    <XOctagon size={18} />
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {expandedId === app.appId && app.riskDetails && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Risk Score Breakdown</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <div className="meta">Scope Breadth ({app.riskDetails.factors.scopeBreadth}/100)</div>
                      <div style={{ width: '100%', height: '4px', background: 'var(--bg-secondary)', marginTop: '4px', borderRadius: '2px' }}>
                        <div style={{ width: `${app.riskDetails.factors.scopeBreadth}%`, height: '100%', background: 'var(--text-primary)', borderRadius: '2px' }} />
                      </div>
                    </div>
                    <div>
                      <div className="meta">Data Sensitivity ({app.riskDetails.factors.sensitivity}/100)</div>
                      <div style={{ width: '100%', height: '4px', background: 'var(--bg-secondary)', marginTop: '4px', borderRadius: '2px' }}>
                        <div style={{ width: `${app.riskDetails.factors.sensitivity}%`, height: '100%', background: 'var(--text-primary)', borderRadius: '2px' }} />
                      </div>
                    </div>
                    <div>
                      <div className="meta">Dormancy ({app.riskDetails.factors.dormancyDays}/100)</div>
                      <div style={{ width: '100%', height: '4px', background: 'var(--bg-secondary)', marginTop: '4px', borderRadius: '2px' }}>
                        <div style={{ width: `${app.riskDetails.factors.dormancyDays}%`, height: '100%', background: 'var(--text-primary)', borderRadius: '2px' }} />
                      </div>
                    </div>
                    <div>
                      <div className="meta">Blast Radius ({app.riskDetails.factors.blastRadius}/100)</div>
                      <div style={{ width: '100%', height: '4px', background: 'var(--bg-secondary)', marginTop: '4px', borderRadius: '2px' }}>
                        <div style={{ width: `${app.riskDetails.factors.blastRadius}%`, height: '100%', background: 'var(--text-primary)', borderRadius: '2px' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
