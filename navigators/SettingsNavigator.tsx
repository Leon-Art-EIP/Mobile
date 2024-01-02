import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Settings from '../screens/Settings/Settings';
import GeneralConditions from '../screens/Settings/GeneralConditions';
import PasswordAndSecurity from '../screens/Settings/PasswordAndSecurity';
import PersonalInformations from '../screens/Settings/PersonalInformations';


const SettingsNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables headers for this navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="settings" component={Settings} options={options} />
      <Stack.Screen name="personal_informations" component={PersonalInformations} options={options} />
      <Stack.Screen name="password_and_security" component={PasswordAndSecurity} options={options} />
      <Stack.Screen name="general_conditions" component={GeneralConditions} options={options} />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;

