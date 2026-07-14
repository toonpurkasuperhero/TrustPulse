import { useState, useEffect } from 'react';
import { FileCheck, Download } from 'lucide-react';

export default function Compliance({ orgId, api_url }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch(`${api_url}/api/org/${orgId}/audit-log`)
      .then(r => r.json())
      .then(data => setLogs(data));
  }, [orgId, api_url]);

  const handleExport = () => {
    window.open(`${api_url}/api/org/${orgId}/export/compliance-report`, '_blank');
  };

  return (
    <div className="card" style={{ gridColumn: '1 / -1' }}>
      <div className="card-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileCheck size={24} />
          <div className="card-title">Compliance & Audit Logs</div>
        </div>
        <button className="btn" onClick={handleExport}>
          <Download size={18} /> Export CSV Report
        </button>
      </div>
      <p className="card-desc">Review automated governance actions and generate compliance reports for your security audits.</p>
      
      <div className="app-list">
        {logs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '2rem 0', textAlign: 'center' }}>No audit logs available yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.logId} className="app-item" style={{ cursor: 'default' }}>
              <div className="app-info">
                <div className="app-details">
                  <strong>{log.action.toUpperCase()}</strong>
                  <div className="meta">Target: {log.targetAppId || log.targetUserId} &bull; Actor: {log.actorId}</div>
                  <div className="meta">Timestamp: {new Date(log.timestamp).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
