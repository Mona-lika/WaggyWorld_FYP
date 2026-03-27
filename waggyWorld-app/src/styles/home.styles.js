import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#f3d146",     // Your Blue
  secondary: "#20b8f4",
  background: "#e6f4fa",  // Your Yellow
  white: "#FFFFFF",
  textMain: "#1A237E",    // Dark Blue
  textGray: "#777",
  cardBg: "#FFFFFF",
};

export const homeStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 60, 
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.secondary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoText: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: COLORS.white
  },
  profileCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: COLORS.primary, 
    justifyContent: 'center', 
    alignItems: 'center',
    overflow: 'hidden'
  },
   cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  // Ensure shelterHeader has enough space for the circle
  shelterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  scrollContent: { 
    paddingBottom: 100 
  },
  section: { 
    paddingHorizontal: 20, 
    marginTop: 25 
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 10 
  },
  seeAllText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: 14
  },
  searchBar: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.white, 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    height: 50, 
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16 
  },
  categoryScroll: { 
    paddingLeft: 20, 
    marginTop: 20 
  },
  catContainer: { 
    alignItems: 'center', 
    marginRight: 25 
  },
  catBox: { 
    width: 70, 
    height: 70, 
    backgroundColor: COLORS.white, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 4, // Moves shadow down
  },
  shadowOpacity: 0.15, // Transparency of shadow
  shadowRadius: 6, 
  elevation: 6,
  },
  catLabel: { 
    marginTop: 8, 
    fontWeight: '600', 
    color: COLORS.textMain
  },
  browseCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 12,
    marginRight: 15,
    marginTop: 15,
    marginBottom: 15,
    width: 200, // Fixed width for horizontal scroll
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  browseImage: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    marginBottom: 10,
    overflow: 'hidden'
  },
  petNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  petNameText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A237E',
    marginRight: 8,
  },
  petInfoSubtitle: {
    fontSize: 13,
    color: '#777',
    marginBottom: 10,
  },
  shelterMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  shelterMiniName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1384b1',
    marginLeft: 6,
  },
  banner: { 
    marginHorizontal: 20, 
    height: 180, 
    backgroundColor: COLORS.white, 
    borderRadius: 25, 
    marginTop: 30, 
    overflow: 'hidden', 
    elevation: 5 
  },
  bannerImage: { 
    width: '100%', 
    height: '100%', 
    position: 'absolute', 
    opacity: 0.6,
    backgroundColor: '#f9f9f9',
  },
  bannerText: { 
    zIndex: 1, 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: COLORS.textMain, 
    padding: 20, 
    width: '70%' 
  },
  donationRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  donationFeedCard: {
    width: 310,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    marginRight: 20,
    paddingVertical: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden'
  },
  donCardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    marginBottom: 10 
  },
  donShelterName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  donDate: { fontSize: 11, color: '#999' },
  donDescSnippet: { 
    fontSize: 14, 
    color: '#444', 
    paddingHorizontal: 15, 
    marginBottom: 12, 
    lineHeight: 18 
  },
  donCardImage: { 
    width: '100%', 
    height: 180, 
    backgroundColor: '#f9f9f9' 
  },
  donateBtn: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
    borderWidth: 2,
    marginHorizontal: 15,
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3
  },
  donateBtnText: { color: COLORS.secondary, fontWeight: '800', fontSize: 15 },

  bottomNav: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    height: 85, 
    backgroundColor: COLORS.white, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
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