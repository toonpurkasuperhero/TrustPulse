import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserMinus, CheckCircle2 } from 'lucide-react';

export default function MemberDirectory({ orgId, api_url }) {
  const [members, setMembers] = useState([]);
  const [offboardingUser, setOffboardingUser] = useState(null);
  const [offboardResult, setOffboardResult] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, [orgId, api_url]);

  const fetchMembers = () => {
    fetch(`${api_url}/api/org/${orgId}/members`)
      .then(r => r.json())
      .then(data => setMembers(data));
  };

  const handleOffboard = async (userId) => {
    try {
      const res = await fetch(`${api_url}/api/org/${orgId}/members/${userId}/offboard`, { method: 'POST' });
      const data = await res.json();
      setOffboardResult(data.result);
      fetchMembers();
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="card" style={{ gridColumn: '1 / -1' }}>
      <div className="card-header">
        <Users size={24} />
        <div className="card-title">Member Directory</div>
      </div>
      <p className="card-desc">Manage employee access and offboarding workflows.</p>
      
      <div className="app-list">
        {members.map(member => (
          <div key={member.userId} className="app-item">
            <div className="app-info">
              <div className="app-details">
                <strong>{member.email}</strong>
                <div className={`badge ${member.employmentStatus === 'active' ? 'active' : 'dormant'}`}>{member.employmentStatus}</div>
                <div className="meta">Role: {member.role} &bull; Apps Connected: {member.appCount}</div>
              </div>
            </div>
            
            {member.employmentStatus === 'active' && (
              <button className="btn btn-secondary" onClick={() => setOffboardingUser(member)}>
                <UserMinus size={18} /> Offboard
              </button>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {offboardingUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="modal-content">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Offboard {offboardingUser.email}</h2>
              
              {!offboardResult ? (
                <>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    This action will change their status to offboarded and automatically revoke all high/critical risk app connections.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" onClick={() => setOffboardingUser(null)}>Cancel</button>
                    <button className="btn" style={{ background: '#ef4444' }} onClick={() => handleOffboard(offboardingUser.userId)}>Confirm Offboard</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    Offboarding complete. Review automated actions below:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {offboardResult.revokedApps.map(app => (
                      <div key={app.appId} className="checklist-item done" style={{ marginBottom: 0, padding: '1rem' }}>
                        <CheckCircle2 size={24} color="#22c55e" />
                        <div>
                          <strong>{app.name} Revoked</strong>
                          <div className="meta">Due to {app.scopeSensitivity} sensitivity.</div>
                        </div>
                      </div>
                    ))}
                    {offboardResult.flaggedApps.map(app => (
                      <div key={app.appId} className="checklist-item" style={{ marginBottom: 0, padding: '1rem' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border-subtle)', flexShrink: 0 }} />
                        <div>
                          <strong>{app.name} Flagged for Review</strong>
                          <div className="meta">Requires manual administrative review.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn" onClick={() => { setOffboardingUser(null); setOffboardResult(null); }}>Done</button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
