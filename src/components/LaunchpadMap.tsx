import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Platform, Linking, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Launchpad } from '../api/types';
import { AppText } from './common/AppText';

interface Props {
  launchpad: Launchpad;
}

export const LaunchpadMap: React.FC<Props> = ({ launchpad }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Cannot show your location on the map.');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const openNativeMaps = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const lat = launchpad.latitude;
    const lng = launchpad.longitude;
    const label = encodeURIComponent(launchpad.name);
    const url = Platform.select({
      ios: `${scheme}${label}@${lat},${lng}`,
      android: `${scheme}${lat},${lng}(${label})`
    });

    if (url) {
      Linking.openURL(url).catch(err => {
        console.error('An error occurred opening native maps:', err);
        Alert.alert('Error', 'Could not open native maps app.');
      });
    }
  };

  const initialRegion = {
    latitude: launchpad.latitude,
    longitude: launchpad.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <AppText style={styles.errorText}>{errorMsg}</AppText>
      ) : (
        <MapView style={styles.map} initialRegion={initialRegion}>
          <Marker
            coordinate={{ latitude: launchpad.latitude, longitude: launchpad.longitude }}
            title={launchpad.full_name}
            description={launchpad.locality}
            pinColor="red"
          />
          {location && (
            <Marker
              coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
              title="Your Location"
              pinColor="blue"
            />
          )}
        </MapView>
      )}
      <Button title="Get Directions" onPress={openNativeMaps} disabled={!launchpad.latitude} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 400, width: '100%', borderRadius: 10, overflow: 'hidden' },
  map: { width: '100%', height: '85%' },
  errorText: { textAlign: 'center', margin: 20 },
});