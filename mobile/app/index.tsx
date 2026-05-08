import { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#84cc16" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href="/(dashboard)/home" />;
}
