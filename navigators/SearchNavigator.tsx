import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'react-native';
import Conversation from '../screens/Conversation';
import OtherProfile from '../screens/OtherProfile';
import ResultsScreen from '../screens/ResultsScreen';

import SearchScreen from '../screens/SearchScreen';
import SingleArt from '../screens/SingleArt';

const SearchNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="searchmain" component={SearchScreen} options={options} />
      <Stack.Screen name="results" component={ResultsScreen} options={options} />
      <Stack.Screen name="other_profile" component={OtherProfile} options={options} />
      <Stack.Screen name="single_art" component={SingleArt} options={options} />
      <Stack.Screen name="single_conversation" component={Conversation} options={options} />
    </Stack.Navigator>
  );
}

export default SearchNavigator;
