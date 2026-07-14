import { CreditCard, Check } from 'lucide-react';

export default function Billing() {
  return (
    <div className="card" style={{ gridColumn: '1 / -1' }}>
      <div className="card-header">
        <CreditCard size={24} />
        <div className="card-title">Billing & Plan Management</div>
      </div>
      <p className="card-desc">Upgrade your TrustPulse plan for advanced governance and automation tools.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        
        {/* Free Plan */}
        <div className="insight-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Personal</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '1rem 0' }}>₹0<span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo</span></div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Basic trust engine and canary tracking for individuals.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
            <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}><Check size={16} /> Personal Trust Bar</li>
            <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}><Check size={16} /> Canary Alerts</li>
          </ul>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }} disabled>Current Plan</button>
        </div>

        {/* Team Plan */}
        <div className="insight-card" style={{ display: 'flex', flexDirection: 'column', borderColor: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Team</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '1rem 0' }}>₹3,999<span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo/seat</span></div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Full governance and compliance toolkit for teams.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
            <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}><Check size={16} /> Everything in Personal</li>
            <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}><Check size={16} /> Risk Scoring Engine</li>
            <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}><Check size={16} /> Compliance Export (CSV)</li>
          </ul>
          <button className="btn" style={{ width: '100%', marginTop: '1.5rem' }}>Upgrade to Team</button>
        </div>

        {/* Enterprise Plan */}
        <div className="insight-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Enterprise</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '1rem 0' }}>Custom</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Advanced automation and SIEM integrations for scale.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
            <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}><Check size={16} /> Everything in Team</li>
            <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}><Check size={16} /> Offboarding Automation</li>
            <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}><Check size={16} /> Webhooks & SSO</li>
          </ul>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>Contact Sales</button>
        </div>

      </div>
    </div>
  );
}
