import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Profile from '../screens/Profile';
import FollowerList from '../screens/FollowerList';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="profile" component={Profile} options={options} />
      <Stack.Screen name="follower_list" component={FollowerList} options={options} />
    </Stack.Navigator>
  );
}

export default ProfileNavigator;

