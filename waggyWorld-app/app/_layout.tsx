import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          // 1. REMOVE SLIDE ANIMATION 
          animation: 'none', 
          contentStyle: { backgroundColor: '#fff' }
        }}
      >
        {/* Main Traffic Controller */}
        <Stack.Screen name="index" />

        {/* --- AUTHENTICATION --- */}
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(auth)/forgot-password" />
        <Stack.Screen name="(auth)/terms" options={{ presentation: 'modal' }} />

        {/* --- USER MODULE --- */}
        <Stack.Screen name="(user)/welcome" />
        <Stack.Screen name="(user)/dashboard" />
        <Stack.Screen name="(user)/applications" />

        {/* --- SHELTER MODULE --- */}
        <Stack.Screen name="(shelter)/dashboard" />
        <Stack.Screen name="(shelter)/applications" />
        
        {/* 2. DYNAMIC ROUTES (Very Important) */}
        <Stack.Screen name="pet/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="shelter/review/[id]" options={{ animation: 'slide_from_right' }} />
        
        {/* 3. MODAL PRESENTATION (For the form) */}
        <Stack.Screen 
          name="pet/application" 
          options={{ 
            presentation: 'modal', 
            animation: 'slide_from_bottom',
            headerShown: true,
            headerTitle: "Adoption Form"
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}