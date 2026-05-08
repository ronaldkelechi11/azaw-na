import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-between px-6 pb-12 pt-20">
      <View className="items-center mt-12">
        <View className="w-24 h-24 bg-brand-light rounded-3xl items-center justify-center mb-6 shadow-sm">
          {/* Using text as placeholder for logo */}
          <Text className="text-brand font-extrabold text-4xl">A</Text>
        </View>
        <Text className="text-4xl font-extrabold text-text mb-3">Azaw Na</Text>
        <Text className="text-textSecondary text-center text-lg px-4 leading-relaxed">
          Express yourself freely. Send and receive anonymous messages with ease.
        </Text>
      </View>

      <View className="w-full space-y-4">
        <TouchableOpacity
          className="w-full bg-brand py-4 rounded-2xl items-center shadow-sm"
          onPress={() => router.push('/(auth)/register')}
        >
          <Text className="text-white font-bold text-lg">Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-surface py-4 rounded-2xl items-center"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-text font-bold text-lg">Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
