import { useContext, useState } from 'react';
import { useRouter } from 'expo-router'; 
import {View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox'; 
import { Link } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';
import { authStyles } from '../../src/styles/auth.styles';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAgreed, setAgreed] = useState(false);

  const { signup, loginWithGoogle, loginWithApple } = useContext(AuthContext);
  const router = useRouter();

  return (
    <View style={authStyles.container}>
      {/* 1. DECORATIVE BLOBS */}
      <View style={authStyles.blob1} />
      <View style={authStyles.blob2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={authStyles.keyboardView}
      >
        <ScrollView contentContainerStyle={authStyles.scrollContent}>

          {/* Logo */}
          <View style={authStyles.logoContainer}>
            <Image
              source={require('../../assets/WaggyWorld.png')}
              style={authStyles.logo}
            />
          </View>

          {/* content Container */}
          <View style={authStyles.contentContainer}>
            <Text style={authStyles.title}>Get Started</Text>
            <Text style={authStyles.subtitle}>
                Please fill in the details to sign up
            </Text>

          {/* Name */}
          <View style={authStyles.inputContainer}>
            <TextInput
              placeholder="Name"
              style={authStyles.textInput}
              onChangeText={setName}
              autoCapitalize="words"
              placeholderTextColor="#9e9e9e"
            />
          </View>

          {/* Email */}
          <View style={authStyles.inputContainer}>
            <TextInput
              placeholder="Email"
              style={authStyles.textInput}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9e9e9e"
            />
          </View>

          {/* Password */}
          <View style={authStyles.inputContainer}>
            <TextInput
              placeholder="Password"
              style={authStyles.textInput}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              placeholderTextColor="#9e9e9e"
            />

            <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#000000"
              />
            </TouchableOpacity>
          </View>

          {/* TERMS CHECKBOX */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
            <Checkbox value={isAgreed} onValueChange={setAgreed} color={isAgreed ? '#20b8f4' : undefined} />
            <Text style={{ marginLeft: 10, color: '#666' }}>
               By signing up, you agree to the
               <Text onPress={() => router.push('app/auth/terms' as any)} style={{ color: '#1384b1', fontWeight: 'bold' }}> Terms of Services & Privacy Policy</Text>
            </Text>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            disabled={!isAgreed}
            style={[authStyles.authButton, !isAgreed && { backgroundColor: '#ccc' }, { marginTop: 10, marginBottom: 15 }]}
            onPress={() => signup(name, email, password, 'user')}
          >
            <Text style={authStyles.buttonText}>Join WaggyWorld</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={authStyles.linkContainer}>
            <Text style={authStyles.linkText}>
              Already have an account?{' '}
              <Link href="/auth/login" style={authStyles.link}>
                Login
              </Link>
            </Text>
          </View>

           {/* SOCIAL LOGIN SECTION */}
          <View style={{ marginTop: 10 }}>
            {/* HORIZONTAL LINE SECTION */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#d0cccc' }} />
            <View>
              <Text style={{ width: 100, textAlign: 'center', color: '#999', fontSize: 12 }}>OR Sign up with</Text>
            </View>
            <View style={{ flex: 1, height: 1, backgroundColor: '#d0cccc' }} />
            </View>

          <View style={[authStyles.socialRow, { marginBottom: 10 }]}>
            <TouchableOpacity onPress={loginWithGoogle} style={authStyles.socialBtn}>
             <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity onPress={loginWithApple} style={authStyles.socialBtn}>
              <Ionicons name="logo-apple" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          </View>

        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
