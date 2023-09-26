import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OtherProfileNavigator from './OtherProfileNavigator';
import React from 'react';

import HomeScreen from '../screens/HomeScreen';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this Navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="homemain" component={HomeScreen} options={options} />
    </Stack.Navigator>
  );
}

export default HomeNavigator;
