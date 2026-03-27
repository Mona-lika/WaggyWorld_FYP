import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../../src/context/AuthContext';
import { homeStyles } from '../../src/styles/home.styles';
import { useRouter } from 'expo-router';

// --- TYPESCRIPT INTERFACES ---
interface CategoryProps {
  imageSource: any; // Image source
  label: string;
}

interface PetData {
  pet: {
    id: number;
    name: string;
    gender: string;
    age: string;
    breed: string;
    imageUrl: string[] | null;
    image_url: string[] | null; // Support both naming conventions
    location: string;
  };
  shelterName: string;
}

interface DonationProps {
  id?: number;       
  title: string;
  shelterName: string;
  date: string;
  bgImage: any;
createdAt?: string;
}

export default function UserDashboard() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [petsData, setPetsData] = useState<PetData[]>([]);
  const [donationsData, setDonationsData] = useState<DonationProps[]>([]); 
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userApps, setUserApps] = useState<any[]>([]);

  // 1. THE FETCH FUNCTION
  const fetchData = async () => {
    try {
      const API_URL = "http://192.168.1.64:5001/api";

      const [petsRes, donsRes, appRes] = await Promise.all([
        axios.get(`${API_URL}/pets/all`),
        axios.get(`${API_URL}/donations/all`),
        axios.get(`${API_URL}/applications/user/${user.id}`)
      ]);

      setPetsData(petsRes.data);
      setDonationsData(donsRes.data);
      setMyApplications(appRes.data);
      setUserApps(appRes.data);
      console.log("LOG: Data successfully fetched from PostgreSQL");
    } catch (error) {
      console.error("LOG: Fetch Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. RUN ON START
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={homeStyles.container}>
      {/* HEADER */}
      <View style={homeStyles.header}>
        <Text style={homeStyles.logoText}>WAGGYWORLD</Text>
        <TouchableOpacity style={homeStyles.profileCircle}>
           <Ionicons name="person" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={homeStyles.scrollContent}>
        
        {/* SEARCH */}
        <View style={homeStyles.section}>
          <Text style={homeStyles.sectionTitle}>Search pets</Text>
          <View style={homeStyles.searchBar}>
            <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
            <TextInput placeholder="Search by breed..." style={homeStyles.searchInput} />
          </View>
        </View>

        {/* CATEGORIES */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={homeStyles.categoryScroll}>
          <CategoryItem 
            imageSource={require('../../assets/dog_cate.png')} 
            label="Dogs" 
          />
          <CategoryItem 
            imageSource={require('../../assets/cat_cate.png')} 
            label="Cats" 
          />
          <CategoryItem 
            imageSource={require('../../assets/rabbit_cate.png')} 
            label="Bunnies" 
          />
          <CategoryItem 
            imageSource={require('../../assets/hamster_cate.png')} 
            label="Hamsters" 
          />
        </ScrollView>

        {/* 2. BROWSE THE PETS SECTION */}
        <View style={homeStyles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' , marginBottom: -10}}>
             <Text style={homeStyles.sectionTitle}>Browse the pets</Text>
             <TouchableOpacity><Text style={{ color: '#1384b1', fontWeight: 'bold' }}>See All</Text></TouchableOpacity>
          </View>
          
          {isLoading ? (
            <ActivityIndicator color="#20b8f4" />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {petsData.length > 0 ? (
                petsData.map((item) => (
                <BrowsePetCard 
                   key={item.pet.id} 
                   pet={item.pet} 
                   shelterName={item.shelterName} 
                />
              ))
             ) : (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#999' }}>No pets found in database. Please check your backend.</Text>
        </View>
      )}
            </ScrollView>
          )}
        </View>

        {/* PROMO BANNER */}
        <View style={homeStyles.banner}>
           <Text style={homeStyles.bannerText}>Ready to find a new friend?</Text>
           <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop' }} 
              style={homeStyles.bannerImage} 
           />
        </View>

        {/* DONATIONS */}
        <View style={homeStyles.section}>
          <View style={homeStyles.sectionHeaderRow}>
             <Text style={homeStyles.sectionTitle}>Donations</Text>
             <TouchableOpacity><Text style={homeStyles.seeAllText}>See All</Text></TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {donationsData.length > 0 ? (
                // Only show the first 3 posts
                donationsData.slice(0, 3).map((don: any) => (
                    <DonationCard 
                        key={don.id}
                        donation={don}
                    />
                ))
            ) : (
                <Text style={{ color: '#999', padding: 10 }}>No active campaigns.</Text>
            )}
          </ScrollView>
        </View>

      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={homeStyles.bottomNav}>
        <TouchableOpacity><Ionicons name="home" size={26} color="#20b8f4" /></TouchableOpacity>
            
                <TouchableOpacity 
                  style={{ position: 'relative' }} 
                  onPress={() => router.push('/user/applicationRequest' as any)}
                >
                <Ionicons name="document-text-outline" size={26} color="#999" />
                
                {/* RED DOT LOGIC FOR USER: Show dot if any application is 'approved' or 'rejected' */}
                {userApps.filter(app => app.status !== 'pending').length > 0 && (
                    <View style={homeStyles.redDot} />
                )}
            </TouchableOpacity>
        <Ionicons name="notifications-outline" size={28} color="#999" />
        <TouchableOpacity onPress={logout}>
           <Ionicons name="log-out-outline" size={28} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- FIXED SUB-COMPONENTS WITH TYPES ---

const CategoryItem = ({ imageSource, label }: { imageSource: any, label: string }) => (
  <View style={homeStyles.catContainer}>
    <View style={homeStyles.catBox}>
      <Image 
        source={imageSource} 
        style={{ width: 45, height: 45 }} 
        resizeMode="contain" 
      />
    </View>
    <Text style={homeStyles.catLabel}>{label}</Text>
  </View>
);

const BrowsePetCard = ({ pet, shelterName }: PetData) => {
  const router = useRouter();
  const photos = pet.imageUrl || (pet as any).image_url;
  const hasImage = photos && Array.isArray(photos) && photos.length > 0 && photos[0] !== null;
  const petImage = hasImage ? { uri: photos[0] } : require('../../assets/WaggyWorld.png');

  return (
    <TouchableOpacity style={homeStyles.browseCard}
    onPress={() => router.push(`/pet/${pet.id}` as any)}>
      {/* Pet Image */}
      <Image source={petImage} style={homeStyles.browseImage} resizeMode="cover" key={hasImage ? photos[0] : 'default'}/>

      {/* Name & Gender Icon */}
      <View style={homeStyles.petNameRow}>
        <Text style={homeStyles.petNameText}>{pet.name}</Text>
      </View>

      {/* Breed & Age */}
      <Text style={homeStyles.petInfoSubtitle}>{pet.breed} | {pet.gender}</Text>

      {/* Shelter Info */}
      <View style={homeStyles.shelterMiniRow}>
        <View style={[homeStyles.profileCircle, { width: 24, height: 24, borderRadius: 12 }]}>
            <Image source={require('../../assets/profile.png')} style={{ width: '100%', height: '100%' }} />
        </View>
        <Text style={homeStyles.shelterMiniName}>{shelterName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const DonationCard = ({ donation }: { donation: any }) => {
  const router = useRouter(); 
    // Extract first image from Cloudinary array or use fallback
    const photos = donation.imageUrl || donation.imageUrls || donation.image_urls;
    const donImage = (photos && photos.length > 0) ? { uri: photos[0] } : require('../../assets/food-don.jpeg');

    return (
        <View style={homeStyles.donationFeedCard}>
            {/* 1. Header (Shelter Info) */}
            <View style={homeStyles.donCardHeader}>
                <View style={[homeStyles.profileCircle, { width: 35, height: 35 }]}>
                    <Image source={require('../../assets/profile.png')} style={{width: '100%', height: '100%'}} />
                </View>
                <View style={{ marginLeft: 10 }}>
                    <Text style={homeStyles.donShelterName}>{donation.shelterName || "Partner Shelter"}</Text>
                    <Text style={homeStyles.donDate}>{new Date(donation.createdAt).toLocaleDateString()}</Text>
                </View>
            </View>

            {/* 2. Description Snippet */}
            <Text style={homeStyles.donDescSnippet} numberOfLines={2}>
                {donation.description}
            </Text>

            {/* 3. Main Image */}
            <Image source={donImage} style={homeStyles.donCardImage} resizeMode="cover" />

            {/* 2. THE BUTTON: Change the onPress logic here */}
            <TouchableOpacity 
                style={homeStyles.donateBtn} 
                onPress={() => router.push(`/donation/${donation.id}` as any)} // <--- NAVIGATION ADDED
            >
                <Text style={homeStyles.donateBtnText}>Donate Now</Text>
            </TouchableOpacity>
        </View>
    );
};