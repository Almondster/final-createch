import { REMEMBER_KEY } from '@/constants/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const SERVICES = [
  { id: 1, label: 'Graphics & Design', image: null },
  { id: 2, label: 'Tech & Development', image: null },
  { id: 3, label: 'Music & Audio', image: null },
  { id: 4, label: 'Visual Media', image: null },
];

const FEATURED_CREATORS = [
  { id: 1, name: 'Jane Doe', title: 'UI/UX Designer', rating: 4.5, image: null },
  { id: 2, name: 'John Doe', title: 'UI/UX Designer', rating: 4.5, image: null },
];

const RECENTLY_MATCHED = [
  {
    id: 1,
    name: 'Jane Doe',
    title: 'UI/UX Designer',
    rating: 4.5,
    price: '50K',
    image: null,
    thumbnail: null,
    description: 'Website UI/UX design for your business',
  },
  {
    id: 2,
    name: 'John Doe',
    title: 'UI/UX Designer',
    rating: 4.5,
    price: '50K',
    image: null,
    thumbnail: null,
    description: 'Mobile UI/UX design for your business',
  },
];

export default function HomeScreen({ userName = null }) {
  const router = useRouter();
  const [pressedService, setPressedService] = useState<number | null>(null);
  const [pressedMatch, setPressedMatch] = useState<number | null>(null);
  const [pressedCreator, setPressedCreator] = useState<number | null>(null);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync(REMEMBER_KEY);
            router.replace('/');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
            console.error(error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.logo}>
              CREA<Text style={styles.logoBlue}>TECH</Text>
            </Text>
            <Pressable onPress={handleSignOut} style={styles.signOutButton}>
              <Ionicons name="log-out" size={24} color="#fff" />
            </Pressable>
          </View>

          <Text style={styles.greeting}>
            Hello, {userName || 'Anon'} — Welcome back.
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#7F8386" />
            <TextInput
              placeholder="Search services"
              placeholderTextColor="#7F8386"
              style={styles.searchInput}
            />
          </View>
        </View>
      </View>

      {/* SCROLL CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollArea}
      >
        {/* SERVICES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services Category</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContainer}
          >
            {SERVICES.map((service) => (
              <Pressable
                key={service.id}
                style={[
                  styles.serviceCard,
                  pressedService === service.id && styles.serviceCardPressed,
                ]}
                onPressIn={() => setPressedService(service.id)}
                onPressOut={() => setPressedService(null)}
              >
                <View style={styles.serviceTopPlaceholder}>
                  <Text style={styles.placeholderText}>Preview</Text>
                </View>

                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceLabel} numberOfLines={2}>
                    {service.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* RECENTLY MATCHED */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Matched With</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContainer}
          >
            {RECENTLY_MATCHED.map((item) => (
              <Pressable
                key={item.id}
                style={[
                  styles.matchCard,
                  pressedMatch === item.id && styles.matchCardPressed,
                ]}
                onPressIn={() => setPressedMatch(item.id)}
                onPressOut={() => setPressedMatch(null)}
              >
                <View style={styles.matchImagePlaceholder}>
                  <Text style={styles.matchImageLabel}>Image</Text>
                </View>

                <View style={styles.matchInfo}>
                  <View style={styles.matchHeaderRow}>
                    <View style={styles.matchAvatarPlaceholder}>
                      <Text style={styles.avatarText}>A</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.matchName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.matchTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.matchDesc} numberOfLines={2}>
                    {item.description}
                  </Text>

                  <View style={styles.matchFooterRow}>
                    <Ionicons name="star" size={14} color="#3b82f6" />
                    <Text style={styles.matchRating}>{item.rating}</Text>
                    <Text style={styles.matchPrice}>₱ {item.price}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* TOP CREATORS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Creators</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContainer}
          >
            {FEATURED_CREATORS.map((creator) => (
              <Pressable
                key={creator.id}
                style={[
                  styles.creatorCard,
                  pressedCreator === creator.id && styles.creatorCardPressed,
                ]}
                onPressIn={() => setPressedCreator(creator.id)}
                onPressOut={() => setPressedCreator(null)}
              >
                <View style={styles.creatorTopPlaceholder}>
                  <Text style={styles.placeholderText}>Image</Text>
                </View>

                <View style={styles.creatorInfo}>
                  <View style={styles.creatorRow}>
                    <Text style={styles.creatorName}>{creator.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }}>
                      <Ionicons name="star" size={14} color="#3b82f6" />
                      <Text style={styles.creatorRating}>{creator.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.creatorTitle}>{creator.title}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  headerContainer: { backgroundColor: '#1D1D1D', paddingBottom: 24 },
  header: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  logo: { color: '#fff', fontSize: 22, fontWeight: '700' },
  logoBlue: { color: '#3b82f6' },
  signOutButton: { padding: 8 },
  greeting: { color: '#9ca3af', fontSize: 14 },

  searchContainer: { paddingHorizontal: 24 },
  searchBar: {
    backgroundColor: '#0D0D0D',
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#fff', fontSize: 16 },

  scrollArea: {
    backgroundColor: '#000',
    paddingBottom: 20,
  },

  section: { paddingHorizontal: 24, paddingTop: 26 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  seeAll: { color: '#3b82f6', fontSize: 14 },

  horizontalContainer: {
    paddingRight: 24,
    paddingVertical: 6,
  },

  /* SERVICE CARDS */
  serviceCard: {
    backgroundColor: '#111',
    width: 240,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
  },
  serviceCardPressed: {
    backgroundColor: '#1a1a1a',
  },
  serviceTopPlaceholder: {
    height: 140,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#9ca3af' },
  serviceInfo: { padding: 14 },
  serviceLabel: { color: '#fff', fontSize: 15, fontWeight: '600' },

  /* RECENTLY MATCHED */
  matchCard: {
    width: 260,
    backgroundColor: '#111',
    marginRight: 16,
    borderRadius: 18,
    overflow: 'hidden',
  },
  matchCardPressed: {
    backgroundColor: '#1a1a1a',
  },
  matchImagePlaceholder: {
    height: 140,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchImageLabel: { color: '#9ca3af' },
  matchInfo: { padding: 14 },

  matchHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  matchAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700' },

  matchName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  matchTitle: { color: '#9ca3af', fontSize: 12 },

  matchDesc: { color: '#fff', fontSize: 13, marginTop: 6, marginBottom: 8 },

  matchFooterRow: { flexDirection: 'row', alignItems: 'center' },
  matchRating: { color: '#3b82f6', marginLeft: 6, fontSize: 13 },
  matchPrice: { color: '#fff', marginLeft: 10, fontSize: 13 },

  /* TOP CREATORS */
  creatorCard: {
    width: 180,
    backgroundColor: '#111',
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  creatorCardPressed: {
    backgroundColor: '#1a1a1a',
  },
  creatorTopPlaceholder: {
    height: 110,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorInfo: { padding: 12 },
  creatorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  creatorName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  creatorRating: { color: '#3b82f6', marginLeft: 4, fontSize: 13 },
  creatorTitle: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
});