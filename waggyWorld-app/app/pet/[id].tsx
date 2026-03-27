import React, { useEffect, useState, useContext } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, 
  TouchableOpacity, ActivityIndicator, Dimensions, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../src/context/AuthContext';

const { width } = Dimensions.get('window');

export default function PetDetails() {
  const { id } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 1. STATE FOR TAB NAVIGATION
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const API_URL = `http://192.168.1.64:5001/api/pets/${id}`;
        const res = await axios.get(API_URL);
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#20b8f4" /></View>;
  if (!data) return <View style={styles.loader}><Text>Pet data not found</Text></View>;

  const { pet, shelterName } = data;
  const photos = pet.imageUrl || pet.image_url || [];
  const mainImage = photos.length > 0 ? { uri: photos[0] } : require('../../assets/WaggyWorld.png');

  // --- RENDERING LOGIC FOR TABS ---

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <View>
             {/* Quick Stats Grid */}
            <View style={styles.statsGrid}>
               <StatBox icon="calendar-outline" label="Age" value={pet.age} />
               <StatBox icon="paw-outline" label="Species" value={pet.species} />
               <StatBox icon="location-outline" label="Location" value={pet.location?.split(',')[0]} />
            </View>
            <Text style={styles.sectionTitle}>About {pet.name}</Text>
            <Text style={styles.descriptionText}>{pet.description || "No description provided."}</Text>
          </View>
        );
      case 'Health':
        return (
          <View>
            <Text style={styles.sectionTitle}>Medical Records</Text>
            <View style={styles.healthRow}>
               <HealthTag label="Vaccinated" status={pet.vaccinated} />
               <HealthTag label="Neutered" status={pet.neutered} />
               <HealthTag label="Dewormed" status={pet.dewormed} />
            </View>
            {pet.medicalIssues ? (
                <View style={styles.issueCard}>
                    <Text style={styles.medicalNote}>Medical Notes:</Text>
                    <Text style={{color: '#444'}}>{pet.medicalIssues}</Text>
                </View>
            ) : <Text style={{color: '#999', fontStyle: 'italic'}}>No known medical issues.</Text>}
          </View>
        );
      case 'Behavior':
        return (
          <View>
            <Text style={styles.sectionTitle}>Behavior & Lifestyle</Text>
            <View style={styles.infoCard}>
                <InfoRow label="Temperament" value={pet.temperament} icon="happy-outline" />
                <InfoRow label="Good with Kids" value={pet.goodWithKids} icon="people-outline" />
                <InfoRow label="Good with Pets" value={pet.goodWithPets} icon="paw-outline" />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* IMAGE HEADER */}
      <View style={styles.imageSection}>
        <Image source={mainImage} style={styles.mainImage} resizeMode="cover" />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* HEADER INFO */}
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{pet.breed}</Text>
            </View>
            <View style={[styles.genderBadge, { backgroundColor: pet.gender === 'Male' ? '#E3F2FD' : '#FCE4EC' }]}>
               <FontAwesome5 name={pet.gender === 'Male' ? 'mars' : 'venus'} size={20} color={pet.gender === 'Male' ? '#20b8f4' : '#f06292'} />
            </View>
          </View>

          {/* SHELTER CARD */}
          <View style={styles.shelterSection}>
            {/* Circular Profile Image */}
             <Image 
                source={require('../../assets/profile.png')} // Replace with shelter's specific image later
                style={styles.shelterImage} 
                resizeMode="cover"
            />
  
            <View style={styles.shelterInfo}>
            <Text style={styles.shelterName}>{shelterName}</Text>
            {/* Displaying city/area from pet location */}
            <Text style={styles.shelterLocation}>
                {pet.location ? pet.location.split(',')[0] : 'Lalitpur'}
            </Text>
            </View>
        </View>

            {/* Thin Horizontal Line Divider */}
            <View style={styles.divider} />

          {/* 2. CUSTOM NAV BAR */}
          <View style={styles.tabBar}>
            {['Overview', 'Health', 'Behavior'].map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 3. DYNAMIC CONTENT AREA */}
          <View style={{ marginTop: 20 }}>
            {renderTabContent()}
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* STICKY FOOTER */}
      <View style={styles.footer}>
        <View>
            <Text style={styles.feeLabel}>Total Fee</Text>
            <Text style={styles.feeValue}>{pet.adoptionFee === '0' || !pet.adoptionFee ? 'Free' : `Rs. ${pet.adoptionFee}`}</Text>
        </View>
        <TouchableOpacity 
            style={styles.adoptBtn} 
            onPress={() => router.push({
            pathname: '/pet/application' as any,
            params: { petId: pet.id, shelterId: pet.shelterId, petName: pet.name }
            })}
        >
  <Text style={styles.adoptBtnText}>Adopt Me</Text>
