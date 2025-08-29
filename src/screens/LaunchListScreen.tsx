import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, TextInput, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LaunchCard } from '../components/LaunchCard';
import { getLaunches } from '../api/spacexApi';
import { Launch } from '../api/types';
import { RootStackParamList } from '../navigation/AppNavigator';
import ErrorState from '../components/common/ErrorState';

type LaunchesListScreenProps = NativeStackScreenProps<RootStackParamList, 'LaunchesList'>;
type LaunchesListNavigationProp = NavigationProp<RootStackParamList, 'LaunchesList'>;

const LaunchesListScreen: React.FC<LaunchesListScreenProps> = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigation = useNavigation<LaunchesListNavigationProp>();

  const fetchLaunches = useCallback(async (isRefresh = false) => {
    try {
      setError(null);
      const newLaunches = await getLaunches(isRefresh ? 1 : page, 10);
      
      const updatedLaunches = isRefresh ? newLaunches : [...launches, ...newLaunches];
      // Use a Map to filter for unique items based on their 'id'
      const uniqueLaunches = Array.from(new Map(updatedLaunches.map(item => [item.id, item])).values());
      
      setLaunches(uniqueLaunches);
      if (!isRefresh) {
        setPage(prev => prev + 1);
      } else {
        setPage(2);
      }
    } catch (err) {
      console.error('Failed to fetch launches:', err);
      setError('Failed to load launches. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, launches]);

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLaunches(true);
  }, [fetchLaunches]);

  const filteredLaunches = useMemo(() => {
    return launches.filter(launch => 
      launch.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, launches]);

  const renderItem = useCallback(({ item }: { item: Launch }) => (
    <LaunchCard 
      launch={item} 
      onPress={() => navigation.navigate('LaunchDetails', { launch: item })} 
    />
  ), [navigation]);

  if (error) {
    return <ErrorState message={error} onRetry={onRefresh} />;
  }

  if (loading && launches.length === 0) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search missions..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      {filteredLaunches.length === 0 && !loading ? (
        <ErrorState message="No launches found." onRetry={onRefresh} />
      ) : (
        <FlatList
          data={filteredLaunches}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={() => {
            if (!loading) {
              fetchLaunches();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default LaunchesListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchBar: { padding: 10, margin: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  loading: { flex: 1, justifyContent: 'center' }
});