import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';

function App() {
  // Check if admin is already logged in
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  // If not logged in, show only the Login Page
  if (!token) {
    return <Login setToken={setToken} />;
  }

  // If logged in, show the Dashboard with the Sidebar
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;