import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase/config';
import { useAuthStore } from '../../store/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // In a real app, you would also make an API call to your backend here to create the user profile in MongoDB
      // e.g., await api.post('/users/register', { firebaseUid: userCredential.user.uid, email });

      setUser(userCredential.user);
      setToken(token);
      router.replace('/(dashboard)/home');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 justify-center"
      >
        <View className="mb-10">
          <Text className="text-3xl font-extrabold text-text mb-2">Create Account</Text>
          <Text className="text-textSecondary text-base">Join Azaw Na to get your anonymous link</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-text font-semibold mb-2 ml-1">Email</Text>
            <TextInput
              className="w-full bg-surface py-4 px-5 rounded-xl text-text"
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-text font-semibold mb-2 ml-1">Password</Text>
            <TextInput
              className="w-full bg-surface py-4 px-5 rounded-xl text-text"
              placeholder="Create a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <TouchableOpacity
          className="w-full bg-brand py-4 rounded-xl items-center mt-8 flex-row justify-center shadow-sm"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" className="mr-2" />
          ) : null}
          <Text className="text-white font-bold text-lg">Sign Up</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-8">
          <Text className="text-textSecondary">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-brand font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
