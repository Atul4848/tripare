import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  LaunchesListScreen  from '../screens/LaunchListScreen';
import  LaunchDetailsScreen  from '../screens/LaunchDetailsScreen';
import { Launch } from '../api/types'; 

export type RootStackParamList = {
  LaunchesList: undefined;
  LaunchDetails: { launch: Launch };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

 const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LaunchesList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="LaunchesList"
          component={LaunchesListScreen} // Use the correct component here
          options={{ title: 'SpaceX Launches' }}
        />
        <Stack.Screen
          name="LaunchDetails"
          component={LaunchDetailsScreen} // Use the correct component here
          options={({ route }) => ({ title: route.params.launch.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator