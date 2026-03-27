import React, { useEffect, useState } from 'react';
import { Users, PawPrint, FileText, Activity, Bell, Check, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api/index';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/admin/overview').then(res => setData(res.data));
  }, []);

  const chartData = [
    { name: 'Jan', adoptions: 40 },
    { name: 'Feb', adoptions: 30 },
    { name: 'Mar', adoptions: 60 },
  ];

  if (!data) return <div style={{padding: '50px'}}>Loading WaggyWorld Command Center...</div>;

  return (
    <div style={styles.dashboardContainer}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.welcomeText}>Hello, Admin !</h1>
          <p style={styles.subText}>Welcome ! Nice to meet you.</p>
        </div>
        <div style={styles.headerIcons}>
          <Bell size={24} style={{ marginRight: 20, cursor: 'pointer' }} />
          <div style={styles.profileCircle}></div>
        </div>
      </div>

      {/* 1. SUMMARY CARDS */}
      <div style={styles.statsRow}>
        <StatCard icon={<Users color="#20b8f4" />} label="Total Users" value={data.stats.users} />
        <StatCard icon={<PawPrint color="#46ab4d" />} label="Total Pets" value={data.stats.pets} />
        <StatCard icon={<FileText color="#f3d146" />} label="Applications" value={data.stats.apps} />
        <StatCard icon={<Activity color="#FF3B30" />} label="Health Records" value={data.stats.health} />
      </div>

      {/* 2. RECENT APPLICATIONS TABLE */}
      <div style={styles.mainContentRow}>
        <div style={styles.tableCard}>
          <h3 style={styles.cardTitle}>Recent Adoption Requests</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>User Name</th>
                <th>Pet Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.recentApps.map(app => (
                <tr key={app.id} style={styles.tableRow}>
                  <td>{app.userName}</td>
                  <td>{app.petName}</td>
                  <td><span style={styles.statusBadge}>{app.status}</span></td>
                  <td>
                    <button style={styles.actionBtnCheck}><Check size={16} /></button>
                    <button style={styles.actionBtnCross}><X size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. ANALYTICS CHART */}
        <div style={styles.chartCard}>
            <h3 style={styles.cardTitle}>Adoptions Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f0f0f0'}} />
                    <Bar dataKey="adoptions" fill="#20b8f4" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Sub-components for clean structure
const StatCard = ({ icon, label, value }) => (
  <div style={styles.statCard}>
    <div style={styles.statIcon}>{icon}</div>
    <div style={styles.statInfo}>
      <h2 style={styles.statValue}>{value}</h2>
      <p style={styles.statLabel}>{label}</p>
    </div>
  </div>
);

const styles = {
  dashboardContainer: { backgroundColor: '#FFF9E1', borderRadius: '40px', padding: '40px', minHeight: '90vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  welcomeText: { fontSize: '32px', fontWeight: 'bold', color: '#1A237E' },
  subText: { color: '#999' },
  headerIcons: { display: 'flex', alignItems: 'center' },
  profileCircle: { width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#9BB8A9' },
  
  statsRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', gap: '20px' },
  statCard: { flex: 1, backgroundColor: '#fff', padding: '25px', borderRadius: '25px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' },
  statIcon: { padding: '15px', borderRadius: '15px', backgroundColor: '#f9f9f9', marginRight: '15px' },
  statValue: { fontSize: '24px', fontWeight: '900', color: '#333' },
  statLabel: { fontSize: '13px', color: '#999' },

  mainContentRow: { display: 'flex', gap: '30px' },
  tableCard: { flex: 2, backgroundColor: '#fff', padding: '30px', borderRadius: '30px' },
  chartCard: { flex: 1, backgroundColor: '#fff', padding: '30px', borderRadius: '30px' },
  cardTitle: { marginBottom: '25px', color: '#1A237E', fontWeight: 'bold' },
  
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { textAlign: 'left', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#999', fontSize: '14px' },
  tableRow: { borderBottom: '1px solid #f9f9f9' },
  statusBadge: { backgroundColor: '#FFF8E1', color: '#FBC02D', padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' },
  actionBtnCheck: { border: 'none', backgroundColor: '#E8F5E9', color: '#4CAF50', padding: '8px', borderRadius: '10px', marginRight: '10px', cursor: 'pointer' },
  actionBtnCross: { border: 'none', backgroundColor: '#FFEBEE', color: '#FF5252', padding: '8px', borderRadius: '10px', cursor: 'pointer' },
};