import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ScrollView, Image, Platform 
} from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateDonation() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Dropdown States
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showSuppliesMenu, setShowSuppliesMenu] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());

  const [form, setForm] = useState({
    title: '',
    description: '',
    donationType: 'Select Type', // Fund or Supplies
    targetAmount: '',
    suppliesCategory: 'Select Category',
    startDate: new Date().toLocaleDateString(),
    endDate: new Date().toLocaleDateString(),
    images: [] as string[]
  });

  // --- IMAGE LOGIC FUNCTIONS ---
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.7,
    });
    if (!result.canceled) {
      const newUris = result.assets.map(asset => asset.uri);
      setForm({ ...form, images: [...form.images, ...newUris] });
    }
  };

  const removeImage = (uri: string) => {
    setForm({ ...form, images: form.images.filter(img => img !== uri) });
  };

  // --- DATE PICKER LOGIC ---
const onDateChange = (field: 'startDate' | 'endDate', selectedDate?: Date) => {
  setShowStartPicker(false);
  setShowEndPicker(false);
  
  if (selectedDate) {
    // We use 'selectedDate' here because that is the name in the ( ) above
    const formattedDate = selectedDate.toISOString().split('T')[0]; 
    setForm({ ...form, [field]: formattedDate });
  }
};
  
   // --- SUBMIT LOGIC (CLOUDINARY + POSTGRES) ---
  const handlePost = async () => {
    if (!form.title || !form.description || form.donationType === 'Select Type' || form.images.length === 0) {
      Alert.alert("Error", "Please fill in the title, description, and type.");
      return;
    }
    try {
      const API_BASE = "http://192.168.1.64:5001/api"; 

      // STEP A: Upload Images to Cloudinary
      const formData = new FormData();
      form.images.forEach((uri, index) => {
        formData.append('images', {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          type: 'image/jpeg',
          name: `donation_${index}.jpg`,
        } as any);
      });

      console.log("Uploading donation images to Cloudinary...");
      const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const cloudinaryUrls = uploadRes.data.urls;

      // STEP B: Save to PostgreSQL
      await axios.post(`${API_BASE}/donations/add`, {
        ...form,
        images: cloudinaryUrls, // Send cloud URLs
        shelterId: user.id
      });

      Alert.alert("Success", "Fundraising campaign published!");
      router.replace('/shelter/dashboard' as any);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to publish post.");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Create Donation Post</Text>
        <TouchableOpacity onPress={handlePost}><Text style={styles.postBtnText}>Post</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        {/* PROFILE */}
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Image source={require('../../assets/profile.png')} style={{width: '100%', height: '100%'}} />
          </View>
          <View>
            <Text style={styles.shelterName}>{user?.name}</Text>
            <View style={styles.publicBadge}><Ionicons name="earth" size={12} color="#666" /><Text style={styles.publicText}>Public</Text></View>
          </View>
        </View>

        <TextInput placeholder="Title (e.g. Help us with Winter Food)" style={styles.titleInput} onChangeText={(t) => setForm({...form, title: t})} />

        {/* DESCRIPTION WITH OUTLINE */}
        <Text style={styles.sectionLabel}>Description</Text>
        <View style={styles.descriptionOutline}>
            <TextInput 
              placeholder="What's on your mind? Explain the need..." 
              style={styles.descriptionInput} 
              multiline 
              onChangeText={(t) => setForm({...form, description: t})}
            />
        </View>

        {/* DONATION TYPE DROPDOWN */}
        <Text style={styles.sectionLabel}>Donation Type</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowTypeMenu(!showTypeMenu)}>
            <Text style={{color: form.donationType === 'Select Type' ? '#999' : '#333'}}>{form.donationType}</Text>
            <Ionicons name="chevron-down" size={18} color="#20b8f4" />
        </TouchableOpacity>

        {showTypeMenu && (
            <View style={styles.dropdownContent}>
                {['Fund', 'Supplies'].map(type => (
                    <TouchableOpacity key={type} style={styles.dropItem} onPress={() => {setForm({...form, donationType: type}); setShowTypeMenu(false)}}>
                        <Text>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )}

        {/* CONDITIONAL SECTIONS */}
        {form.donationType === 'Fund' && (
            <View style={styles.subCard}>
                <Text style={styles.innerLabel}>Target Amount (Rs.)</Text>
                <TextInput placeholder="e.g. 50000" keyboardType="numeric" style={styles.input} onChangeText={(t) => setForm({...form, targetAmount: t})} />
                <Text style={{fontSize: 12, color: '#666'}}>Donators can also choose to pay any amount.</Text>
            </View>
        )}

        {form.donationType === 'Supplies' && (
            <>
                <Text style={styles.sectionLabel}>Supplies Category</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowSuppliesMenu(!showSuppliesMenu)}>
                    <Text style={{color: form.suppliesCategory === 'Select Category' ? '#999' : '#333'}}>{form.suppliesCategory}</Text>
                    <Ionicons name="chevron-down" size={18} color="#20b8f4" />
                </TouchableOpacity>
                {showSuppliesMenu && (
                    <View style={styles.dropdownContent}>
                        {['Medical Emergency', 'Food & Supplies', 'Vaccination', 'Infrastructure', 'General Support'].map(cat => (
                            <TouchableOpacity key={cat} style={styles.dropItem} onPress={() => {setForm({...form, suppliesCategory: cat}); setShowSuppliesMenu(false)}}>
                                <Text>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </>
        )}

        {/* TIMELINE */}
        <Text style={styles.sectionLabel}>Timeline</Text>
        <View style={styles.row}>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowStartPicker(true)}>
                <Text style={styles.dateLabel}>Start: {form.startDate}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowEndPicker(true)}>
                <Text style={styles.dateLabel}>End: {form.endDate}</Text>
            </TouchableOpacity>
        </View>

        {showStartPicker && <DateTimePicker value={tempStartDate} onChange={(e, d) => {setShowStartPicker(false); if(d) setForm({...form, startDate: d.toLocaleDateString()})}} />}
        {showEndPicker && <DateTimePicker value={tempEndDate} onChange={(e, d) => {setShowEndPicker(false); if(d) setForm({...form, endDate: d.toLocaleDateString()})}} />}

        {/* MULTI IMAGE UPLOAD */}
        <Text style={styles.sectionLabel}>Photos ({form.images.length}/5)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            <TouchableOpacity style={styles.addCard} onPress={pickImages}>
               <Ionicons name="camera" size={32} color="#20b8f4" />
               <Text style={{fontSize: 10, color: '#20b8f4', fontWeight: 'bold'}}>ADD</Text>
            </TouchableOpacity>
            {form.images.map((uri, index) => (
                <View key={index} style={styles.imgWrapper}>
                    <Image source={{ uri }} style={styles.thumb} />
                    <TouchableOpacity style={styles.remove} onPress={() => removeImage(uri)}><Ionicons name="close-circle" size={20} color="red" /></TouchableOpacity>
                </View>
            ))}
        </ScrollView>

        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A237E' },
  postBtnText: { color: '#20b8f4', fontWeight: 'bold', fontSize: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#f3d146', overflow: 'hidden' },
  shelterName: { fontSize: 16, fontWeight: 'bold', marginLeft: 12 },
  publicBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginLeft: 12, marginTop: 2 },
  publicText: { fontSize: 11, color: '#666', marginLeft: 4 },
  titleInput: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  sectionLabel: { fontSize: 15, fontWeight: 'bold', color: '#1A237E', marginTop: 15, marginBottom: 8 },
  descriptionOutline: { borderWidth: 1, borderColor: '#20b8f4', borderRadius: 15, padding: 12 },
  descriptionInput: { fontSize: 16, color: '#444', minHeight: 120, textAlignVertical: 'top' },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#f9f9f9', borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  dropdownContent: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginTop: 5, elevation: 3 },
  dropItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  subCard: { backgroundColor: '#f0faff', padding: 15, borderRadius: 15, marginTop: 10 },
  innerLabel: { fontSize: 13, fontWeight: 'bold', color: '#1384b1', marginBottom: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  dateBtn: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 10, width: '48%', borderWidth: 1, borderColor: '#eee' },
  dateLabel: { fontSize: 13, color: '#333' },
  addCard: { width: 100, height: 100, borderRadius: 15, borderStyle: 'dashed', borderWidth: 2, borderColor: '#20b8f4', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  imgWrapper: { width: 100, height: 100, marginRight: 10 },
  thumb: { width: '100%', height: '100%', borderRadius: 15 },
  remove: { position: 'absolute', top: -5, right: -5, backgroundColor: '#fff', borderRadius: 10 }
});