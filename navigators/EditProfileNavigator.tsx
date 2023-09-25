import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import EditProfile from '../screens/EditProfile';


const EditProfileNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables headers for this navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="editprofilemain" component={EditProfile} options={options} />
    </Stack.Navigator>
  );
}

export default EditProfileNavigator;

