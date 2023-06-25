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

import ComponentsShow from './screens/ComponentsShow';
import Login from './screens/Login';
import Signup from './screens/Signup';
import MainNavigator from './navigators/MainNavigator';
import ForgotPassword from './screens/ForgotPassword';

const App = () => {
  const Stack =  createNativeStackNavigator();

  useEffect(() => {
    //TODO get connection token in localstorage
  }, []);

  // will be removed as soon as we check for tokens in localstorage
  let isConnected = false;
  let isShowingComponents = true;

  // disables headers for this navigator
  const options = { headerShown: false };

  return isShowingComponents ? (
    <ComponentsShow />
  ) : (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName={isConnected ? "main" : "login"}>
        <Stack.Screen name="login" component={Login} options={options} />
        <Stack.Screen name="signup" component={Signup} options={options} />
        <Stack.Screen name="main" component={MainNavigator} options={options} />
        <Stack.Screen name="recover" component={ForgotPassword} options={options} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
