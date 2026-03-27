import { Dimensions, StyleSheet } from "react-native";
//import { COLORS } from "../../constants/colors";

const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#20b8f4",     // Blue
  background: "#fcefba",  // Light Yellow
  text: "#1384b1",
  subText: "#a7a7a7",        // Dark Blue
  textLight: "#000000",   // Soft Blue
  border: "#d0cccc",      // Yellow Border
  white: "#FFFFFF",
};

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 0,  
    marginHorizontal: 0, 
    overflow: 'hidden'
  },
  
  blob1: {
    position: 'absolute',
    top: -150,
    left: 320,
    width: 500,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#f3d146', 
    transform: [{ rotate: '-15deg' }],
    opacity: 0.7
  },

  blob2: {
    position: 'absolute',
    top: 250,
    left: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#f3d146',
    opacity: 0.7
  },

  contentContainer: {
  backgroundColor: '#fff',
  flexGrow: 1,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,         
  paddingHorizontal: 40,    
  paddingTop: 30,
  paddingBottom: 40, 
  width: '100%',
  margin:0,     
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingTop: 40,
  },
  imageContainer: {
    height: height * 0.3,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 320,
    height: 320,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.subText,
    textAlign: "center",
    marginBottom: 40,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 10,
    position: "relative",
  },
  textInput: {
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
  },
  authButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
  },
  linkContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  linkText: {
    fontSize: 16,
    color: COLORS.subText,
  },
  link: {
    color: COLORS.text,
    fontWeight: "600",
  },
  logoContainer: {
  alignItems: "center",
  marginBottom: -60,
  marginTop: 40,
},

logo: {
  width: 300,
  height: 300,
  resizeMode: "contain",
},
socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  socialBtn: { padding: 15, borderRadius: 15, backgroundColor: '#fff', elevation: 3, shadowOpacity: 0.1 }


});