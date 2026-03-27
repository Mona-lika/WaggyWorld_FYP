import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ScrollView, Image, Dimensions, Platform 
} from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- 1. INTERFACE FOR TYPESCRIPT ---
interface PetForm {
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  description: string;
  vaccinated: string;
  neutered: string;
  dewormed: string;
  medicalIssues: string;
  temperament: string;
  goodWithKids: string;
  goodWithPets: string;
  activityLevel: string;
  location: string;
  adoptionFee: string;
  availableFrom: string;
  images: string[];
}

export default function AddPet() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [showGenderMenu, setShowGenderMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  // --- 2. FORM STATE ---
  const [form, setForm] = useState<PetForm>({
    name: '', species: 'Dog', breed: '', age: '', gender: 'Male', description: '',
    vaccinated: 'No', neutered: 'No', dewormed: 'No', medicalIssues: '',
    temperament: 'Friendly', goodWithKids: 'Yes', goodWithPets: 'Yes', activityLevel: 'Medium',
    location: '', adoptionFee: '', availableFrom: new Date().toLocaleDateString(),
    images: []
  });

  // DATE PICKER LOGIC
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // iOS stays open, Android closes
    if (selectedDate) {
      setDate(selectedDate);
      setForm({ ...form, availableFrom: selectedDate.toLocaleDateString() });
    }
  };

  // --- 3. IMAGE LOGIC ---
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

  // --- 4. SUBMIT LOGIC ---
  const handleSubmit = async () => {
  if (!form.name || form.images.length === 0) {
    Alert.alert("Error", "Please fill required fields and add at least one photo.");
    return;
  }

  try {
    // 1. YOUR CURRENT IP
    const API_BASE = "http://192.168.1.64:5001/api"; 

    // 2. Prepare the Image Files (Multipart Form Data)
    const formData = new FormData();
    form.images.forEach((uri, index) => {
        // This format is required for React Native to send files
        formData.append('images', {
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
            type: 'image/jpeg',
            name: `pet_photo_${index}.jpg`,
        } as any);
    });

    console.log("Step 1: Uploading images to Cloudinary...");

    // 3. Upload to your Backend -> Cloudinary
    const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // These are now permanent HTTPS links!
    const cloudinaryUrls = uploadRes.data.urls; 

    console.log("Step 2: Saving pet record to PostgreSQL...");

    // 4. Save the Pet to your database with the CLOUD links
    await axios.post(`${API_BASE}/pets/add`, { 
      ...form, 
      images: cloudinaryUrls, // Send the HTTPS links, not file://
      shelterId: user.id 
    });

    Alert.alert("Success", "Pet is now permanently live in the cloud!");
    router.replace('/shelter/dashboard' as any);

  } catch (error) {
    console.error("FULL ERROR:", error);
    Alert.alert("Error", "Failed to upload to Cloud. Check terminal.");
  }
};

  // --- 5. HELPER UI COMPONENTS ---
  const SelectionRow = ({ label, field }: { label: string, field: keyof PetForm }) => (
    <View style={styles.selectionRow}>
      <Text style={styles.selectionLabel}>{label}</Text>
      <View style={styles.btnGroup}>
        {['Yes', 'No'].map((opt) => (
          <TouchableOpacity 
            key={opt}
            onPress={() => setForm({ ...form, [field]: opt as any })}
            style={[styles.miniBtn, form[field] === opt && styles.activeMiniBtn]}
          >
            <Text style={form[field] === opt ? styles.activeText : styles.inactiveText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FACEBOOK STYLE HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Pet</Text>
        <TouchableOpacity onPress={handleSubmit}><Text style={styles.postBtnText}>Post</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        
        {/* PROFILE INFO */}
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Image source={require('../../assets/profile.png')} style={{width: '100%', height: '100%'}} resizeMode="cover" />
          </View>
          <View>
            <Text style={styles.shelterName}>{user?.name}</Text>
            <Text style={styles.publicText}>Listing for Adoption</Text>
          </View>
        </View>

        {/* BASIC INFO */}
        <TextInput placeholder="Pet Name" style={styles.mainTitleInput} onChangeText={(t) => setForm({...form, name: t})} />
        
        <Text style={styles.sectionLabel}>Species</Text>
        <View style={styles.tagContainer}>
          {['Dog', 'Cat', 'Bunny', 'Hamster'].map(s => (
            <TouchableOpacity key={s} onPress={() => setForm({...form, species: s})} style={[styles.tag, form.species === s && styles.activeTag]}>
              <Text style={form.species === s ? styles.activeText : styles.inactiveText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Gender</Text>
        <TouchableOpacity 
            style={styles.dropdownHeader} 
            onPress={() => setShowGenderMenu(!showGenderMenu)}
        >
            <Text style={[styles.dropdownValue, form.gender === 'Select Gender' && {color: '#999'}]}>
                {form.gender}
            </Text>
            <Ionicons name={showGenderMenu ? "chevron-up" : "chevron-down"} size={20} color="#20b8f4" />
        </TouchableOpacity>

        {showGenderMenu && (
            <View style={styles.dropdownList}>
                {['Male', 'Female'].map((g) => (
                    <TouchableOpacity 
                        key={g} 
                        style={styles.dropdownItem} 
                        onPress={() => {
                            setForm({...form, gender: g});
                            setShowGenderMenu(false);
                        }}
                    >
                        <Text style={styles.dropdownItemText}>{g}</Text>
                        {form.gender === g && <Ionicons name="checkmark" size={18} color="#20b8f4" />}
                    </TouchableOpacity>
                ))}
            </View>
        )}

        <View style={styles.row}>
            <TextInput placeholder="Breed" style={[styles.input, {flex: 1, marginRight: 10}]} onChangeText={(t) => setForm({...form, breed: t})} />
            <TextInput placeholder="Age" style={[styles.input, {width: 100}]} onChangeText={(t) => setForm({...form, age: t})} />
        </View>

        <Text style={styles.sectionLabel}>Description</Text>
        <TextInput 
          placeholder="Tell us about the pet's story..." 
          placeholderTextColor="#999"
          style={styles.textArea} 
          multiline 
          onChangeText={(t) => setForm({...form, description: t})} 
        />

        {/* HEALTH SECTION */}
        <Text style={styles.sectionHeader}>Health & Status</Text>
        <View style={styles.card}>
            <SelectionRow label="Vaccinated" field="vaccinated" />
            <SelectionRow label="Neutered / Spayed" field="neutered" />
            <SelectionRow label="Dewormed" field="dewormed" />
            <TextInput 
                placeholder="Medical Issues (e.g. Allergies)" 
                placeholderTextColor="#999"
                style={[styles.input, {marginTop: 10}]} 
                onChangeText={(t) => setForm({...form, medicalIssues: t})} 
            />
        </View>

        {/* BEHAVIOR SECTION */}
        <Text style={styles.sectionHeader}>Behavior & Lifestyle</Text>
        <View style={styles.card}>
           <Text style={styles.innerLabel}>Temperament</Text>
           <View style={styles.tagContainer}>
             {['Friendly', 'Calm', 'Playful', 'Aggressive'].map(t => (
               <TouchableOpacity key={t} onPress={() => setForm({...form, temperament: t})} style={[styles.tag, form.temperament === t && styles.activeTag]}>
                 <Text style={form.temperament === t ? styles.activeText : styles.inactiveText}>{t}</Text>
               </TouchableOpacity>
             ))}
           </View>
           <SelectionRow label="Good with Kids" field="goodWithKids" />
           <SelectionRow label="Good with Other Pets" field="goodWithPets" />
        </View>

        {/* LOGISTICS */}
        <Text style={styles.sectionHeader}>Logistics</Text>
        <View style={styles.card}>
           <TextInput 
                placeholder="Location (City/Area)" 
                placeholderTextColor="#999"
                style={styles.input} 
                onChangeText={(t) => setForm({...form, location: t})} 
           />
           <TextInput 
                placeholder="Adoption Fee (Rs.)" 
                placeholderTextColor="#999"
                keyboardType="numeric" 
                style={styles.input} 
                onChangeText={(t) => setForm({...form, adoptionFee: t})} 
           />
           {/* DATE PICKER BUTTON */}
           <Text style={styles.innerLabel}>Available From</Text>
           <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#20b8f4" />
                <Text style={styles.dateText}>{form.availableFrom}</Text>
           </TouchableOpacity>

           {showDatePicker && (
             <DateTimePicker
               value={date}
               mode="date"
               display="default"
               onChange={onDateChange}
             />
           )}
        </View>

        {/* MULTI PHOTO UPLOAD */}
        <Text style={styles.sectionHeader}>Photos ({form.images.length}/5)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 30 }}>
            <TouchableOpacity style={styles.addPhotoCard} onPress={pickImages}>
               <Ionicons name="camera" size={32} color="#20b8f4" />
               <Text style={{color: '#20b8f4', fontSize: 12, fontWeight: 'bold'}}>Add</Text>
            </TouchableOpacity>

            {form.images.map((uri, index) => (
                <View key={index} style={styles.photoWrapper}>
                    <Image source={{ uri }} style={styles.thumbnail} />
                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(uri)}>
                        <Ionicons name="close-circle" size={22} color="red" />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A237E' },
  postBtnText: { color: '#20b8f4', fontWeight: 'bold', fontSize: 17 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f3d146', overflow: 'hidden' },
  shelterName: { fontSize: 17, fontWeight: 'bold', marginLeft: 12 },
  publicText: { fontSize: 13, color: '#666', marginLeft: 12 },
  mainTitleInput: { fontSize: 26, fontWeight: 'bold', color: '#1A237E', marginBottom: 15 },
  sectionLabel: { fontSize: 15, fontWeight: 'bold', color: '#1A237E', marginBottom: 10 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1A237E', marginTop: 25, marginBottom: 10 },
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row' },
  textArea: { borderWidth: 1, borderColor: '#20b8f4', borderRadius: 15, padding: 15, height: 100, textAlignVertical: 'top', fontSize: 16 },
  card: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 20 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: '#20b8f4', marginRight: 8, marginBottom: 8 },
  activeTag: { backgroundColor: '#20b8f4' },
  activeText: { color: '#fff', fontWeight: 'bold' },
  inactiveText: { color: '#20b8f4' },
  selectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  selectionLabel: { fontSize: 15, color: '#444' },
  btnGroup: { flexDirection: 'row' },
  miniBtn: { paddingVertical: 5, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', marginLeft: 10 },
  activeMiniBtn: { backgroundColor: '#20b8f4', borderColor: '#20b8f4' },
  innerLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  datePickerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  dateText: { marginLeft: 10, fontSize: 16, color: '#333' },
  dropdownHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 5 
  },
  dropdownValue: { fontSize: 16, color: '#333' },
  dropdownList: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee', elevation: 5, shadowOpacity: 0.1, marginBottom: 15 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 16, color: '#444' },
  // Photo Styles
  addPhotoCard: { width: 100, height: 100, borderRadius: 15, borderStyle: 'dashed', borderWidth: 2, borderColor: '#20b8f4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  photoWrapper: { width: 100, height: 100, marginRight: 12 },
  thumbnail: { width: '100%', height: '100%', borderRadius: 15 },
  removeBtn: { position: 'absolute', top: -5, right: -5, backgroundColor: '#fff', borderRadius: 12 }
});