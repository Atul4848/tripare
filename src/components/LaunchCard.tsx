import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Launch } from '../api/types';
import { AppText } from './common/AppText';

interface LaunchCardProps {
  launch: Launch;
  onPress: () => void;
}

const LaunchCardComponent: React.FC<LaunchCardProps> = ({ launch, onPress }) => {
  const getStatusColor = (success: boolean): string => {
    return success ? '#28a745' : '#dc3545';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {launch.links.patch.small ? (
          <Image
            source={{ uri: launch.links.patch.small }}
            style={styles.patchImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>
      <View style={styles.infoContainer}>
        <AppText style={styles.missionName}>{launch.name}</AppText>
        <AppText style={styles.launchDate}>
          {new Date(launch.date_utc).toLocaleDateString()}
        </AppText>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(!!launch.success) }]} />
          <AppText style={styles.statusText}>
            {launch.success ? 'Success' : 'Failure'}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const LaunchCard = memo(LaunchCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patchImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  missionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  launchDate: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});