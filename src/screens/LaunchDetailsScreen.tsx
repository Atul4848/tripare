import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LaunchpadMap } from '../components/LaunchpadMap';
import { AppText } from '../components/common/AppText';
import { getLaunchpadById } from '../api/spacexApi';
import { Launchpad } from '../api/types';
import  ErrorState  from '../components/common/ErrorState';

type LaunchDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'LaunchDetails'>;

 const LaunchDetailsScreen: React.FC<LaunchDetailsScreenProps> = ({ route }) => {
  const { launch } = route.params;
  const [launchpad, setLaunchpad] = useState<Launchpad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLaunchpadData = async () => {
      if (launch.launchpad) {
        try {
          const launchpadData = await getLaunchpadById(launch.launchpad.id);
          setLaunchpad(launchpadData);
        } catch (err) {
          console.error("Failed to fetch launchpad details:", err);
          setError("Failed to load launchpad details.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("No launchpad ID provided.");
      }
    };

    fetchLaunchpadData();
  }, [launch.launchpad]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => {}} />;
  }

  return (
    <ScrollView style={styles.container}>
      <AppText style={styles.title}>{launch.name}</AppText>
      <AppText style={styles.detail}>Date: {new Date(launch.date_utc).toLocaleDateString()}</AppText>
      <AppText style={styles.detail}>Status: {launch.success ? 'Success' : 'Failure'}</AppText>
      
      {launchpad && (
        <View style={styles.mapContainer}>
          <AppText style={styles.mapTitle}>Launchpad Location</AppText>
          <LaunchpadMap launchpad={launchpad} />
        </View>
      )}
    </ScrollView>
  );
};

export default LaunchDetailsScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  detail: { fontSize: 16, marginBottom: 5 },
  mapContainer: { marginTop: 20 },
  mapTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});