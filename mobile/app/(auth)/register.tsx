import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase/config';
import { useAuthStore } from '../../store/authStore';
import AnimatedBackground from '../../components/AnimatedBackground';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

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
    <View className="flex-1 bg-background">
      <AnimatedBackground />
      
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 px-8"
        >
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
            
            <Text className="text-4xl font-black text-text mb-2 tracking-tight">New Shadow</Text>
            <Text className="text-textSecondary text-lg font-medium">Create your untraceable presence.</Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400)}
            className="space-y-6"
          >
            <View className="space-y-2">
              <Text className="text-textSecondary font-bold uppercase tracking-widest text-xs ml-1">Secure Email</Text>
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                </View>
                <TextInput
                  className="w-full bg-surface/50 border border-text/10 py-5 pl-12 pr-5 rounded-2xl text-text font-medium"
                  placeholder="alias@shadow.com"
                  placeholderTextColor="#475569"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-textSecondary font-bold uppercase tracking-widest text-xs ml-1">Private Cipher</Text>
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                </View>
                <TextInput
                  className="w-full bg-surface/50 border border-text/10 py-5 pl-12 pr-5 rounded-2xl text-text font-medium"
                  placeholder="Min. 8 characters"
                  placeholderTextColor="#475569"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>
            
            <Text className="text-textSecondary/60 text-xs px-2 italic">
              By initializing, you agree to the shadow protocols. Your data is encrypted and anonymous.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)}>
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-full bg-brand py-5 rounded-2xl items-center mt-10 flex-row justify-center shadow-lg shadow-brand/20"
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0a0a0a" className="mr-3" />
              ) : (
                <Ionicons name="person-add-outline" size={24} color="#0a0a0a" className="mr-2" />
              )}
              <Text className="text-background font-black text-xl">Create Identity</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-10 items-center">
              <View className="h-[1px] flex-1 bg-text/10" />
              <Text className="text-textSecondary px-4 font-medium">Known Entity?</Text>
              <View className="h-[1px] flex-1 bg-text/10" />
            </View>
            
            <TouchableOpacity 
              className="mt-6 py-4 items-center"
              onPress={() => router.push('/(auth)/login')}
            >
              <Text className="text-text font-bold text-lg">Identity Verification</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
