import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
      <Text style={styles.role}>Role: {user?.role}</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3d146' },
  title: { fontSize: 30, fontWeight: '900', color: '#1A237E', marginBottom: 10 },
  welcome: { fontSize: 20, color: '#333' },
  role: { fontSize: 18, color: '#20b8f4', fontWeight: 'bold', marginBottom: 30 },
  logoutBtn: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10 },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});