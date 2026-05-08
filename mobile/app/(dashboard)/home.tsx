import { View, Text, ScrollView, TouchableOpacity, Share, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import api from '../../api/client';
import { useAuthStore } from '../../store/authStore';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/users/profile');
      return res.data;
    },
  });

  const { data: replies, isLoading: isRepliesLoading } = useQuery({
    queryKey: ['replies'],
    queryFn: async () => {
      const res = await api.get('/replies');
      return res.data;
    },
  });

  const deleteReplyMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/replies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies'] });
    },
    onError: () => {
      Alert.alert('Error', 'Failed to delete reply');
    }
  });

  const handleShare = async () => {
    if (!profile) return;
    const link = `https://azawna.com/u/${profile.slug}`;
    try {
      await Share.share({
        message: `Send me an anonymous message! ${link}`,
        url: link, // For iOS
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = async () => {
    if (!profile) return;
    const link = `https://azawna.com/u/${profile.slug}`;
    await Clipboard.setStringAsync(link);
    Alert.alert('Success', 'Profile link copied to clipboard!');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Reply', 'Are you sure you want to delete this reply?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteReplyMutation.mutate(id) },
    ]);
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome');
  };

  if (isProfileLoading || isRepliesLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#84cc16" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row justify-between items-center py-4 mt-2">
          <Text className="text-2xl font-extrabold text-text">Dashboard</Text>
          <TouchableOpacity onPress={handleLogout} className="bg-white px-4 py-2 rounded-full shadow-sm">
            <Text className="text-textSecondary font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6 mt-2">
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-brand-light rounded-full items-center justify-center mb-3">
              <Text className="text-brand font-bold text-2xl">{profile?.username?.[0]?.toUpperCase() || 'A'}</Text>
            </View>
            <Text className="text-xl font-bold text-text">{profile?.username}</Text>
            <Text className="text-textSecondary">{profile?.replyCount || 0} Total Replies</Text>
          </View>

          <View className="bg-surface rounded-xl p-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-xs text-textSecondary mb-1 font-semibold uppercase">Your Anonymous Link</Text>
              <Text className="text-text font-medium" numberOfLines={1}>azawna.com/u/{profile?.slug}</Text>
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity onPress={handleCopy} className="bg-white p-2 rounded-lg shadow-sm">
                <Text className="text-text">📋</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} className="bg-brand p-2 rounded-lg shadow-sm">
                <Text className="text-white">🚀</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Replies Section */}
        <Text className="text-lg font-bold text-text mb-4 px-2">Recent Replies</Text>

        {replies?.length === 0 ? (
          <View className="bg-white rounded-3xl p-8 items-center justify-center shadow-sm border border-gray-100 border-dashed">
            <Text className="text-4xl mb-4">📭</Text>
            <Text className="text-text font-semibold text-lg mb-2">No replies yet</Text>
            <Text className="text-textSecondary text-center">Share your link to start receiving anonymous messages!</Text>
            <TouchableOpacity onPress={handleShare} className="mt-6 bg-brand px-6 py-3 rounded-full">
              <Text className="text-white font-bold">Share Link</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4 pb-20">
            {replies?.map((reply: any) => (
              <View key={reply._id} className="bg-white p-5 rounded-2xl shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <Text className="text-textSecondary text-xs font-medium">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </Text>
                  <TouchableOpacity onPress={() => handleDelete(reply._id)}>
                    <Text className="text-red-400">🗑️</Text>
                  </TouchableOpacity>
                </View>

                {reply.message ? (
                  <Text className="text-text text-base leading-relaxed mb-3">{reply.message}</Text>
                ) : null}

                {reply.images && reply.images.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
                    {reply.images.map((img: string, i: number) => (
                      <Image
                        key={i}
                        source={{ uri: img }}
                        className="w-32 h-32 rounded-xl mr-2 bg-surface"
                      />
                    ))}
                  </ScrollView>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 w-14 h-14 bg-brand rounded-full items-center justify-center shadow-md shadow-brand/50"
        onPress={handleShare}
      >
        <Text className="text-white text-2xl">🔗</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
