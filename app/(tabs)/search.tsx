import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const SERVICES = [
  { id: 1, label: 'Graphics & Design', desc: 'Logo & Branding, Art & Illustrations...', icon: 'brush' as const, image: null },
  { id: 2, label: 'Tech & Development', desc: 'Website Development, App...', icon: 'laptop' as const, image: null },
  { id: 3, label: 'Music & Audio', desc: 'Sound Production, Sound Editing...', icon: 'musical-notes' as const, image: null },
  { id: 4, label: 'Visual Media', desc: 'Video Editing, Motion Graphics, Animation...', icon: 'play-circle' as const, image: null },
  { id: 5, label: 'Marketing & Growth', desc: 'Social Media Management, SEO...', icon: 'megaphone' as const, image: null },
  { id: 6, label: 'Writing & Content', desc: 'Creative Writing, Editing & Proofreading', icon: 'document-text' as const, image: null },
];

const TOP_CREATORS = [
  { 
    id: 1, 
    name: 'Rifqi Arkaanul', 
    title: 'Graphic Designer',
    verified: true, 
    followers: 154,
    bio: 'Hi! am Rifqi Arkaanul! I am a Graphic Designer.',
    rating: 4.0,
    skills: ['Graphic Designer', 'Photo Editing'],
    price: '50K',
    image: null
  },
  { 
    id: 2, 
    name: 'John Doe',
    title: 'UI/UX Designer', 
    verified: true, 
    followers: 125,
    bio: 'Hi! am John Doe! I am a UI/UX Designer.',
    rating: 4.5,
    skills: ['Graphic Designer', 'UI/UX Designer'],
    price: '45K',
    image: null
  },
  { 
    id: 3, 
    name: 'Jane Doe',
    title: 'Web Developer',
    verified: true, 
    followers: 115,
    bio: 'Hello, I am a student working as a freelancer to support my studies.',
    rating: 3.5,
    skills: ['Web Developer', 'UI/UX Designer'],
    price: '40K',
    image: null
  },
  { 
    id: 4, 
    name: 'Mary Jane',
    title: 'Brand Designer',
    verified: true, 
    followers: 98,
    bio: 'Creative designer passionate about modern UI/UX.',
    rating: 3.0,
    skills: ['Graphic Designer', 'Branding'],
    price: '55K',
    image: null
  },
];

const CARD_GAP = 12;
const HORIZONTAL_PADDING = 24;

export default function SearchScreen() {
  const [activeTab, setActiveTab] = useState('services');
  const [pressedService, setPressedService] = useState<number | null>(null);
  const [pressedCreator, setPressedCreator] = useState<number | null>(null);
  
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - (HORIZONTAL_PADDING * 2) - CARD_GAP) / 2;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#7F8386" />
            <TextInput
              placeholder={activeTab === 'services' ? 'Search services...' : 'Search creators...'}
              placeholderTextColor="#7F8386"
              style={styles.searchInput}
            />
            <Pressable style={styles.filterButton}>
              <Ionicons name="options" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tabButton, activeTab === 'services' && styles.tabButtonActive]}
            onPress={() => setActiveTab('services')}
          >
            <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>Services</Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'creators' && styles.tabButtonActive]}
            onPress={() => setActiveTab('creators')}
          >
            <Text style={[styles.tabText, activeTab === 'creators' && styles.tabTextActive]}>Creators</Text>
          </Pressable>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'services' ? (
          <View style={styles.gridContainer}>
            {SERVICES.map((service, index) => (
              <Pressable 
                key={service.id} 
                style={[
                  styles.serviceCard,
                  { 
                    width: cardWidth,
                    marginRight: index % 2 === 0 ? CARD_GAP : 0,
                    marginBottom: CARD_GAP,
                  },
                  pressedService === service.id && styles.serviceCardPressed,
                ]}
                onPressIn={() => setPressedService(service.id)}
                onPressOut={() => setPressedService(null)}
              >
                <Ionicons 
                  name={service.icon} 
                  size={36} 
                  color="#3b82f6" 
                />
                <Text style={styles.serviceTitle}>{service.label}</Text>
                <Text style={styles.serviceDesc} numberOfLines={2}>{service.desc}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View>
            {/* TOP RATED CREATORS HEADER */}
            <View style={styles.sectionHeader}>
              <Ionicons name="trophy" size={20} color="#3b82f6" />
              <Text style={styles.sectionTitle}>Top Rated Creators</Text>
            </View>

            {/* CREATORS LIST */}
            {TOP_CREATORS.map((creator) => (
              <Pressable 
                key={creator.id} 
                style={[
                  styles.creatorCard,
                  pressedCreator === creator.id && styles.creatorCardPressed,
                ]}
                onPressIn={() => setPressedCreator(creator.id)}
                onPressOut={() => setPressedCreator(null)}
              >
                <View style={styles.creatorCardInner}>
                  <View style={styles.creatorTopRow}>
                    <View style={styles.creatorImagePlaceholder}>
                      <Text style={styles.placeholderText}>Image</Text>
                    </View>
                    
                    <View style={styles.creatorInfo}>
                      <View style={styles.creatorHeader}>
                        <View style={styles.creatorNameRow}>
                          <Text style={styles.creatorName}>{creator.name}</Text>
                          {creator.verified && (
                            <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                          )}
                        </View>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={16} color="#fbbf24" />
                          <Text style={styles.ratingText}>{creator.rating}</Text>
                        </View>
                      </View>
                      
                      <Text style={styles.creatorTitle} numberOfLines={1}>
                        {creator.title}
                      </Text>

                      <View style={styles.followersRow}>
                        <Ionicons name="people" size={14} color="#9ca3af" />
                        <Text style={styles.followersText}>{creator.followers} followers</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.creatorBio} numberOfLines={2}>
                    {creator.bio}
                  </Text>

                  <View style={styles.skillsContainer}>
                    {creator.skills.map((skill, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  headerContainer: { backgroundColor: '#1D1D1D', paddingBottom: 0 },
  header: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 30 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },

  searchContainer: { 
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  searchBar: {
    backgroundColor: '#0D0D0D',
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#fff', fontSize: 16 },
  filterButton: { padding: 4 },

  tabsContainer: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#3b82f6',
  },
  tabText: { color: '#9ca3af', fontSize: 15, fontWeight: '600' },
  tabTextActive: { color: '#3b82f6' },

  scrollContent: { paddingHorizontal: 24, paddingVertical: 20 },

  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
  },
  serviceCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 24,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCardPressed: {
    backgroundColor: '#1a1a1a',
  },
  serviceTitle: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '600', 
    textAlign: 'center', 
    marginTop: 12, 
    marginBottom: 6,
  },
  serviceDesc: { 
    color: '#9ca3af', 
    fontSize: 11, 
    textAlign: 'center',
    lineHeight: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  creatorCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  creatorCardPressed: {
    backgroundColor: '#1a1a1a',
  },
  creatorCardInner: {
    flex: 1,
  },
  creatorTopRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  creatorImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { 
    color: '#9ca3af',
    fontSize: 11,
  },
  creatorInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-start',
  },
  creatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  creatorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  creatorName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  creatorTitle: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  followersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  followersText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  creatorBio: {
    color: '#9ca3af',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#1D1D1D',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  skillText: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '500',
  },
});