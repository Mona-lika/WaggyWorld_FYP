import { useContext, useState } from 'react';
import { useRouter } from 'expo-router'; 
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';
import { authStyles } from '../../src/styles/auth.styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, loginWithGoogle, loginWithApple } = useContext(AuthContext);
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
            <Text style={authStyles.title}>Welcome Back</Text>
            <Text style={authStyles.subtitle}>
              Please login to your account
            </Text>

          {/* Email */}
          <View style={authStyles.inputContainer}>
            <TextInput
              placeholder="Email"
              style={authStyles.textInput}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#a7a7a7"
            />
          </View>

          {/* Password */}
          <View style={authStyles.inputContainer}>
            <TextInput
              placeholder="Password"
              style={authStyles.textInput}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              placeholderTextColor="#a7a7a7"
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

          {/* FORGOT PASSWORD LINK */}
            <View style={authStyles.linkContainer}>
            <Text style={authStyles.linkText}>
              <Link href="./forgetPassword" style={authStyles.link}>Forgot Password ?</Link>

            </Text>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[authStyles.authButton, { marginTop: 0, marginBottom: 15 }]}
            onPress={() => login(email, password)}
          >
            <Text style={authStyles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Signup Link */}
          <View style={authStyles.linkContainer}>
            <Text style={authStyles.linkText}>
              Don't have an account?{' '}
              <Link href="./signup" style={authStyles.link}>Sign up</Link>

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
