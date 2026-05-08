import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase/config';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent!', [
        { text: 'OK', onPress: () => router.push('/(auth)/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <TouchableOpacity
        className="mt-4 mb-8"
        onPress={() => router.back()}
      >
        <Text className="text-brand font-semibold text-lg">← Back</Text>
      </TouchableOpacity>

      <View className="mb-8">
        <Text className="text-3xl font-extrabold text-text mb-2">Reset Password</Text>
        <Text className="text-textSecondary text-base">Enter your email and we'll send you a link to reset your password.</Text>
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

        <TouchableOpacity
          className="w-full bg-brand py-4 rounded-xl items-center mt-4 flex-row justify-center shadow-sm"
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" className="mr-2" />
          ) : null}
          <Text className="text-white font-bold text-lg">Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
