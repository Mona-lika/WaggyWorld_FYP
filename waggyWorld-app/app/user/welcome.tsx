import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomePage() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  // 1. ADD 'path' here as a parameter
  const handleRoleSelection = async (chosenRole: string) => {
    try {
      const API_URL = "http://192.168.1.64:5001/api/auth";

      // 2. Match the backend (Send userId in the BODY)
       await axios.put(`${API_URL}/select-role`, { 
        userId: user.id,
        role: chosenRole
      });
      
      // 3. Update the user object locally
      const updatedUser = { ...user, role: chosenRole, isNew: false };
      setUser(updatedUser);

      // 4. Save the updated status to the phone memory
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      // 5. Navigate to the selected path
      // 5. REDIRECT based on the choice
      if (chosenRole === 'shelter') {
        router.replace('/shelter/dashboard'); // Path to app/(shelter)/dashboard.tsx
      } else {
        router.replace('/user/dashboard');    // Path to app/(user)/dashboard.tsx
      }
      
    } catch (e) {
      console.error("Onboarding Error:", e);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 1. LOGO SECTION */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/WaggyWorld.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textSection}>
        <Text style={styles.title}>Welcome to WaggyWorld!</Text>
        <Text style={styles.subtitle}>Tell us, how will you use the app today?</Text>
      </View>

      <View style={styles.menu}>
         {/* OPTION 1: ADOPTER */}
         <TouchableOpacity style={styles.card} onPress={() => handleRoleSelection('user')}>
            <View style={styles.iconCircle}>
                <Ionicons name="heart" size={35} color="#20b8f4" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>I want to Adopt</Text>
                <Text style={styles.cardSub}>Find a friend and track their health.</Text>
            </View>
         </TouchableOpacity>
         
         {/* OPTION 2: SHELTER */}
         <TouchableOpacity style={styles.card} onPress={() => handleRoleSelection('shelter')}>
            <View style={styles.iconCircle}>
                <Ionicons name="business" size={35} color="#20b8f4" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>I am a Shelter</Text>
                <Text style={styles.cardSub}>List pets and manage adoptions.</Text>
            </View>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fcefba', // Your Light Yellow Background
    padding: 25, 
    justifyContent: 'flex-start', 
    alignItems: 'center' 
  },
  logoContainer: {
    marginTop: 100,
    marginBottom: -80,
    alignItems: 'center',
  },
  logo: {
    width: 280,
    height: 280,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#1384b1', // Your Light Blue color
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#555', 
    textAlign: 'center', 
    marginTop: 5,
    //paddingHorizontal: 10
  },
  menu: { 
    width: '100%' 
  },
  card: { 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 25, 
    marginBottom: 20, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  iconCircle: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: '#f3d146', // Your main yellow for the circle
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  cardTitle: { 
    fontSize: 19, 
    fontWeight: 'bold', 
    color: '#1A237E' 
  },
  cardSub: { 
    fontSize: 13, 
    color: '#666',
    marginTop: 2 
  }
});