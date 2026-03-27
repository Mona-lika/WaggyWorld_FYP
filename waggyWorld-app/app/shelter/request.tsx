import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../src/context/AuthContext';
import { shelterStyles } from '../../src/styles/shelter.styles';

export default function ShelterApplications() {
    const { user, logout } = useContext(AuthContext);
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchShelterApps = async () => {
            try {
                // Ensure IP matches your current network
                const res = await axios.get(`http://192.168.1.64:5001/api/applications/shelter/${user.id}`);
                setApps(res.data);
            } catch (e) { 
                console.error("Fetch Shelter Applications Error:", e); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchShelterApps();
    }, []);

    const renderItem = ({ item }: any) => {

    // 2. ROBUST KEY CHECK: Check for every possible naming convention
    const photos = item.petImage || item.imageUrl || item.image_url || [];
    
    // 3. RESOLVE IMAGE SOURCE
    const petImgSource = (photos && photos.length > 0) 
        ? { uri: photos[0] } 
        : require('../../assets/WaggyWorld.png');
    
            return (
                <View style={styles.appCard}>
                    {/* Updated: Now uses the real pet image URI */}
                <Image 
                source={petImgSource} 
                style={styles.petThumb} 
                resizeMode="cover" 
                />               
                <View style={styles.cardInfo}>
                    <Text style={styles.petName}>{item.petName}</Text>
                    <Text style={styles.subText}>From: {item.adopterName}</Text>
                </View>

                {/* --- RIGHT SIDE: STATUS + BUTTON --- */}
                <View style={{ alignItems: 'flex-end' }}>
                    
                    {/* 1. Show Status Text only if it's NOT pending */}
                    {item.status !== 'pending' && (
                        <View style={[
                            styles.statusLabelText, 
                            { backgroundColor: item.status === 'approved' ? '#E8F5E9' : '#FFEBEE' }
                        ]}>
                            <Text style={[
                            styles.statusLabelText, 
                            { color: item.status === 'approved' ? '#2E7D32' : '#C62828' }
                        ]}>
                            {item.status === 'approved' ? 'ACCEPTED' : 'DECLINED'}
                            </Text>
                        </View>
                    )}

                    {/* 2. Review Button ALWAYS stays here */}
                    <TouchableOpacity 
                        style={[
                            styles.reviewBtn, 
                            item.status !== 'pending' && { marginTop: 5, backgroundColor: '#20b8f4' }
                        ]}
                        onPress={() => router.push(`/shelter/review/${item.id}` as any)}
                    >
                        <Text style={[
                            styles.reviewBtnText, 
                            item.status !== 'pending' && { color: '#ffffff' }
                        ]}>
                            Review
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* 1. HEADER SECTION (Matches User Module design) */}
            <View style={styles.header}>
                    <Image source={require('../../assets/WaggyWorldLogo.png')} style={shelterStyles.headerLogo} resizeMode="contain" />
                    <TouchableOpacity style={shelterStyles.profileCircle}>
                        <Image source={require('../../assets/profile.png')} style={{width: '100%', height: '100%'}} />
                    </TouchableOpacity>
                  </View>

            {/* 2. TITLE SECTION */}
            <View style={styles.titleSection}>
                <Text style={styles.title}>Incoming Adoption Requests</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#20b8f4" style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={apps} 
                    renderItem={renderItem} 
                    keyExtractor={i => i.id.toString()} 
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No adoption requests yet.</Text>}
                />
            )}

            {/* 3. BOTTOM NAVIGATION */}
            <View style={shelterStyles.bottomNav}>
                <TouchableOpacity onPress={() => router.replace('/shelter/dashboard' as any)}>
                    <Ionicons name="home-outline" size={26} color="#999" />
                </TouchableOpacity>
                
                <TouchableOpacity>
                    <Ionicons name="document-text" size={26} color="#20b8f4" />
                </TouchableOpacity>
                
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={26} color="#999" />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={logout}>
                    <Ionicons name="log-out-outline" size={26} color="#999" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
    header: {
        paddingTop: 60, 
        paddingHorizontal: 25, 
        paddingBottom: 20, 
        backgroundColor: '#f3d146', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    titleSection: {
        paddingHorizontal: 25,
        marginTop: 25,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
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
    petThumb: { width: 65, height: 65, borderRadius: 15, backgroundColor: '#f3d146' },
    cardInfo: { flex: 1, marginLeft: 15 },
    petName: { fontSize: 17, fontWeight: 'bold', color: '#000000' },
    subText: { fontSize: 13, color: '#666', marginTop: 2 },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusLabelText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
        marginBottom: 2
    },
    reviewBtn: { 
        backgroundColor: '#20b8f4', 
        paddingHorizontal: 15, 
        paddingVertical: 8, 
        borderRadius: 12 
    },
    reviewBtnText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 12 
    },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});