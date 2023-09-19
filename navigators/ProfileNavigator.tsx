import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import InboxScreen from "../screens/InboxScreen";
import Conversation from "../screens/Conversation";



import ProfileScreen from '../screens/Profile';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="profilemain" component={ProfileScreen} options={options} />
    </Stack.Navigator>
      // <Stack.Navigator>

      //   <Stack.Screen
      //     name="inbox"
      //     component={InboxScreen}
      //     options={options}
      //   />
  
      //   <Stack.Screen
      //     name="single_conversation"
      //     component={Conversation}
      //     options={options}
      //   />
  
      // </Stack.Navigator>
  );
}

export default ProfileNavigator;

