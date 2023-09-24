import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Settings from '../screens/Settings';


const SettingsNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables headers for this navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="settingsmain" component={Settings} options={options} />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;

