import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TermsPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1384b1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>WaggyWorld Privacy Agreement</Text>
        <Text style={styles.text}>
          1. Data Usage: We store your email and pet data securely in our PostgreSQL database.{"\n\n"}
          2. Responsibilities: Shelters are responsible for the accuracy of pet health data.{"\n\n"}
          3. Donations: WaggyWorld acts as a platform for connection, not a financial middleman.{"\n\n"}
          4. Content: You agree not to post inappropriate or fraudulent content.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, color: '#1384b1' },
  content: { padding: 25 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1384b1' },
  text: { fontSize: 16, color: '#444', lineHeight: 24 }
});