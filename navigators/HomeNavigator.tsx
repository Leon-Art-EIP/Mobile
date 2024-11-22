import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';

import HomeScreen from '../screens/HomeScreen';
import Article from '../screens/Article';
import SingleArt from '../screens/SingleArt';
import OtherProfile from '../screens/OtherProfile';
import Notifications from '../screens/Notifications';
import Conversation from '../screens/Conversation';
import Collection from '../screens/Collection';
import ReportScreen from '../screens/ReportScreen';
import SingleOrder from '../screens/SingleOrder';
import SinglePost from '../screens/SinglePost';
import ArticlesList from '../screens/ArticleList';
import { Linking } from 'react-native';
import StripeAccountValidated from '../screens/Redirections/StripeAccountValidated';
import { useNavigation } from '@react-navigation/native';
import PaymentValidated from '../screens/Redirections/PaymentValidated';
import PaymentFailed from '../screens/Redirections/PaymentFailed';


interface RedirectType {
  uri: string;
  routeName: string;
}


const REDIRECTIONS: RedirectType[] = [
  { uri: 'stripe-linked', routeName: 'stripe_validated' },
  { uri: 'payment-success', routeName: 'order_succeed' },
  { uri: 'payment-canceled', routeName: 'order_canceled' }
];

const BASEURL: string = "myapp://";


const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();


  // disables header for this Navigator
  const options = { headerShown: false };


  useEffect(() => {
    // Check if this is a redirection
    Linking.getInitialURL()
    .then((url: string | null) => {
      REDIRECTIONS.some((red: RedirectType) => {
        if (url === BASEURL + red.uri) {
          navigation.navigate(red.routeName as never);
          return true;
        }
        return false;
      })
    });

    // Add an event listener
    Linking.addEventListener('url', (e: { url: string }) => {
      console.log('url event catched: ', e.url);
      const redirection: RedirectType | undefined = REDIRECTIONS.find(
        (red: RedirectType) => BASEURL + red.uri === e.url
      );

      if (!redirection) {
        return console.error('Redirection error: could not find redirect uri: ', e.url);
      }

      navigation.navigate(redirection.routeName as never);
    });

    return () => Linking.removeAllListeners('url');
  }, []);


  return (
    <Stack.Navigator initialRouteName='homemain'>
      <Stack.Screen name="homemain" component={HomeScreen} options={options} />
      <Stack.Screen name="article" component={Article} options={options} />
      <Stack.Screen name="articles" component={ArticlesList} options={options} />
      <Stack.Screen name="singleart" component={SingleArt} options={options} />
      <Stack.Screen name="singlepost" component={SinglePost} options={options} />
      <Stack.Screen name="other_profile" component={OtherProfile} options={options} />
      <Stack.Screen name="notifications" component={Notifications} options={options} />
      <Stack.Screen name="single_conversation" component={Conversation} options={options} />
      <Stack.Screen name="collection" component={Collection} options={options} />
      <Stack.Screen name="report" component={ReportScreen} options={options} />
      <Stack.Screen name="single_order" component={SingleOrder} options={options} />

      {/* Redirections */}
      <Stack.Screen
        name="stripe_validated"
        component={StripeAccountValidated}
        options={options}
      />
      <Stack.Screen
        name="order_succeed"
        component={PaymentValidated}
        options={options}
      />
      <Stack.Screen
        name="order_canceled"
        component={PaymentFailed}
        options={options}
      />
    </Stack.Navigator>
  );
}

export default HomeNavigator;
