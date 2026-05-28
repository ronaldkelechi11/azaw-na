import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
// import { BlurView } from 'expo-blur';

const Shape = ({ size, color, duration, initialPos }: any) => {
  const tx = useSharedValue(initialPos.x);
  const ty = useSharedValue(initialPos.y);

  useEffect(() => {
    tx.value = withRepeat(
      withTiming(initialPos.x + 40, { duration, easing: Easing.linear }),
      -1,
      true
    );
    ty.value = withRepeat(
      withTiming(initialPos.y + 40, { duration, easing: Easing.linear }),
      -1,
      true
    );
  }, [duration, initialPos.x, initialPos.y]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
    ],
  }));

  return (
    <Animated.View 
      style={[
        styles.shape, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2, 
          backgroundColor: color,
          opacity: 0.6 
        },
        animatedStyle
      ]} 
    />
  );
};

export default function AnimatedBackground() {
  return (
    <View style={StyleSheet.absoluteFill} className="bg-background overflow-hidden">
      <Shape 
        size={350} 
        color="rgba(163, 230, 53, 0.2)" 
        duration={8000} 
        initialPos={{ x: -100, y: -100 }} 
      />
      <Shape 
        size={300} 
        color="rgba(139, 92, 246, 0.15)" 
        duration={10000} 
        initialPos={{ x: 200, y: 450 }} 
      />
      
      {/* Temporarily disabled to debug crash
      <BlurView 
        intensity={80} 
        tint="dark" 
        style={StyleSheet.absoluteFill} 
      /> 
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  shape: {
    position: 'absolute',
  }
});
