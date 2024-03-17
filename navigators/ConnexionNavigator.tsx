import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { MainContext } from '../context/MainContext';

// Navigators
import ProfilingQuizzNavigator from './ProfilingQuizzNavigator';

//Screens
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import GoogleLogin from '../screens/GoogleLogin';
import ForgotPassword from '../screens/ForgotPassword';
import BottomNavigator from './BottomNavigator';
import {NavigationContainer, useRoute} from '@react-navigation/native';


type ConnexionNavigatorParams = {
  noLogin: boolean;
};


const ConnexionNavigator = () => {
  const Stack = createNativeStackNavigator();
  const options = { headerShown: false };
  const context = useContext(MainContext);


  return context?.token ? (
    <Stack.Navigator>
      <Stack.Screen name="main" component={BottomNavigator} options={options} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen name="login" component={Login} options={options} />
      <Stack.Screen name="signup" component={Signup} options={options} />
      <Stack.Screen name="google" component={GoogleLogin} options={options} />
      <Stack.Screen name="recover" component={ForgotPassword} options={options} />
      <Stack.Screen name="profilingquizz" component={ProfilingQuizzNavigator} options={options} />
    </Stack.Navigator>
  );
};

export default ConnexionNavigator;
