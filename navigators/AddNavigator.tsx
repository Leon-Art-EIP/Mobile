import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddPublication from '../screens/AddPublication'

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this Navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="addpublication" component={AddPublication} options={options} />
    </Stack.Navigator>
  );
}

export default HomeNavigator;
