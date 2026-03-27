import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../src/context/AuthContext"; 
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  // 1. If no user, go to login. 
  // Note: We use "/login" because "(auth)" is hidden.
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  // Onboarding page
  if (user.isNew) {
    return <Redirect href="/user/welcome" />;
  }

  // 2. Redirect based on role
  // IMPORTANT: You must have a file named "dashboard.tsx" inside these folders!
  if (user.role === 'admin') {
    return <Redirect href="/admin/dashboard" />; 
  } 
  
  if (user.role === 'shelter') {
    return <Redirect href="/shelter/dashboard" />;
  }

  // If it's an existing user, go straight to the main Home (wireframe layout)
  return <Redirect href="/user/dashboard" />;
}