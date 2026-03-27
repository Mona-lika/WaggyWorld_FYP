import React from 'react';
import { LayoutDashboard, Users, PawPrint, FileText, Heart, Settings, UserCircle } from 'lucide-react';

export default function Sidebar() {
  return (
    <div style={sideStyles.sidebar}>
      <h2 style={sideStyles.logoText}>Dashboard-Admin</h2>
      
      <div style={sideStyles.nav}>
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
        <NavItem icon={<Users size={20} />} label="Users" />
        <NavItem icon={<PawPrint size={20} />} label="Pets" />
        <NavItem icon={<FileText size={20} />} label="Adoption Application" />
        <NavItem icon={<Heart size={20} />} label="Health Tracker" />
        <NavItem icon={<Settings size={20} />} label="Settings" />
      </div>

      <div style={sideStyles.footer}>
        <NavItem icon={<UserCircle size={20} />} label="Account" />
      </div>
    </div>
  );
}

const NavItem = ({ icon, label, active }) => (
  <div style={{ ...sideStyles.navItem, color: active ? '#20b8f4' : '#999' }}>
    {icon}
    <span style={{ marginLeft: '15px', fontWeight: active ? 'bold' : 'normal' }}>{label}</span>
  </div>
);

const sideStyles = {
  sidebar: { width: '280px', height: '100vh', padding: '40px', display: 'flex', flexDirection: 'column' },
  logoText: { fontSize: '20px', color: '#ccc', marginBottom: '60px' },
  nav: { flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', marginBottom: '30px', cursor: 'pointer', fontSize: '15px' },
  footer: { borderTop: '1px solid #eee', paddingTop: '30px' }
};