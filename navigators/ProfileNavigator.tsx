import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Profile from '../screens/Profile';
import FollowerList from '../screens/FollowerList';
import Settings from '../screens/Settings/Settings';
import GeneralConditions from '../screens/Settings/GeneralConditions';
import PasswordAndSecurity from '../screens/Settings/PasswordAndSecurity';
import PersonalInformations from '../screens/Settings/PersonalInformations';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="profile" component={Profile} options={options} />
      <Stack.Screen name="follower_list" component={FollowerList} options={options} />
      <Stack.Screen name="settings" component={Settings} options={options} />
      <Stack.Screen name="personal_informations" component={PersonalInformations} options={options} />
      <Stack.Screen name="password_and_security" component={PasswordAndSecurity} options={options} />
      <Stack.Screen name="general_conditions" component={GeneralConditions} options={options} />
    </Stack.Navigator>
  );
}

export default ProfileNavigator;

