import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export default function AdoptionForm() {
  const { petId, shelterId, petName } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phoneNumber: '',
    email: user?.email || '',
    address: '',
    homeType: 'House',
    isOwner: 'Own',
    landlordPermission: 'N/A',
    hasYard: 'Yes',
    pastExperience: 'No',
    hasCurrentPets: 'No',
    currentPetsStatus: '',
    aloneHours: '',
    primaryCaretaker: '',
    agreedToTerms: false
  });

  const handleSubmit = async () => {
    if (!form.phoneNumber || !form.address || !form.agreedToTerms) {
      Alert.alert("Error", "Please fill in all contact details and agree to the terms.");
      return;
    }

    try {
      const API_URL = "http://192.168.1.64:5001/api/applications/submit";
      const payload = {
        ...form,
        petId: Number(petId),
        shelterId: Number(shelterId),
        adopterId: user.id
      };

      await axios.post(API_URL, payload);
      Alert.alert("Success!", "Application submitted for review.");
      router.replace('/user/dashboard' as any);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Submission failed. Please try again.");
    }
  };

  const Selector = ({ label, field, options }: any) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.smallLabel}>{label}</Text>
      <View style={styles.row}>
        {options.map((opt: string) => (
          <TouchableOpacity 
            key={opt} 
            onPress={() => setForm({...form, [field]: opt})}
            style={[styles.choiceBtn, form[field as keyof typeof form] === opt && styles.activeBtn]}
          >
            <Text style={[styles.choiceText, form[field as keyof typeof form] === opt && styles.whiteText]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Adoption Application</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 25 }} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.mainTitle}>Applying for: {petName}</Text>

          {/* PERSONAL INFO - Added placeholder colors and text color */}
          <Text style={styles.sectionHeader}><Ionicons name="person" size={18} /> Personal Information</Text>
          <TextInput 
            placeholder="Full Name" 
            placeholderTextColor="#757575" 
            style={styles.input} 
            defaultValue={form.fullName} 
            onChangeText={(t) => setForm({...form, fullName: t})} 
          />
          <TextInput 
            placeholder="Phone Number" 
            placeholderTextColor="#757575" 
            keyboardType="phone-pad" 
            style={styles.input} 
            onChangeText={(t) => setForm({...form, phoneNumber: t})} 
          />
          <TextInput 
            placeholder="Email" 
            placeholderTextColor="#757575" 
            style={styles.input} 
            defaultValue={user?.email} 
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(t) => setForm({...form, email: t})}
          />
          <TextInput 
            placeholder="Full Address (e.g. Ward No, City)" 
            placeholderTextColor="#757575" 
            style={styles.input} 
            multiline 
            onChangeText={(t) => setForm({...form, address: t})} 
          />

          {/* LIVING SITUATION */}
          <Text style={styles.sectionHeader}><Ionicons name="home" size={18} /> Living Situation</Text>
          <Selector label="Type of Home" field="homeType" options={['House', 'Apartment']} />
          <Selector label="Ownership" field="isOwner" options={['Own', 'Rent']} />
          <Selector label="Do you have a yard?" field="hasYard" options={['Yes', 'No']} />

          {/* PET EXPERIENCE */}
          <Text style={styles.sectionHeader}><Ionicons name="paw" size={18} /> Pet Experience</Text>
          <Selector label="Have you owned pets before?" field="pastExperience" options={['Yes', 'No']} />
          <Selector label="Do you currently have pets?" field="hasCurrentPets" options={['Yes', 'No']} />

          {/* AVAILABILITY - Fixed visibility */}
          <Text style={styles.sectionHeader}><Ionicons name="time" size={18} /> Availability</Text>
          <TextInput 
            placeholder="How many hours will the pet be alone?" 
            placeholderTextColor="#757575" 
            style={styles.input} 
            onChangeText={(t) => setForm({...form, aloneHours: t})} 
          />
          <TextInput 
            placeholder="Who will be the primary caretaker?" 
            placeholderTextColor="#757575" 
            style={styles.input} 
            onChangeText={(t) => setForm({...form, primaryCaretaker: t})} 
          />

          <View style={styles.agreementRow}>
            <Checkbox value={form.agreedToTerms} onValueChange={(v) => setForm({...form, agreedToTerms: v})} color={form.agreedToTerms ? '#20b8f4' : undefined} />
            <Text style={styles.agreementText}>I agree to provide proper care and medical attention.</Text>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit Application</Text>
          </TouchableOpacity>

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A237E' },
  mainTitle: { fontSize: 22, fontWeight: '900', color: '#1384b1', marginBottom: 15 },
  sectionHeader: { fontSize: 17, fontWeight: 'bold', color: '#1A237E', marginTop: 25, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#f3d146', paddingLeft: 10 },
  // ADDED 'color' here so your typing is visible
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee', color: '#333', fontSize: 16 },
  selectorContainer: { marginBottom: 15 },
  smallLabel: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
  row: { flexDirection: 'row' },
  choiceBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 12, alignItems: 'center', marginRight: 10, backgroundColor: '#fff' },
  activeBtn: { backgroundColor: '#20b8f4', borderColor: '#20b8f4' },
  choiceText: { color: '#666', fontWeight: 'bold' },
  whiteText: { color: '#fff' },
  agreementRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  agreementText: { marginLeft: 12, color: '#444', fontSize: 14 },
  submitBtn: { backgroundColor: '#20b8f4', padding: 20, borderRadius: 15, marginTop: 40, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});