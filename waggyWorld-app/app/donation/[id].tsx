import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Alert, Modal, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../src/context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

export default function DonationDetails() {
  const { id } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // --- MODAL & DATE STATES ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        // REPLACE with current IP address
        const res = await axios.get(`http://192.168.1.64:5001/api/donations/${id}`);
        setData(res.data);
      } catch (e) {
        console.error("Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [id]);

  // --- BOOKING LOGIC ---
  const handleScheduleBooking = async () => {
    try {
      const API_URL = "http://192.168.1.64:5001/api/donations/book-supply";
      
      await axios.post(API_URL, {
        donationId: id,
        userId: user.id,
        dropoffDate: selectedDate.toLocaleDateString()
      });

      setModalVisible(false);
      Alert.alert("Successfully Booked!", "The shelter has been notified. Please bring your supplies on the selected date.");
      router.replace('/user/dashboard' as any);
    } catch (error) {
      Alert.alert("Error", "Could not schedule booking. Please try again.");
    }
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#20b8f4" /></View>;
  if (!data) return <View style={styles.loader}><Text>Campaign not found</Text></View>;

  const { donation, shelterName } = data;

  // --- REAL-TIME LOGIC: PROGRESS & DEADLINE ---
  
  // Calculate Progress (Collected vs Target)
  const target = parseFloat(donation.targetAmount) || 0;
  // If your DB doesn't have collectedAmount yet, it defaults to 0
  const collected = parseFloat(donation.collectedAmount) || 0;
  const progressPercent = target > 0 ? Math.min(Math.round((collected / target) * 100), 100) : 0;

  // 1. DATE PARSING
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set today to start of day for fair comparison

  // This helper function handles different date formats (e.g. DD/MM/YYYY or YYYY-MM-DD)
  const parseDatabaseDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d; // If standard JS works, use it
    
    // Manual fallback for DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date(); // Final fallback
  };

  const deadlineDate = parseDatabaseDate(donation.endDate);
  deadlineDate.setHours(23, 59, 59, 999); // Set to end of the deadline day

  const isExpired = today > deadlineDate;

  // --- DEBUG LOGS (Check your terminal for these!) ---
  console.log("Current Date:", today.toLocaleDateString());
  console.log("Deadline Date:", deadlineDate.toLocaleDateString());
  console.log("Is Expired?", isExpired);


  // 3. Image Logic
  const photos = donation.imageUrls || [];
  const mainImage = photos.length > 0 ? { uri: photos[0] } : require('../../assets/food-don.jpeg');

  return (
    <View style={styles.container}>
      {/* 1. IMAGE HEADER */}
      <View style={styles.imageSection}>
        <Image source={mainImage} style={styles.mainImage} resizeMode="cover" />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* 2. TAGS & DATE */}
          <View style={styles.typeRow}>
            <View style={[styles.typeBadge, {backgroundColor: donation.donationType === 'Fund' ? '#E3F2FD' : '#E8F5E9'}]}>
                <Text style={[styles.typeText, {color: donation.donationType === 'Fund' ? '#20b8f4' : '#4CAF50'}]}>
                    {donation.donationType.toUpperCase()}
                </Text>
            </View>
            <Text style={[styles.dateText, isExpired && {color: '#FF5252', fontWeight: 'bold'}]}>
                {isExpired ? "Campaign Expired" : `Ends: ${donation.endDate}`}
            </Text>
          </View>
          
          <Text style={styles.donTitle}>{donation.title}</Text>

          {/* 3. PROGRESS SECTION (Funds) */}
          {donation.donationType === 'Fund' && (
              <View style={styles.fundCard}>
                 <View style={styles.rowBetween}>
                    <View>
                        <Text style={styles.goalLabel}>Collected</Text>
                        <Text style={styles.collectedValue}>Rs. {collected}</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <Text style={styles.goalLabel}>Goal</Text>
                        <Text style={styles.goalValue}>Rs. {target}</Text>
                    </View>
                 </View>
                 
                 <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, {width: `${progressPercent}%`}]} /> 
                 </View>
                 <Text style={styles.progressText}>{progressPercent}% of goal reached</Text>
              </View>
          )}

          {/* 4. CATEGORY SECTION (Supplies) */}
          {donation.donationType === 'Supplies' && (
              <View style={styles.supplyCard}>
                 <Ionicons name="cube-outline" size={26} color="#4CAF50" />
                 <View style={{marginLeft: 15}}>
                    <Text style={styles.goalLabel}>Category Needed</Text>
                    <Text style={styles.goalValue}>{donation.suppliesCategory}</Text>
                 </View>
              </View>
          )}

          {/* 5. TIMELINE */}
          <Text style={styles.sectionTitle}>Campaign Timeline</Text>
          <View style={styles.timelineRow}>
            <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>START</Text>
                <Text style={styles.timeDate}>{donation.startDate}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#ccc" />
            <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>END</Text>
                <Text style={styles.timeDate}>{donation.endDate}</Text>
            </View>
          </View>

          {/* 6. DESCRIPTION */}
          <Text style={styles.sectionTitle}>The Story</Text>
          <Text style={styles.descriptionText}>{donation.description}</Text>

          {/* 7. SHELTER CARD */}
          <View style={styles.shelterCard}>
             <View style={styles.shelterIcon}>
                <Image source={require('../../assets/profile.png')} style={{width:'100%', height:'100%'}} resizeMode="contain" />
             </View>
             <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.shelterName}>{shelterName}</Text>
                <Text style={styles.shelterLabel}>Verified WaggyWorld Shelter</Text>
             </View>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* 8. DYNAMIC FOOTER ACTION */}
      <View style={styles.footer}>
        {isExpired ? (
            // CASE: DEADLINE IS OVER
            <View style={styles.expiredBanner}>
                <Ionicons name="lock-closed" size={20} color="#999" />
                <Text style={styles.expiredText}>Deadline is over. Donation closed.</Text>
            </View>
        ) : (
            // CASE: ACTIVE
            <TouchableOpacity 
                style={[styles.actionBtn, {backgroundColor: donation.donationType === 'Fund' ? '#20b8f4' : '#4CAF50'}]}
                onPress={() => donation.donationType === 'Fund' ? Alert.alert("Funds", "Pay via eSewa coming soon.") : setModalVisible(true)}
            >
                <Text style={styles.btnText}>
                    {donation.donationType === 'Fund' ? 'Proceed to Donate' : 'Schedule Drop-off'}
                </Text>
            </TouchableOpacity>
        )}
      </View>

      {/* --- SCHEDULE MODAL --- */}
      <Modal visible={isModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                  <Text style={styles.modalTitle}>Schedule Drop-off</Text>
                  <Text style={styles.modalSub}>When would you like to bring the supplies to {shelterName}?</Text>
                  
                  <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
                      <Ionicons name="calendar" size={24} color="#20b8f4" />
                      <Text style={styles.dateValue}>{selectedDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                      <DateTimePicker 
                        value={selectedDate} 
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={(e, d) => {setShowDatePicker(false); if(d) setSelectedDate(d)}} 
                      />
                  )}

                  <View style={styles.modalActions}>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                          <Text style={{fontWeight: 'bold', color: '#666'}}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.confirmBtn} onPress={handleScheduleBooking}>
                          <Text style={{color: '#fff', fontWeight: 'bold'}}>Confirm</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  imageSection: { width: width, height: 320 },
  mainImage: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 15 },
  detailsContainer: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -40, elevation: 10 },
  content: { padding: 25 },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  typeText: { fontSize: 11, fontWeight: '900' },
  dateText: { fontSize: 12, color: '#999' },
  donTitle: { fontSize: 26, fontWeight: '900', color: '#1A237E', marginBottom: 20 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  fundCard: { backgroundColor: '#F0FAFF', padding: 20, borderRadius: 25, marginBottom: 25, borderWidth: 1, borderColor: '#E3F2FD' },
  supplyCard: { backgroundColor: '#F1F8E9', padding: 20, borderRadius: 25, marginBottom: 25, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DCEDC8' },
  goalLabel: { fontSize: 11, color: '#999', fontWeight: 'bold', textTransform: 'uppercase' },
  goalValue: { fontSize: 16, fontWeight: '700', color: '#666' },
  collectedValue: { fontSize: 24, fontWeight: '900', color: '#20b8f4' },
  progressBarBg: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, marginTop: 15 },
  progressBarFill: { height: '100%', backgroundColor: '#20b8f4', borderRadius: 5 },
  progressText: { fontSize: 12, color: '#1384b1', marginTop: 10, textAlign: 'right', fontWeight: '800' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A237E', marginTop: 10, marginBottom: 12 },
  timelineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 15, borderRadius: 20, marginBottom: 25 },
  timeItem: { alignItems: 'center' },
  timeLabel: { fontSize: 10, color: '#BBB', fontWeight: '900' },
  timeDate: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  descriptionText: { fontSize: 15, color: '#555', lineHeight: 24, marginBottom: 25 },
  shelterCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFDE7', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#fcefba' },
  shelterIcon: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#fff', overflow: 'hidden' },
  shelterName: { fontSize: 16, fontWeight: 'bold', color: '#1A237E' },
  shelterLabel: { fontSize: 12, color: '#777' },
  footer: { position: 'absolute', bottom: 0, width: width, padding: 25, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', paddingBottom: 40 },
  actionBtn: { padding: 18, borderRadius: 20, alignItems: 'center', elevation: 5 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  expiredBanner: { backgroundColor: '#F5F5F5', padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  expiredText: { color: '#999', fontWeight: 'bold', marginLeft: 10 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: '#fff', borderRadius: 30, padding: 25, maxHeight: '90%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A237E', textAlign: 'center', marginBottom: 10 },
  modalSub: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  dateSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#eee' },
  dateValue: { marginLeft: 10, fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  cancelBtn: { flex: 0.45, padding: 15, alignItems: 'center' },
  confirmBtn: { flex: 0.45, backgroundColor: '#20b8f4', padding: 15, borderRadius: 12, alignItems: 'center' }
});