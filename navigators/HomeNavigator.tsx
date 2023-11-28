import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import HomeScreen from '../screens/HomeScreen';
import OtherProfile from '../screens/OtherProfile';
import Login from '../screens/Login';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this Navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="homemain" component={HomeScreen} options={options} />
      <Stack.Screen name="other_profile" component={OtherProfile} options={options} />
      <Stack.Screen name="login" component={Login} options={options} />
    </Stack.Navigator>
  );
}

export default HomeNavigator;
