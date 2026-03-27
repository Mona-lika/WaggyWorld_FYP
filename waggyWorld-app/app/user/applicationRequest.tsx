import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../src/context/AuthContext';
import { homeStyles } from '../../src/styles/home.styles'; 

export default function UserApplications() {
    const { user, logout } = useContext(AuthContext);
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserApps = async () => {
            try {
                // UPDATE IP to your MacBook IP
                const res = await axios.get(`http://192.168.1.64:5001/api/applications/user/${user.id}`);
                setApps(res.data);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchUserApps();
    }, []);

    const renderItem = ({ item }: any) => {
        // --- DYNAMIC IMAGE LOGIC ---
        // Check for petImage array from the backend JOIN
        const photos = item.petImage || [];
        const petImgSource = photos.length > 0 
            ? { uri: photos[0] } 
            : require('../../assets/WaggyWorld.png');

        return (
            <View style={styles.appCard}>
                {/* Updated: Now uses the real pet image URI */}
                <Image source={petImgSource} style={styles.petThumb} resizeMode="cover" />
                
                <View style={styles.cardInfo}>
                    <Text style={styles.petName}>{item.petName}</Text>
                    <Text style={styles.subText}>Shelter: {item.shelterName}</Text>
                    {/* SHOW THE FEEDBACK */}
                    {item.status === 'approved' && <Text style={{color: '#4CAF50', fontSize: 12, fontWeight: '600', marginTop: 3}}>
                        Visit Date: {item.visitDate || "Pending Schedule"}</Text>}
                    {item.status === 'rejected' && <Text style={{color: '#F44336', fontSize: 12, fontWeight: '600', marginTop: 3}}>
                        Reason: {item.rejectionReason || "No reason provided"}</Text>}
                </View>

                <View style={[styles.statusBadge, { backgroundColor: getStatusBg(item.status) }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status}
                    </Text>
                </View>
            </View>
        );
    };

    // Helper functions for dynamic status colors
    const getStatusBg = (status: string) => status === 'approved' ? '#E8F5E9' : '#FFF8E1';
    const getStatusColor = (status: string) => status === 'approved' ? '#2E7D32' : '#FBC02D';

    return (
        <View style={homeStyles.container}>
            {/* 1. HEADER SECTION (Matches Dashboard exactly) */}
            <View style={homeStyles.header}>
                <Text style={homeStyles.logoText}>WAGGYWORLD</Text>
                <TouchableOpacity style={homeStyles.profileCircle}>
                    <Ionicons name="person" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* 2. TITLE SECTION (Wireframe Style) */}
            <View style={styles.titleSection}>
                <Text style={styles.title}>Adoption Application Requests</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#20b8f4" style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={apps} 
                    renderItem={renderItem} 
                    keyExtractor={i => i.id.toString()} 
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>You haven't applied for any pets yet.</Text>}
                />
            )}

            {/* --- ADDED NAVIGATION BAR --- */}
            <View style={homeStyles.bottomNav}>
                <TouchableOpacity onPress={() => router.replace('/user/dashboard' as any)}>
                    <Ionicons name="home-outline" size={28} color="#999" />
                </TouchableOpacity>
                
                <TouchableOpacity>
                    <Ionicons name="document-text" size={28} color="#20b8f4" />
                </TouchableOpacity>
                
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={28} color="#999" />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={logout}>
                    <Ionicons name="log-out-outline" size={28} color="#999" />
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    titleSection: {
        paddingHorizontal: 25,
        marginTop: 25,
        alignItems: 'center', 
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#20b8f4',
    },
    appCard: { 
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 20, 
        marginBottom: 12, 
        alignItems: 'center', 
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    petThumb: { width: 65, height: 65, borderRadius: 15, backgroundColor: '#f0f0f0' },
    cardInfo: { flex: 1, marginLeft: 15 },
    petName: { fontSize: 17, fontWeight: 'bold', color: '#000000' },
    subText: { fontSize: 13, color: '#666', marginTop: 2 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    statusText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});