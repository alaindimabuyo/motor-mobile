import React, { useEffect, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.iconContainer, { opacity: fadeAnim }]}>
        <Ionicons name="car-outline" size={80} color="#007bff" />
      </Animated.View>
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <ThemedText type="title" style={styles.header}>MotorPlatform</ThemedText>
        <ThemedText style={styles.description}>
          At MotorPlatform, we transform automotive dealerships by simplifying and amplifying wholesale operations. We partner with independent, franchise, and large dealer groups.
        </ThemedText>
        <ThemedText style={styles.subheader}>Our Values</ThemedText>
        <ThemedText style={styles.description}>
          Integrity, Collaboration, Excellence. We build trust and transparency, tailor solutions to client needs, and continually push boundaries to deliver stellar service and unmatched user experiences.
        </ThemedText>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    color: '#007bff',
    marginBottom: 15,
  },
  subheader: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    textAlign: 'left',
  },
});