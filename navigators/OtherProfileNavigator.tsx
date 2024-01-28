import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OtherProfile from '../screens/OtherProfile';
import Conversation from "../screens/Conversation";
import SingleArt from '../screens/SingleArt';

const OtherProfileNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="other_profile" component={OtherProfile} options={options} />
      <Stack.Screen name="single_conversation" component={Conversation} options={options} />
    </Stack.Navigator>
  );
}

export default OtherProfileNavigator;

