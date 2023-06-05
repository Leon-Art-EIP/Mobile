/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import Login from './screens/Login';
import Signup from './screens/Signup';
import MainNavigator from './screens/MainNavigator';

const App = () => {
  const Stack =  createNativeStackNavigator();

  useEffect(() => {
    //TODO get connection token in localstorage
  }, []);

  let isConnected = true;

  // disables headers for this navigator
  const options = { headerShown: false };

  return (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName={isConnected ? "main" : "signup"}>
        <Stack.Screen name="login" component={Login} options={options} />
        <Stack.Screen name="signup" component={Signup} options={options} />
        <Stack.Screen name="main" component={MainNavigator} options={options} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
