import { Stack } from 'expo-router';

export default function PublicProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[slug]" />
    </Stack>
  );
}
