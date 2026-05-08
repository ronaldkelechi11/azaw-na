import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import api from '../../api/client';

export default function PublicReplyPage() {
  const { slug } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['publicProfile', slug],
    queryFn: async () => {
      const res = await api.get(`/users/u/${slug}`);
      return res.data;
    },
    retry: false
  });

  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert('Limit Reached', 'You can only upload up to 4 images per reply.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 4 - images.length,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(a => a.uri);
      setImages(prev => [...prev, ...newImages].slice(0, 4));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!message.trim() && images.length === 0) {
      Alert.alert('Hold on', 'Please write a message or add an image to send.');
      return;
    }

    setSending(true);
    try {
      const formData = new FormData();
      formData.append('recipientSlug', slug as string);
      if (message.trim()) {
        formData.append('message', message.trim());
      }

      // Note: React Native FormData handles files slightly differently than web
      images.forEach((uri, index) => {
        const filename = uri.split('/').pop() || `image${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('images', {
          uri,
          name: filename,
          type
        } as any);
      });

      await api.post('/replies', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      setMessage('');
      setImages([]);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to send your anonymous reply. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#84cc16" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-6xl mb-4">🕵️</Text>
        <Text className="text-2xl font-bold text-text mb-2">User Not Found</Text>
        <Text className="text-textSecondary text-center">This anonymous link might be broken or the user no longer exists.</Text>
      </View>
    );
  }

  if (success) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <View className="w-24 h-24 bg-brand rounded-full items-center justify-center mb-6">
          <Text className="text-white text-4xl">✓</Text>
        </View>
        <Text className="text-2xl font-bold text-text mb-2 text-center">Message Sent Anonymously!</Text>
        <Text className="text-textSecondary text-center mb-8">They will never know who sent it.</Text>
        <TouchableOpacity
          className="bg-brand-light py-4 px-8 rounded-full"
          onPress={() => setSuccess(false)}
        >
          <Text className="text-brand-dark font-bold">Send Another</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-brand rounded-full items-center justify-center mb-4 shadow-sm border-4 border-white">
              <Text className="text-white font-bold text-4xl">{profile.username[0].toUpperCase()}</Text>
            </View>
            <Text className="text-2xl font-extrabold text-text">@{profile.username}</Text>
            <Text className="text-textSecondary mt-1">Send me an anonymous message!</Text>
          </View>

          <View className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <TextInput
              className="min-h-[120px] text-text text-lg leading-relaxed pt-2"
              placeholder="Type your secret message here..."
              placeholderTextColor="#9ca3af"
              multiline
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
              maxLength={500}
            />

            {images.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 mb-2">
                {images.map((uri, idx) => (
                  <View key={idx} className="relative mr-3">
                    <Image source={{ uri }} className="w-24 h-24 rounded-xl" />
                    <TouchableOpacity
                      className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center"
                      onPress={() => removeImage(idx)}
                    >
                      <Text className="text-white text-xs font-bold">✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-surface">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={pickImage}
                  className="bg-brand-light p-3 rounded-full mr-3"
                >
                  <Text className="text-brand-dark text-lg">📷</Text>
                </TouchableOpacity>
                <Text className="text-xs font-medium text-textSecondary">
                  {message.length}/500
                </Text>
              </View>

              <TouchableOpacity
                className={`py-3 px-6 rounded-full flex-row items-center ${sending ? 'bg-gray-300' : 'bg-brand'}`}
                onPress={handleSend}
                disabled={sending}
              >
                {sending ? <ActivityIndicator size="small" color="white" className="mr-2" /> : null}
                <Text className="text-white font-bold text-base">Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
