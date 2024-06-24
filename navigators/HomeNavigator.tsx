import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import HomeScreen from '../screens/HomeScreen';
import Article from '../screens/Article';
import SingleArt from '../screens/SingleArt';
import OtherProfile from '../screens/OtherProfile';
import Stripe from '../screens/Stripe';
import Notifications from '../screens/Notifications';
import Conversation from '../screens/Conversation';
import Collection from '../screens/Collection';
import ReportScreen from '../screens/ReportScreen';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this Navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="homemain" component={HomeScreen} options={options} />
      <Stack.Screen name="article" component={Article} options={options} />
      <Stack.Screen name="singleart" component={SingleArt} options={options} />
      <Stack.Screen name="other_profile" component={OtherProfile} options={options} />
      <Stack.Screen name="stripe" component={Stripe} options={options} />
      <Stack.Screen name="notifications" component={Notifications} options={options} />
      <Stack.Screen name="single_conversation" component={Conversation} options={options} />
      <Stack.Screen name="collection" component={Collection} options={options} />
      <Stack.Screen name="report" component={ReportScreen} options={options} />
    </Stack.Navigator>
  );
}

export default HomeNavigator;
