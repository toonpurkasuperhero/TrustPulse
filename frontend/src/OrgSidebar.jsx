import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AppWindow, 
  Users, 
  Bell, 
  FileCheck, 
  CreditCard 
} from 'lucide-react';

export default function OrgSidebar({ orgId }) {
  const getNavClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';

  return (
    <div className="org-sidebar">
      <div className="sidebar-header">
        <h2 style={{ fontSize: '1rem', fontWeight: 800 }}>Admin Console</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to={`/org/${orgId}/overview`} className={getNavClass}>
          <LayoutDashboard size={18} /> Overview
        </NavLink>
        <NavLink to={`/org/${orgId}/apps`} className={getNavClass}>
          <AppWindow size={18} /> App Directory
        </NavLink>
        <NavLink to={`/org/${orgId}/members`} className={getNavClass}>
          <Users size={18} /> Members
        </NavLink>
        <NavLink to={`/org/${orgId}/alerts`} className={getNavClass}>
          <Bell size={18} /> Alerts Feed
        </NavLink>
        <NavLink to={`/org/${orgId}/compliance`} className={getNavClass}>
          <FileCheck size={18} /> Compliance
        </NavLink>
        <NavLink to={`/org/${orgId}/billing`} className={getNavClass}>
          <CreditCard size={18} /> Billing & Plans
        </NavLink>
      </nav>
    </div>
  );
}
