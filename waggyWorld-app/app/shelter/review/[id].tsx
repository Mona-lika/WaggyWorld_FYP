import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Modal, TextInput, Dimensions, Platform  } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

export default function ReviewApplication() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // Decision States
    const [isModalVisible, setModalVisible] = useState(false);
    const [decisionType, setDecisionType] = useState<'approved' | 'rejected' | null>(null);
    const [reason, setReason] = useState('');
    const [visitDate, setVisitDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const API_URL = "http://192.168.1.64:5001/api/applications"; // UPDATE IP

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`${API_URL}/review/${id}`);
                setData(res.data);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchDetails();
    }, [id]);

    const handleOpenModal = (type: 'approved' | 'rejected') => {
        setDecisionType(type);
        setModalVisible(true);
    };

    const submitDecision = async () => {
        if (decisionType === 'rejected' && !reason) {
            Alert.alert("Required", "Please provide a reason for declining.");
            return;
        }

        try {
            await axios.put(`${API_URL}/status/${id}`, { 
                status: decisionType,
                rejectionReason: decisionType === 'rejected' ? reason : null,
                visitDate: decisionType === 'approved' ? visitDate.toLocaleDateString() : null
            });
            
            setModalVisible(false);
            Alert.alert("Success", `Application has been ${decisionType}.`);
            router.replace('/shelter/request' as any);
        } catch (e) {
            Alert.alert("Error", "Failed to update application status.");
        }
    };

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#20b8f4" /></View>;
    if (!data) return <View style={styles.loader}><Text>Application not found.</Text></View>;

    const { application, petName, petBreed, adopterName, petImage } = data;

    // --- DYNAMIC IMAGE LOGIC ---
    const photos = petImage || [];
    const petImgSource = (photos && photos.length > 0) 
        ? { uri: photos[0] } 
        : require('../../../assets/WaggyWorld.png');

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1A237E" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Review Application</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                
                {/* HERO CONTAINER (IMAGE + OVERLAY CARD) */}
                <View style={styles.heroContainer}>
                    <Image source={petImgSource} style={styles.heroImage} resizeMode="cover" />
                    
                    {/* Semi-transparent Summary Card at the bottom of the image */}
                    <View style={styles.overlaySummaryCard}>
                        <Text style={styles.summaryTitle}>{adopterName} wants to adopt {petName}</Text>
                        <Text style={styles.summarySub}>
                            {petBreed} • Applied {new Date(application.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                 {/* SENTENCE BELOW IMAGE */}
                <View style={styles.hintContainer}>
                    <Ionicons name="information-circle-outline" size={16} color="#1384b1" />
                    <Text style={styles.hintText}>Applicant Details Below</Text>
                </View>

                {/* 1. PERSONAL INFO */}
                <SectionHeader icon="person" title="Personal Information" />
                <InfoItem label="Full Name" value={application.fullName} />
                <InfoItem label="Phone" value={application.phoneNumber} />
                <InfoItem label="Address" value={application.address} />

                {/* 2. LIVING SITUATION */}
                <SectionHeader icon="home" title="Living Situation" />
                <InfoItem label="Home Type" value={application.homeType} />
                <InfoItem label="Ownership" value={application.isOwner} />
                <InfoItem label="Yard Available?" value={application.hasYard} />

                {/* 3. EXPERIENCE */}
                <SectionHeader icon="paw" title="Experience & Care" />
                <InfoItem label="Owned pets before?" value={application.pastExperience} />
                <InfoItem label="Current pets?" value={application.hasCurrentPets} />
                <InfoItem label="Alone Hours/Day" value={application.aloneHours} />
                <InfoItem label="Primary Caretaker" value={application.primaryCaretaker} />

            </ScrollView>

            {/* ACTION FOOTER */}
            <View style={styles.footer}>
    {application.status === 'pending' ? (
        // 1. Show Buttons ONLY if status is Pending
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <TouchableOpacity 
                style={[styles.actionBtn, styles.declineBtn]} 
                onPress={() => handleOpenModal('rejected')}
            >
                <Text style={styles.btnText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.actionBtn, styles.acceptBtn]} 
                onPress={() => handleOpenModal('approved')}
            >
                <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
        </View>
    ) : (
        // 2. Show Status Information if already Approved or Rejected
        <View style={[
            styles.finalStatusBanner, 
            { backgroundColor: application.status === 'approved' ? '#E8F5E9' : '#FFEBEE' }
        ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons 
                    name={application.status === 'approved' ? "checkmark-circle" : "close-circle"} 
                    size={24} 
                    color={application.status === 'approved' ? "#2E7D32" : "#C62828"} 
                />
                <Text style={[
                    styles.finalStatusText, 
                    { color: application.status === 'approved' ? "#2E7D32" : "#C62828" }
                ]}>
                    APPLICATION {application.status.toUpperCase()}
                </Text>
            </View>
            
            {/* Show the specific detail (Date or Reason) */}
            {application.status === 'approved' && (
                <Text style={styles.finalStatusDetail}>Visit Date: {application.visitDate}</Text>
            )}
            {application.status === 'rejected' && (
                <Text style={styles.finalStatusDetail}>Reason: {application.rejectionReason}</Text>
            )}
        </View>
    )}
</View>


            {/* --- DECISION MODAL --- */}
            <Modal visible={isModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>
                            {decisionType === 'approved' ? 'Schedule Visit' : 'Decline Request'}
                        </Text>

                        {decisionType === 'approved' ? (
                            <View>
                                <Text style={styles.modalSub}>Select a date for the adopter to visit the shelter and meet the pet:</Text>
                                <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
                                    <Ionicons name="calendar" size={22} color="#20b8f4" />
                                    <Text style={styles.dateValue}>{visitDate.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker 
                                        value={visitDate} 
                                        mode="date" 
                                        display={Platform.OS === 'ios' ? 'inline' : 'default'} 
                                                onChange={(e, d) => { 
                                                    setShowDatePicker(false); 
                                                    if(d) setVisitDate(d); 
                                        }} 
                                    />
                                )}
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.modalSub}>Please explain why this application is being declined:</Text>
                                <TextInput 
                                    style={styles.modalInput} 
                                    placeholder="e.g. Applicant lives too far from shelter..." 
                                    multiline 
                                    onChangeText={setReason} 
                                />
                            </View>
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={{color: '#666', fontWeight: 'bold'}}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.confirmBtn, {backgroundColor: decisionType === 'approved' ? '#4CAF50' : '#FF5252'}]} onPress={submitDecision}>
                                <Text style={{color: '#fff', fontWeight: 'bold'}}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// --- UI HELPERS ---
const SectionHeader = ({ icon, title }: any) => (
    <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={18} color="#20b8f4" />
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

const InfoItem = ({ label, value }: any) => (
    <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>{label}:</Text>
        <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A237E' },
    content: { padding: 20, paddingBottom: 120 },
    heroContainer: { 
        width: '100%', 
        height: 300, 
        borderRadius: 30, 
        overflow: 'hidden', 
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        backgroundColor: '#f9f9f9',
        marginBottom: 10
    },
    heroImage: { 
        width: '100%', 
        height: '100%',
        position: 'absolute'
    },
    overlaySummaryCard: { 
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(243, 209, 70, 0.65)', 
        padding: 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
    },
    summaryTitle: { fontSize: 18, fontWeight: '900', color: '#000000' },
    summarySub: { fontSize: 13, color: '#333', marginTop: 4, fontWeight: '600' },

    imageWrapper: { width: '100%', height: 200, borderRadius: 25, overflow: 'hidden', marginBottom: 15, elevation: 4 },
    petImage: { width: '100%', height: '100%' },
    hintContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 25,
        padding: 10,
        backgroundColor: '#f0faff',
        borderRadius: 15
    },
    hintText: { 
        color: '#1384b1', 
        fontSize: 13, 
        fontWeight: '700', 
        marginLeft: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    imageOverlay: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, alignItems: 'center' },
    overlayText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#20b8f4', marginLeft: 10 },
    infoItem: { marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
    infoLabel: { fontSize: 12, color: '#999', textTransform: 'uppercase' },
    infoValue: { fontSize: 16, color: '#333', fontWeight: '500', marginTop: 3 },
    actionBtn: { flex: 0.48, padding: 18, borderRadius: 15, alignItems: 'center', elevation: 2 },
    declineBtn: { backgroundColor: '#FF5252' },
    acceptBtn: { backgroundColor: '#4CAF50' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalCard: { width: '85%', backgroundColor: '#fff', borderRadius: 30, padding: 25 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A237E', textAlign: 'center', marginBottom: 10 },
    modalSub: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
    modalInput: { backgroundColor: '#f9f9f9', borderRadius: 15, padding: 15, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#eee' },
    dateSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#eee' },
    dateValue: { marginLeft: 10, fontSize: 16, fontWeight: 'bold', color: '#333' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
    cancelBtn: { flex: 0.45, padding: 15, alignItems: 'center' },
    confirmBtn: { flex: 0.45, padding: 15, borderRadius: 12, alignItems: 'center' },
    footer: { 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        padding: 20, 
        paddingBottom: 40, 
        backgroundColor: '#fff', 
        borderTopWidth: 1, 
        borderTopColor: '#eee',
        alignItems: 'center'
    },
    finalStatusBanner: {
        width: '100%',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    finalStatusText: {
        fontSize: 16,
        fontWeight: '900',
        marginLeft: 10,
        letterSpacing: 1,
    },
    finalStatusDetail: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
        fontWeight: '600'
    },
});