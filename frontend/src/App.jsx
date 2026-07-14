import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, Sun, ShieldAlert, Activity, PowerOff, ShieldCheck, 
  XOctagon, Smartphone, MessageCircle, Gamepad2, Activity as ActivityIcon, 
  Shield, Lock, ChevronRight, ChevronDown, ChevronUp, BookOpen, AlertTriangle, CheckCircle2, X, ExternalLink, PhoneCall
} from 'lucide-react';
import { io } from 'socket.io-client';

import OrgSidebar from './OrgSidebar';
import OrgOverview from './OrgOverview';
import AppDirectory from './AppDirectory';
import MemberDirectory from './MemberDirectory';
import AlertsFeed from './AlertsFeed';
import Compliance from './Compliance';
import Billing from './Billing';

const API_URL = 'http://localhost:3001';

const getAppIcon = (name) => {
  if (name.includes('Uber')) return <Smartphone size={20} />;
  if (name.includes('Snapchat')) return <MessageCircle size={20} />;
  if (name.includes('Game')) return <Gamepad2 size={20} />;
  if (name.includes('Fitness')) return <ActivityIcon size={20} />;
  return <Smartphone size={20} />;
};

const insights = [
  { 
    id: 1, 
    title: 'The Rise of Data-Theft Extortion (2026)', 
    summary: 'Why traditional backups are no longer enough to protect against modern attacks.', 
    content: 'A dominant trend in 2026 is the "pay-or-leak" model. Attackers exfiltrate massive volumes of sensitive data and threaten to publish it if ransoms are not met. Major incidents at companies like Novo Nordisk and Canvas LMS highlight that simply restoring from a backup doesn\'t stop the data from being leaked to the dark web. Proactive Canary monitoring is essential.',
    externalLink: 'https://www.pkware.com/blog/2026-data-breach-trends'
  },
  { 
    id: 2, 
    title: 'Zero Trust in a World of Machine-Speed Attacks', 
    summary: 'How AI is accelerating exploits from days to seconds.', 
    content: 'Threat actors are increasingly utilizing AI to craft undetectable social engineering campaigns and accelerate the exploitation of vulnerabilities, sometimes reducing the time between a flaw\'s discovery and its exploitation from days to mere seconds. The industry is pivoting to a "Zero Trust" architecture, requiring constant identity verification.',
    externalLink: 'https://www.ibm.com/reports/data-breach'
  },
  { 
    id: 3, 
    title: 'The 241-Day Detection Gap', 
    summary: 'Why waiting for corporate breach disclosures puts your identity at extreme risk.', 
    content: 'In the latest global reports, the average time to identify and contain a data breach was 241 days. Millions of users had no way of knowing their data was exposed until cybersecurity researchers found it being resold nearly eight months later. TrustPulse bridges this gap, alerting you in real-time.',
    externalLink: 'https://www.ibm.com/reports/data-breach'
  }
];

const authorityResources = [
  { id: 1, name: 'National Cyber Crime Portal (India)', desc: 'Report cyber crimes, financial frauds, and data theft directly to the government.', link: 'https://cybercrime.gov.in', phone: '1930' },
  { id: 2, name: 'CERT-In', desc: 'Indian Computer Emergency Response Team for cybersecurity incidents.', link: 'https://www.cert-in.org.in/', phone: '+91-11-24368572' },
  { id: 3, name: 'Internet Crime Complaint Center (IC3)', desc: 'The FBI\'s central hub for reporting cyber crime globally.', link: 'https://www.ic3.gov/', phone: null }
];

