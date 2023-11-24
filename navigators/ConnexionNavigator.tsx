// ConnexionNavigator component

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { MainContext } from '../context/MainContext';

import MainNavigator from './MainNavigator';

import Login from '../screens/Login';
import Signup from '../screens/Signup';
import GoogleLogin from '../screens/GoogleLogin';
import ForgotPassword from '../screens/ForgotPassword';

const ConnexionNavigator = () => {
  const Stack = createNativeStackNavigator();
//   const context = useContext(MainContext);
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      {/* {context?.token ? (
        // If token exists, navigate to 'main'
        <Stack.Screen name="main" component={MainNavigator} options={options} />
      ) : (
        // If no token, navigate to 'login'
        <> */}
          <Stack.Screen name="login" component={Login} options={options} />
          <Stack.Screen name="signup" component={Signup} options={options} />
          <Stack.Screen name="google" component={GoogleLogin} options={options} />
          <Stack.Screen name="resetpassword" component={ForgotPassword} options={options} />
    </Stack.Navigator>
  );
};

export default ConnexionNavigator;
