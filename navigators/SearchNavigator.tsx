import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import SearchScreen from '../screens/SearchScreen';

const SearchNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="searchmain" component={SearchScreen} options={options} />
    </Stack.Navigator>
  );
}

export default SearchNavigator;
