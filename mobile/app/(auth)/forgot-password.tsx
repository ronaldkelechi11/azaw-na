import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase/config';
import AnimatedBackground from '../../components/AnimatedBackground';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

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
      Alert.alert('Protocol Initiated', 'A recovery cipher has been sent to your email.', [
        { text: 'Understood', onPress: () => router.push('/(auth)/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AnimatedBackground />
      
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-8">
          <Animated.View 
            entering={FadeIn.delay(200)}
            className="mt-8 mb-12"
          >
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-12 h-12 bg-surface/50 rounded-full items-center justify-center border border-text/10 mb-8"
            >
              <Ionicons name="arrow-back" size={24} color="#f8fafc" />
            </TouchableOpacity>
            
            <Text className="text-4xl font-black text-text mb-2 tracking-tight">Lost Cipher</Text>
            <Text className="text-textSecondary text-lg font-medium">Request a new key for your identity.</Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400)}
            className="space-y-6"
          >
            <View className="space-y-2">
              <Text className="text-textSecondary font-bold uppercase tracking-widest text-xs ml-1">Recovery Email</Text>
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                </View>
                <TextInput
                  className="w-full bg-surface/50 border border-text/10 py-5 pl-12 pr-5 rounded-2xl text-text font-medium"
                  placeholder="The one you used to vanish"
                  placeholderTextColor="#475569"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              className="w-full bg-brand py-5 rounded-2xl items-center mt-6 flex-row justify-center shadow-lg shadow-brand/20"
              onPress={handleReset}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0a0a0a" className="mr-3" />
              ) : (
                <Ionicons name="send-outline" size={22} color="#0a0a0a" className="mr-2" />
              )}
              <Text className="text-background font-black text-xl">Recover Identity</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}
