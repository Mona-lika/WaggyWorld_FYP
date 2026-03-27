import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';
import { shelterStyles } from '../../src/styles/shelter.styles';

interface PetItemProps {
  id: number;
  name: string;
  breed: string;
  gender: string;
  status: string;
  image: any;
}

export default function ShelterDashboard() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [myPets, setMyPets] = useState<any[]>([]);
  const [allDonations, setAllDonations] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const IP = "http://192.168.1.64:5001/api"; // UPDATE YOUR IP
      const petRes = await axios.get(`${IP}/pets/shelter/${user.id}`);
      const donRes = await axios.get(`${IP}/donations/all`);
      const appRes = await axios.get(`${IP}/applications/shelter/${user.id}`)
      setMyPets(petRes.data);
      setAllDonations(donRes.data);
      setMyApplications(appRes.data);
    } catch (error: any) {
      console.error("DASHBOARD FETCH ERROR:", error.message);
      console.log("FAILED URL:", error.config?.url); 
      
      if (error.response?.status === 404) {
          console.log("ERROR: Route not found on server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={shelterStyles.container}>
      
      {/* 1. HEADER: LOGO & PROFILE */}
      <View style={shelterStyles.header}>
        <Image source={require('../../assets/WaggyWorldLogo.png')} style={shelterStyles.headerLogo} resizeMode="contain" />
        <TouchableOpacity style={shelterStyles.profileCircle}>
            <Image source={require('../../assets/profile.png')} style={{width: '100%', height: '100%'}} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={shelterStyles.scrollContent}
      >
        
        {/* 2. THE WHITE CONTENT CONTAINER */}
        <View style={shelterStyles.contentContainer}>
          
          <Text style={styles.welcomeTitle}>Hello, {user?.name}!</Text>
          <Text style={styles.welcomeSub}>Manage your shelter activity below.</Text>

          {/* QUICK STATS */}
          <View style={shelterStyles.statsRow}>
              {/* Pet Card (Green) */}
              <View style={shelterStyles.statCardPet}>
                  <FontAwesome5 name="paw" size={20} color="#46ab4d" />
                  <View style={shelterStyles.statContent}>
                      <Text style={shelterStyles.statNumberPet}>{myPets.length}</Text>
                      <Text style={shelterStyles.statLabel}>Active Pets</Text>
                  </View>
              </View>

              {/* Application Card (Blue) */}
              <View style={shelterStyles.statCardApp}>
                  <Ionicons name="document-text" size={22} color="#1384b1" />
                  <View style={{marginLeft: 10}}>
                      {/* NOW SHOWS REAL COUNT */}
                      <Text style={shelterStyles.statNumberApp}>{myApplications.length}</Text>
                      <Text style={shelterStyles.statLabel}>Applications</Text>
                  </View>
              </View>
          </View>

          {/* TOOLS */}
          <TouchableOpacity 
              style={shelterStyles.mainActionBtn} 
              onPress={() => router.push('/shelter/addPet' as any)}
          >
              <Ionicons name="add-circle" size={30} color="#fff" />
              <Text style={shelterStyles.actionText}>Add New Pet</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[shelterStyles.mainActionBtn, {backgroundColor: '#1A237E'}]}
            onPress={() => router.push('/shelter/createDonation' as any)}
          >
            <Ionicons name="megaphone" size={28} color="#fff" />
            <Text style={shelterStyles.actionText}>Create Donation Post</Text>
          </TouchableOpacity>

          {/* PET LISTINGS */}
          <View style={shelterStyles.sectionHeaderRow}>
              <Text style={shelterStyles.sectionTitle}>Your Listings</Text>
              <TouchableOpacity><Text style={shelterStyles.seeAllText}>See All</Text></TouchableOpacity>
          </View>          
          {isLoading ? (
            <ActivityIndicator size="large" color="#20b8f4" />
          ) : myPets.length > 0 ? (
              myPets.map((pet) => {
                const photos = pet.imageUrl || pet.image_url;
                const hasPhoto = photos && Array.isArray(photos) && photos.length > 0;
                const petImage = (photos && photos.length > 0) 
                  ? { uri: photos[0] } 
                  : require('../../assets/WaggyWorld.png');
                
                return (
                  <PetListingItem 
                    key={pet.id}
                    id={pet.id}
                    name={pet.name} 
                    breed={pet.breed} 
                    gender={pet.species} 
                    status={pet.status} 
                    image={petImage} 
                  />
                );
              })
          ) : (
              <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No pets listed yet.</Text>
              </View>
          )}
          {/* 5. DONATION CAMPAIGNS (Limit to 1) */}
          <View style={shelterStyles.sectionHeaderRow}>
              <Text style={shelterStyles.sectionTitle}>Your Donation Campaigns</Text>
              <TouchableOpacity><Text style={shelterStyles.seeAllText}>See All</Text></TouchableOpacity>
          </View>

          {allDonations.slice(0, 1).map((don) => (
            <DonationPostItem key={don.id} donation={don} shelterName={user?.name} />
          ))}

        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={shelterStyles.bottomNav}>
        <TouchableOpacity><Ionicons name="home" size={26} color="#20b8f4" /></TouchableOpacity>
    
        <TouchableOpacity 
          style={{ position: 'relative' }} 
          onPress={() => router.push('/shelter/request' as any)}
        >
        <Ionicons name="document-text-outline" size={26} color="#999" />
        
        {/* THE RED DOT: Only show if there are applications */}
        {myApplications.filter(app => app.status === 'pending').length > 0 && (
            <View style={styles.redDot} />
        )}
    </TouchableOpacity>
        <TouchableOpacity><Ionicons name="notifications-outline" size={26} color="#999" /></TouchableOpacity>
        <TouchableOpacity onPress={logout}>
           <Ionicons name="log-out-outline" size={26} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PetListingItem: React.FC<PetItemProps> = ({ id, name, breed, gender, status, image }) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
            style={shelterStyles.petItem}
            // Now we use the 'id' passed from the parent to navigate
            onPress={() => router.push(`/pet/${id}` as any)}
        >
            <Image source={image} style={shelterStyles.petImage} resizeMode="cover" />        
            
            <View style={shelterStyles.petInfo}>
                <Text style={shelterStyles.petName}>{name}</Text>
                <Text style={shelterStyles.petBreed}>{breed}</Text>
                <Text style={shelterStyles.petCategory}>{gender}</Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
                <Text style={shelterStyles.petStatus}>{status}</Text>
                <Ionicons name="chevron-forward" size={18} color="#ddd" style={{marginTop: 5}} />
            </View>
        </TouchableOpacity>
);
};