function App() {
  const [theme, setTheme] = useState('dark');
  const [step, setStep] = useState('login'); 
  const [activeTab, setActiveTab] = useState('consent'); 
  const [email, setEmail] = useState('');
  const [twoFaCode, setTwoFaCode] = useState('');
  const [apps, setApps] = useState([]);
  const [canaryAlert, setCanaryAlert] = useState(null);
  const [socket, setSocket] = useState(null);

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showIRModal, setShowIRModal] = useState(false);
  const [irSteps, setIrSteps] = useState([false, false, false, false]); 
  const [showComplaint, setShowComplaint] = useState(false);
  const [revokingAppId, setRevokingAppId] = useState(null);
  const [expandedAppId, setExpandedAppId] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (email.trim() !== '') setStep('2fa');
  };

  const handle2FASubmit = (e) => {
    e.preventDefault();
    if (twoFaCode.length >= 4) {
      setStep('dashboard');
      initializeDashboard(email);
    }
  };

  const initializeDashboard = (userEmail) => {
    fetchApps(userEmail);
    const newSocket = io(API_URL);
    setSocket(newSocket);
    
    // Check if user is org admin
    if (userEmail === 'admin@acme.com') {
      navigate('/org/org_1/overview');
    } else {
      navigate('/personal');
    }

    newSocket.on('canary-alert', (data) => {
      setCanaryAlert(data);
    });

    if (userEmail === 'breach@trustpulse.com') {
      setTimeout(() => { simulateBreach(); }, 5000);
    }
  };

  const fetchApps = async (userEmail = email) => {
    try {
      const res = await fetch(`${API_URL}/api/apps?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      setApps(data);
    } catch (err) {
      console.error('Error fetching apps:', err);
    }
  };

  const handleRevokeClick = (id) => {
    setRevokingAppId(id);
    setTimeout(() => {
      revokeApp(id);
      setRevokingAppId(null);
    }, 1500);
  };

  const revokeApp = async (id) => {
    try {
      await fetch(`${API_URL}/api/apps/${id}/revoke?email=${encodeURIComponent(email)}`, { method: 'POST' });
      fetchApps();
    } catch (err) {
      console.error('Error revoking app:', err);
    }
  };

  const revokeAllDormant = async () => {
    try {
      await fetch(`${API_URL}/api/revoke-all-dormant?email=${encodeURIComponent(email)}`, { method: 'POST' });
      fetchApps();
    } catch (err) {
      console.error('Error revoking dormant apps:', err);
    }
  };

  const simulateBreach = async () => {
    try {
      await fetch(`${API_URL}/api/trigger-breach`, { method: 'POST' });
    } catch (err) {
      console.error('Error triggering breach:', err);
    }
  };

  const logout = () => {
    setStep('login');
    setEmail('');
    setTwoFaCode('');
    setApps([]);
    setCanaryAlert(null);
    setIrSteps([false, false, false, false]);
    setShowIRModal(false);
    setShowComplaint(false);
    setActiveTab('consent');
    if (socket) socket.close();
    navigate('/');
  };

  const resolveIncident = () => {
    setCanaryAlert(null);
    setShowIRModal(false);
    setIrSteps([false, false, false, false]);
    setShowComplaint(false);
  };

  const toggleIrStep = (index) => {
    const newSteps = [...irSteps];
    newSteps[index] = !newSteps[index];
    setIrSteps(newSteps);
  };

  const allIrStepsCompleted = irSteps.every(s => s === true);
  const totalApps = apps.filter(a => a.status !== 'revoked').length;
  const dormantApps = apps.filter(a => a.status === 'dormant').length;
  const healthScore = totalApps === 0 ? 100 : Math.round(((totalApps - dormantApps) / totalApps) * 100);

  const dpdpText = `To The Grievance Officer, ${canaryAlert?.source || 'The Data Fiduciary'}\n\nSubject: Notice of Data Breach under Section 8 of the Digital Personal Data Protection Act, 2023\n\nI, the undersigned Data Principal, hereby notify you that my personal data entrusted to your organization has been breached and exposed on a public forum, confirmed via TrustPulse Canary Network on ${new Date().toLocaleDateString()}.\n\nUnder the DPDP Act 2023, you are required to report this breach to the Data Protection Board and take immediate remedial action. Failure to do so will result in a formal complaint to the Board.\n\nPlease confirm receipt of this notice and the steps taken within 72 hours.`;

  // Authentication UI
  if (step === 'login' || step === '2fa') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-container">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src="/logo.png" alt="TrustPulse Logo" style={{ height: '48px', filter: theme === 'dark' ? 'grayscale(100%) invert(100%)' : 'grayscale(100%)' }} />
            <h1 style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 800 }}>TRUSTPULSE</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enterprise Privacy & Security</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'login' && (
              <motion.form key="login" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Work Email</label>
                  <input type="email" className="input-field" placeholder="admin@acme.com for B2B" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn" style={{ width: '100%' }}>Continue <ChevronRight size={18} /></button>
              </motion.form>
            )}

            {step === '2fa' && (
              <motion.form key="2fa" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} onSubmit={handle2FASubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Authenticator Code</label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{email}</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input type="text" className="input-field" style={{ paddingLeft: '2.5rem', letterSpacing: '0.2rem', fontWeight: 600 }} placeholder="000000" maxLength={6} value={twoFaCode} onChange={(e) => setTwoFaCode(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="btn" style={{ width: '100%' }}>Verify & Login <ChevronRight size={18} /></button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        <button className="btn btn-secondary" style={{ position: 'absolute', top: '2rem', right: '2rem' }} onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </motion.div>
    );
  }

  const isB2B = location.pathname.includes('/org');

  const header = (
    <header className="header" style={{ marginBottom: isB2B ? '2rem' : '3rem' }}>
      <div className="logo-area" style={{ cursor: 'pointer' }} onClick={() => navigate('/personal')}>
        <img src="/logo.png" alt="TrustPulse Logo" />
        <span className="logo-text">TRUSTPULSE</span>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{email}</span>
        {email === 'admin@acme.com' && (
          <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }} onClick={() => navigate(isB2B ? '/personal' : '/org/org_1/overview')}>
            {isB2B ? 'Personal View' : 'Admin Console'}
          </button>
        )}
        <button className="btn btn-secondary" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="btn btn-secondary" onClick={logout} style={{ padding: '0.5rem' }} title="Logout">
          <PowerOff size={18} />
        </button>
      </div>
    </header>
  );

  const PersonalDashboard = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="container">
      {header}

      <AnimatePresence>
        {canaryAlert && !showIRModal && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} className="flash-alert">
            <ShieldAlert size={40} />
            <div style={{ flex: 1 }}>
              <h4>Critical Breach Detected</h4>
              <p>Source: {canaryAlert.source} &bull; Records Exposed: {canaryAlert.recordsExposed?.toLocaleString()}</p>
              {canaryAlert.confidenceThreshold && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--alert-text)', fontWeight: 600 }}>
                  <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> 
                  {canaryAlert.confidenceThreshold}
                </p>
              )}
            </div>
            <button className="btn btn-secondary" style={{ color: 'var(--text-primary)', background: 'var(--bg-primary)' }} onClick={() => setShowIRModal(true)}>
              Take Action
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'consent' ? 'active' : ''}`} onClick={() => setActiveTab('consent')}>
          <PowerOff size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> Consent Decay
        </button>
        <button className={`tab-btn ${activeTab === 'canary' ? 'active' : ''}`} onClick={() => setActiveTab('canary')}>
          <Activity size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> Canary Network
          {canaryAlert && <span style={{ marginLeft: '8px', background: 'var(--alert-text)', color: 'var(--alert-bg)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>!</span>}
        </button>
        <button className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`} onClick={() => setActiveTab('insights')}>
          <BookOpen size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> Insights & Resources
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Module 1: Consent Decay */}
        {activeTab === 'consent' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ gridColumn: '1 / -1', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div className="card-header">
              <PowerOff size={24} />
              <div className="card-title">Consent Decay Management</div>
            </div>
            <p className="card-desc">Monitor and revoke unused third-party permissions to minimize your digital attack surface.</p>

            <div className="health-score">
              <motion.div className="score-circle" animate={{ color: healthScore < 50 ? 'var(--badge-text-dormant)' : 'var(--text-primary)', borderColor: healthScore < 50 ? 'var(--badge-text-dormant)' : 'var(--text-primary)' }}>
                {healthScore}
              </motion.div>
              <div className="score-info">
                <h3>Global Privacy Health Score</h3>
                <p>Based on {totalApps} active permissions. {dormantApps} dormant connections detected.</p>
              </div>
            </div>
            
            <div className="app-list">
              <AnimatePresence>
                {apps.filter(app => app.status !== 'revoked').map(app => (
                  <motion.div key={app.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }} className="app-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="app-info" style={{ flex: 1 }}>
                        <div className="app-icon">{getAppIcon(app.name)}</div>
                        <div className="app-details">
                          <strong>{app.name}</strong>
                          <div className={`badge ${app.status}`}>{app.status}</div>
                          <div className="meta">Used: {new Date(app.lastUsedAt || app.lastUsed).toLocaleDateString()} &bull; {app.scopes?.join(', ') || app.permissions?.join(', ')}</div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: app.trustScore > 80 ? '#22c55e' : (app.trustScore > 40 ? '#eab308' : '#ef4444') }}>{app.trustScore}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>TRUST SCORE</div>
                        </div>

                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setExpandedAppId(expandedAppId === app.id ? null : app.id)}>
                          {expandedAppId === app.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        {revokingAppId === app.id ? (
                          <span className="meta" style={{ color: 'var(--alert-text)', width: '120px', textAlign: 'right' }}>Redirecting to OS Settings...</span>
                        ) : (
                          <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => handleRevokeClick(app.id)} title="Revoke Access">
                            <XOctagon size={18} />
                          </button>
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedAppId === app.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                          <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Trust Score Breakdown</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <div className="meta">Data Sensitvity Penalty</div>
                              <div style={{ width: '100%', height: '4px', background: 'var(--bg-secondary)', marginTop: '4px', borderRadius: '2px' }}>
                                <div style={{ width: `30%`, height: '100%', background: 'var(--text-primary)', borderRadius: '2px' }} />
                              </div>
                            </div>
                            <div>
                              <div className="meta">Scope Breadth</div>
                              <div style={{ width: '100%', height: '4px', background: 'var(--bg-secondary)', marginTop: '4px', borderRadius: '2px' }}>
                                <div style={{ width: `60%`, height: '100%', background: 'var(--text-primary)', borderRadius: '2px' }} />
                              </div>
                            </div>
                            <div>
                              <div className="meta">Inactivity Time</div>
                              <div style={{ width: '100%', height: '4px', background: 'var(--bg-secondary)', marginTop: '4px', borderRadius: '2px' }}>
                                <div style={{ width: app.status === 'dormant' ? '100%' : '10%', height: '100%', background: 'var(--text-primary)', borderRadius: '2px' }} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
              {apps.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>No connected apps found.</p>}
            </div>

            <AnimatePresence>
              {dormantApps > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }}>
                  <button className="btn" style={{ width: '100%' }} onClick={revokeAllDormant}>
                    <ShieldCheck size={18} /> Revoke All Dormant Access (+{dormantApps * 15} pts)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Module 2: Canary Network */}
        {activeTab === 'canary' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ gridColumn: '1 / -1', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div className="card-header">
              <Activity size={24} />
              <div className="card-title">Canary Network Status</div>
            </div>
            <p className="card-desc">Decentralized real-time monitoring of identity markers across dark web nodes. Avoid the 241-day global detection gap.</p>
            
            <div className="radar-container">
              <Shield size={48} color="var(--text-primary)" style={{ position: 'relative', zIndex: 10 }} />
              {!canaryAlert && (
                <>
                  <motion.div className="radar-circle" animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
                  <motion.div className="radar-circle" animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }} />
                </>
              )}
              {canaryAlert && (
                <motion.div className="radar-circle" style={{ borderColor: 'var(--alert-text)', background: 'var(--alert-text)' }} animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 0.5, repeat: Infinity }} />
              )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem', flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem', color: canaryAlert ? 'var(--badge-text-dormant)' : 'inherit' }}>
                {canaryAlert ? 'NETWORK COMPROMISED' : 'NETWORK SECURE'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {canaryAlert ? 'A canary marker was triggered in real-time.' : 'Actively monitoring 14 nodes.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Module 3: Security Insights & Resources */}
        {activeTab === 'insights' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ gridColumn: '1 / -1' }}>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <BookOpen size={24} />
                <div className="card-title">Security Insights</div>
              </div>
              <p className="card-desc">Educational resources and recent 2026 real-world breach statistics to help you protect your identity.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {insights.map(article => (
                  <div key={article.id} className="insight-card" onClick={() => setSelectedArticle(article)}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{article.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{article.summary}</p>
                    <div style={{ marginTop: '1rem', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Read Full Article <ChevronRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <ShieldAlert size={24} />
                <div className="card-title">Public Authorities & Emergency Resources</div>
              </div>
              <p className="card-desc">If you are the victim of identity theft, financial fraud, or a severe data breach, contact the appropriate public authority immediately to solve the issue and take legal action.</p>
              
              <div className="app-list">
                {authorityResources.map(resource => (
                  <div key={resource.id} className="app-item" style={{ cursor: 'default' }}>
                    <div className="app-info">
                      <div className="app-icon"><Shield size={20} /></div>
                      <div className="app-details">
                        <strong>{resource.name}</strong>
                        <div className="meta">{resource.desc}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {resource.phone && (
                        <a href={`tel:${resource.phone}`} style={{ textDecoration: 'none' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.5rem' }} title={`Call ${resource.phone}`}>
                            <PhoneCall size={18} />
                          </button>
                        </a>
                      )}
                      <a href={resource.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Visit Official Website">
                          <ExternalLink size={18} />
                        </button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={() => setSelectedArticle(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="btn btn-secondary" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.5rem' }} onClick={() => setSelectedArticle(null)}>
                <X size={20} />
              </button>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', paddingRight: '2rem' }}>{selectedArticle.title}</h2>
              <div style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {selectedArticle.content}
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <a href={selectedArticle.externalLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button className="btn">
                    Read Source Report <ExternalLink size={16} />
                  </button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incident Response Modal */}
      <AnimatePresence>
        {showIRModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="modal-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--badge-text-dormant)' }}>
                <AlertTriangle size={32} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Detailed Remediation Plan</h2>
              </div>
              
              {!showComplaint ? (
                <button className="btn btn-secondary" style={{ width: '100%', marginBottom: '1.5rem', border: '1px solid var(--text-primary)' }} onClick={() => setShowComplaint(true)}>
                  <BookOpen size={18} style={{ marginRight: '8px' }} /> Generate DPDP Act 2023 Complaint
                </button>
              ) : (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    Automated Legal Draft (DPDP Act 2023)
                    <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => navigator.clipboard.writeText(dpdpText)}>Copy Text</button>
                  </strong>
                  <textarea readOnly value={dpdpText} style={{ width: '100%', height: '160px', padding: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', resize: 'none', lineHeight: 1.5 }} />
                </motion.div>
              )}

              <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Your Canary identifier was exposed. Follow these detailed steps to secure your digital identity and resolve this critical incident.
              </p>

              <div>
                <div className={`checklist-item ${irSteps[0] ? 'done' : ''}`} onClick={() => toggleIrStep(0)} style={{ cursor: 'pointer' }}>
                  {irSteps[0] ? <CheckCircle2 size={24} color="var(--text-primary)" style={{ flexShrink: 0 }} /> : <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border-subtle)', flexShrink: 0 }} />}
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Step 1: Identify Leaked Assets</strong>
                    <span style={{ fontSize: '0.85rem' }}>
                      Navigate securely to the compromised service ({canaryAlert?.source}). <strong>Do not</strong> click any links from unknown emails about this breach. Check your profile settings to determine exactly what personal data points were stored there.
                    </span>
                  </div>
                </div>

                <div className={`checklist-item ${irSteps[1] ? 'done' : ''}`} onClick={() => toggleIrStep(1)} style={{ cursor: 'pointer' }}>
                  {irSteps[1] ? <CheckCircle2 size={24} color="var(--text-primary)" style={{ flexShrink: 0 }} /> : <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border-subtle)', flexShrink: 0 }} />}
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Step 2: Rotate Credentials</strong>
                    <span style={{ fontSize: '0.85rem' }}>
                      Use a reputable password manager to generate a new, random 16+ character password for this service. <strong>Crucially</strong>, if you have reused your old password on any other websites, you must change those immediately.
                    </span>
                  </div>
                </div>

                <div className={`checklist-item ${irSteps[2] ? 'done' : ''}`} onClick={() => toggleIrStep(2)} style={{ cursor: 'pointer' }}>
                  {irSteps[2] ? <CheckCircle2 size={24} color="var(--text-primary)" style={{ flexShrink: 0 }} /> : <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border-subtle)', flexShrink: 0 }} />}
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Step 3: Secure with Hardware/App 2FA</strong>
                    <span style={{ fontSize: '0.85rem' }}>
                      Download an authenticator app (Google Authenticator, Authy, or use a YubiKey). Navigate to the service's security settings and enable Multi-Factor Authentication. <strong>Avoid SMS-based 2FA</strong>.
                    </span>
                  </div>
                </div>

                <div className={`checklist-item ${irSteps[3] ? 'done' : ''}`} onClick={() => toggleIrStep(3)} style={{ cursor: 'pointer' }}>
                  {irSteps[3] ? <CheckCircle2 size={24} color="var(--text-primary)" style={{ flexShrink: 0 }} /> : <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border-subtle)', flexShrink: 0 }} />}
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Step 4: Report to Authorities</strong>
                    <span style={{ fontSize: '0.85rem' }}>
                      If financial or critical identity data was stolen, file a report with your local authority immediately to protect yourself legally. In India, visit <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}>cybercrime.gov.in</a> or call 1930. 
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn" disabled={!allIrStepsCompleted} style={{ opacity: allIrStepsCompleted ? 1 : 0.5, cursor: allIrStepsCompleted ? 'pointer' : 'not-allowed' }} onClick={resolveIncident}>
                  Resolve Incident
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/personal" replace />} />
      <Route path="/personal" element={<PersonalDashboard />} />
      <Route path="/org/:orgId/*" element={
        <div className="b2b-layout">
          <OrgSidebar orgId="org_1" />
          <div className="b2b-content">
            {header}
            <div style={{ padding: '0 2rem' }}>
              <Routes>
                <Route path="overview" element={<OrgOverview orgId="org_1" api_url={API_URL} />} />
                <Route path="apps" element={<AppDirectory orgId="org_1" api_url={API_URL} />} />
                <Route path="members" element={<MemberDirectory orgId="org_1" api_url={API_URL} />} />
                <Route path="alerts" element={<AlertsFeed orgId="org_1" socket={socket} api_url={API_URL} />} />
                <Route path="compliance" element={<Compliance orgId="org_1" api_url={API_URL} />} />
                <Route path="billing" element={<Billing />} />
                <Route path="*" element={<Navigate to="overview" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
