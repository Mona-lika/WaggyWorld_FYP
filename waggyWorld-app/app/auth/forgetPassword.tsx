import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { authStyles } from '../../src/styles/auth.styles';

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1); // 1: Email, 2: Success, 3: New Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  // --- RENDERING FUNCTIONS ---

  // SCREEN 1: ENTER EMAIL
  const renderStep1 = () => (
    <View style={authStyles.contentContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#1A237E" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Reset password</Text>
      <Text style={styles.instructionText}>
        Enter the email associated with your account and we'll send an email with instructions to reset your password.
      </Text>

      <Text style={styles.label}>Email address</Text>
      <View style={authStyles.inputContainer}>
        <TextInput 
          placeholder="e.g. monalika@test.com" 
          style={authStyles.textInput} 
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={authStyles.authButton} onPress={() => setStep(2)}>
        <Text style={authStyles.buttonText}>Send Instructions</Text>
      </TouchableOpacity>
    </View>
  );

  // SCREEN 2: CHECK MAIL (SUCCESS)
  const renderStep2 = () => (
    <View style={[authStyles.contentContainer, { alignItems: 'center', justifyContent: 'center' }]}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="email-open-outline" size={50} color="#20b8f4" />
      </View>

      <Text style={styles.headerTitle}>Check your mail</Text>
      <Text style={[styles.instructionText, { textAlign: 'center' }]}>
        We have sent a password recover instructions to your email.
      </Text>

      <TouchableOpacity style={[authStyles.authButton, { width: '100%' }]} onPress={() => setStep(3)}>
        <Text style={authStyles.buttonText}>Open email app</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={{ color: '#666', fontWeight: '600' }}>Skip, I'll confirm later</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerText}>
        Did not receive the email? Check your spam filter, or 
        <Text style={{ color: '#20b8f4', fontWeight: 'bold' }} onPress={() => setStep(1)}> try another email address</Text>
      </Text>
    </View>
  );

  // SCREEN 3: CREATE NEW PASSWORD
  const renderStep3 = () => (
    <View style={authStyles.contentContainer}>
      <TouchableOpacity onPress={() => setStep(2)} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#1A237E" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Create new password</Text>
      <Text style={styles.instructionText}>
        Your new password must be different from previous used passwords.
      </Text>

      <Text style={styles.label}>Password</Text>
      <View style={authStyles.inputContainer}>
        <TextInput 
          placeholder="••••••••" 
          secureTextEntry 
          style={authStyles.textInput} 
          onChangeText={setPassword}
        />
      </View>
      <Text style={styles.hintText}>Must be at least 8 characters.</Text>

      <Text style={[styles.label, { marginTop: 15 }]}>Confirm Password</Text>
      <View style={authStyles.inputContainer}>
        <TextInput 
          placeholder="••••••••" 
          secureTextEntry 
          style={authStyles.textInput} 
          onChangeText={setConfirmPassword}
        />
      </View>
      <Text style={styles.hintText}>Both passwords must match.</Text>

      <TouchableOpacity style={authStyles.authButton} onPress={() => {
          alert("Password Reset Successful!");
          router.replace('/auth/login' as any);
      }}>
        <Text style={authStyles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={authStyles.container}>
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={authStyles.logoContainer}>
            <Image source={require('../../assets/WaggyWorld.png')} style={authStyles.logo} />
          </View>

          {/* Logic to switch between steps */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backText: { fontSize: 16, marginLeft: 5, color: '#1A237E', fontWeight: '600' },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1A237E', marginBottom: 10 },
  label: {fontSize: 14, fontWeight: '500', color: '#666', marginBottom: 5,},
  instructionText: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 25 },
  hintText: { fontSize: 12, color: '#999', marginTop: -9, marginBottom: 10 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f0faff', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  footerText: { marginTop: 60, textAlign: 'center', color: '#999', fontSize: 13, paddingHorizontal: 20 }
});