</TouchableOpacity>
      </View>
    </View>
  );
}

// --- UI HELPERS ---
const StatBox = ({ icon, label, value }: any) => (
  <View style={styles.statBox}>
    <Ionicons name={icon} size={20} color="#f3d146" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const HealthTag = ({ label, status }: any) => (
  <View style={styles.healthTag}>
    <Ionicons name={status === 'Yes' ? "checkmark-circle" : "close-circle"} size={18} color={status === 'Yes' ? "#4CAF50" : "#999"} />
    <Text style={styles.healthTagText}>{label}</Text>
  </View>
);

const InfoRow = ({ label, value, icon }: any) => (
    <View style={styles.infoRow}>
      <View style={{flexDirection:'row', alignItems:'center'}}>
          <Ionicons name={icon} size={18} color="#f3d146" />
          <Text style={styles.infoRowLabel}>{label}</Text>
      </View>
      <Text style={styles.infoRowValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageSection: { width: width, height: 350 },
  mainImage: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 15 },
  detailsContainer: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -40, elevation: 10 },
  content: { padding: 25 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  petName: { fontSize: 32, fontWeight: '900', color: '#1384b1' },
  petBreed: { fontSize: 16, color: '#666' },
  genderBadge: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  
  shelterSection: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 5, },
  shelterImage: { width: 50, height: 50,  borderRadius: 30, backgroundColor: '#eee',},
  shelterInfo: { marginLeft: 15, justifyContent: 'center', },
  shelterName: { fontSize: 14, fontWeight: '700', color: '#1384b1', },
  shelterLocation: { fontSize: 12, color: '#999',  marginTop: 2, },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 20, width: '100%', },

  // TAB BAR STYLES
  tabBar: { flexDirection: 'row', backgroundColor: '#F0F2F5', borderRadius: 25, padding: 5, justifyContent: 'space-between' },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  activeTabItem: { backgroundColor: '#fff', elevation: 2, shadowOpacity: 0.1 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#999' },
  activeTabText: { color: '#f3d146' },

  sectionTitle: { fontSize: 19, fontWeight: 'bold', color: '#1384b1', marginBottom: 15 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 20, width: (width - 70) / 3, alignItems: 'center', borderWidth: 1, borderColor: '#F1F1F1' },
  statValue: { fontSize: 13, fontWeight: 'bold', color: '#333', marginTop: 5 },
  statLabel: { fontSize: 10, color: '#999' },
  descriptionText: { fontSize: 15, color: '#555', lineHeight: 24 },
  
  healthRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  healthTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 10, borderRadius: 12, marginRight: 10, marginBottom: 10 },
  healthTagText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: '#444' },
  issueCard: { padding: 15, backgroundColor: '#FFF9F9', borderRadius: 15, borderLeftWidth: 4, borderLeftColor: '#F44336' },
  medicalNote: { fontWeight: 'bold', color: '#F44336', marginBottom: 5 },

  infoCard: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#EEE' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  infoRowLabel: { marginLeft: 10, color: '#666', fontSize: 14 },
  infoRowValue: { fontWeight: 'bold', color: '#333', fontSize: 14 },

  footer: { position: 'absolute', bottom: 0, width: width, height: 100, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, borderTopWidth: 1, borderTopColor: '#eee', paddingBottom: 20 },
  feeLabel: { fontSize: 12, color: '#999', fontWeight: 'bold' },
  feeValue: { fontSize: 22, fontWeight: '900', color: '#1384b1' },
  adoptBtn: { backgroundColor: '#20b8f4', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 20, elevation: 5 },
  adoptBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' }
});