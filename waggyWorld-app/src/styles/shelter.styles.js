import { StyleSheet, Dimensions } from "react-native";

const screenHeight = Dimensions.get("window").height;

export const shelterStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f3d146' // Your Brand Yellow
  },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 25, 
    paddingBottom: 20, 
    backgroundColor: '#f3d146', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  headerLogo: { 
    width: 60, 
    height: 60,
    paddingHorizontal: -10, 

  },
  profileCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#20b8f4', 
    justifyContent: 'center', 
    alignItems: 'baseline',
    borderWidth: 1, 
    borderColor: '#eee', 
    overflow: 'hidden'
  },

  // --- NEW: THE WHITE BOX CONTAINER ---
  contentContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100, // Extra space for bottom nav
    minHeight: screenHeight * 0.8,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -5 },
  },

  scrollContent: { 
    flexGrow: 1 
  },
  
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 50 
  },
  statCardPet: { 
    width: '48%', padding: 15, borderRadius: 15, borderWidth: 2, 
    borderColor: '#39d743', // Dark Green Border
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff'
  },
  statNumberPet: { fontSize: 22, fontWeight: '900', color: '#2c7b32' }, // Dark Green Text

  // APP CARD (Dark Blue)
  statCardApp: { 
    width: '48%', padding: 15, borderRadius: 15, borderWidth: 2, 
    borderColor: '#6fc6e8', // Dark Blue Border
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff'
  },
  statNumberApp: { fontSize: 22, fontWeight: '900', color: '#2b7b9b' }, // Dark Blue Text
  statContent: { 
    marginLeft: 10 
  },
  statNumber: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#1384b1' 
  },
  statLabel: { 
    fontSize: 11, 
    color: '#666', 
    marginTop: 5 
  },
  mainActionBtn: { 
    backgroundColor: '#20b8f4', 
    padding: 20, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15, 
    elevation: 8,
    shadowColor: '#20b8f4', 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    shadowOffset: { width: 0, height: 4 }
  },
  actionText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: 'bold', 
    marginLeft: 15 
  },

  sectionHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 40, 
    marginBottom: 15 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1384b1' 
  },
  seeAllText: { 
    fontSize: 14, 
    color: '#20b8f4', 
    fontWeight: 'bold' 
  },

  petItem: { 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12, 
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  petImage: { 
    width: 55, 
    height: 55, 
    borderRadius: 15, 
    backgroundColor: '#fcefba'
  },
   // PET GRID 
  petGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  petCard: { width: '48%', backgroundColor: '#fff', borderRadius: 25, padding: 10, marginBottom: 15, elevation: 5, shadowOpacity: 0.1 },
  petCardImage: { width: '100%', height: 120, borderRadius: 20, marginBottom: 8 },
  petCardName: { fontSize: 16, fontWeight: '900', color: '#1A237E', marginLeft: 5 },
  petCardDetail: { flexDirection: 'row', alignItems: 'center', marginTop: 3, marginLeft: 5 },
  petCardDetailText: { fontSize: 11, color: '#777', marginLeft: 4 },

  // DONATION POST (FACEBOOK STYLE)
  donationPost: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 15, marginBottom: 20, elevation: 3, borderWidth: 1, borderColor: '#f0f0f0' },
  donHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 12 },
  donShelterName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  donTime: { fontSize: 11, color: '#999' },
  donDesc: { fontSize: 14, color: '#444', paddingHorizontal: 15, marginBottom: 12, lineHeight: 20 },
  donImage: { width: '100%', height: 220 },
  petInfo: { marginLeft: 15, flex: 1 },
  petName: { fontSize: 17, fontWeight: 'bold', color: '#1384b1' },
  petBreed: { fontSize: 13, color: '#666' },
  petCategory: { fontSize: 12, color: '#20b8f4', fontWeight: 'bold' },
  petStatus: { fontSize: 10, color: '#4CAF50', fontWeight: 'bold' },

  bottomNav: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    height: 85, 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    elevation: 25,
    paddingBottom: 15
  }
});