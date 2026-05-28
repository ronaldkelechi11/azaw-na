import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedBackground from '../../components/AnimatedBackground';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <AnimatedBackground />
      
      <SafeAreaView className="flex-1 items-center justify-between px-8 pb-12 pt-20">
        <Animated.View 
          entering={FadeIn.delay(300).duration(1000)}
          className="items-center mt-12"
        >
          <View className="w-28 h-28 bg-brand/10 border border-brand/20 rounded-4xl items-center justify-center mb-8 shadow-2xl">
            <View className="w-16 h-16 bg-brand rounded-full items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.5)]">
              <Text className="text-background font-black text-4xl">A</Text>
            </View>
          </View>
          
          <Text className="text-5xl font-black text-text tracking-tighter mb-4">
            Azaw Na
          </Text>
          <View className="h-1 w-12 bg-brand rounded-full mb-6" />
          
          <Text className="text-textSecondary text-center text-xl px-4 leading-relaxed font-medium">
            Whisper in the dark.{"\n"}
            <Text className="text-brand">Anonymous.</Text> Secure. Untraceable.
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(600).duration(800)}
          className="w-full space-y-4"
        >
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-full bg-brand py-5 rounded-2xl items-center shadow-lg shadow-brand/20"
            onPress={() => router.push('/(auth)/register')}
          >
            <Text className="text-background font-bold text-xl">Join the Shadow</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="w-full bg-surface/50 border border-text/10 py-5 rounded-2xl items-center"
            onPress={() => router.push('/(auth)/login')}
          >
            <Text className="text-text font-bold text-xl">Identity Verification</Text>
          </TouchableOpacity>
          
          <Text className="text-textSecondary/50 text-center text-sm mt-4 italic">
            Enter the void at your own risk.
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
