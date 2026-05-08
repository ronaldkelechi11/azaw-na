import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase/config';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      setUser(userCredential.user);
      setToken(token);
      router.replace('/(dashboard)/home');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
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
          <Text className="text-3xl font-extrabold text-text mb-2">Welcome Back</Text>
          <Text className="text-textSecondary text-base">Login to view your anonymous messages</Text>
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
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className="items-end mt-2"
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text className="text-brand font-semibold">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="w-full bg-brand py-4 rounded-xl items-center mt-8 flex-row justify-center shadow-sm"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" className="mr-2" />
          ) : null}
          <Text className="text-white font-bold text-lg">Login</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-8">
          <Text className="text-textSecondary">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-brand font-bold">Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
