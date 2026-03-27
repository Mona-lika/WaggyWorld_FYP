import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores { id, name, role }
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const API_URL = "http://192.168.1.64:5001/api/auth";

    // 1. Check if user is already logged in when the app starts
    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                const token = await AsyncStorage.getItem('token');

                if (storedUser && token) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.log("Error loading storage", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadStoredData();
    }, []);

    // 2. LOGIN FUNCTION
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            
            const { token, user } = response.data;

            // Save to permanent phone storage
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            // Update global state
            setUser(user);

            // Redirect is handled by app/index.tsx automatically
            if (user.role === 'user' && user.isNew) {
            router.replace('/user/welcome');
            } else if (user.role === 'admin') {
            router.replace('/admin/dashboard');
            } else if (user.role === 'shelter') {
            router.replace('/shelter/dashboard');
            } else {
            router.replace('/user/dashboard');
            }

    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        alert("Login Failed: Please check your email and password.");
    }
    };

    // 3. SIGNUP FUNCTION
    const signup = async (name, email, password) => {
        try {
            await axios.post(`${API_URL}/register`, { name, email, password, role: 'user', });
            alert("Signup Successful! Now you can login.");
            router.replace('/auth/login');
        } catch (error) {
            console.error("Signup Error FULL:", {
             message: error.message,
            response: error.response?.data,
            status: error.response?.status,
    });
        alert("Signup Failed: Email might already be registered.");
        }
    };

    // 4. FORGOT PASSWORD
    const forgotPassword = async (email) => {
        try {
            const API_URL = "http://192.168.1.83:5001/api/auth/forgotPassword";
            await axios.post(API_URL, { email });
            alert("If an account exists with this email, a reset link has been sent.");
        } catch (error) {
            alert("Something went wrong. Please try again.");
        }
    };

    // 5. SOCIAL LOGIN STUBS (For UI Demo)
    const loginWithGoogle = () => Alert.alert("Google Auth", "Redirecting to Google Sign-In...");
    const loginWithApple = () => Alert.alert("Apple Auth", "Redirecting to Apple ID...");

    // 6. LOGOUT FUNCTION
    const logout = async () => {
        try {
            await AsyncStorage.clear();
            setUser(null);
            router.replace('/(auth)/login');
        } catch (e) {
            console.log("Logout Error", e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, logout, isLoading, forgotPassword, loginWithGoogle, loginWithApple  }}>
            {children}
        </AuthContext.Provider>
    );
};