const DonationPostItem = ({ donation, shelterName }: any) => {
    const photos = donation.imageUrl || donation.imageUrls || donation.image_urls;
    const donImage = (photos && photos.length > 0) ? { uri: photos[0] } : null;

    return (
        <View style={shelterStyles.donationPost}>
            <View style={shelterStyles.donHeader}>
                <View style={[shelterStyles.profileCircle, {width: 35, height: 35}]}>
                    <Image source={require('../../assets/profile.png')} style={{width: '100%', height: '100%'}} />
                </View>
                <View style={{marginLeft: 10}}>
                    <Text style={shelterStyles.donShelterName}>{shelterName}</Text>
                    <Text style={shelterStyles.donTime}>{new Date(donation.createdAt).toLocaleDateString()}</Text>
                </View>
            </View>
            <Text style={shelterStyles.donDesc}>{donation.description}</Text>
            {donImage && <Image source={donImage} style={shelterStyles.donImage} resizeMode="cover" />}
        </View>
    );
};

const styles = StyleSheet.create({
    appName: { fontSize: 24, fontWeight: 'bold', color: '#f8fbfc', textAlign: "left" },
    welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#1384b1' },
    welcomeSub: { color: '#666', marginBottom: 25 },
    emptyContainer: { alignItems: 'center', marginTop: 20 },
    emptyText: { color: '#999' },
    donationCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#f0f0f0', elevation: 2 },
    redDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#fff'
    }
});