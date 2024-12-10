import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/MainContext';

// Navigators
import ProfilingQuizzNavigator from './ProfilingQuizzNavigator';

//Screens
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import ForgotPassword from '../screens/ForgotPassword';
import BottomNavigator from './BottomNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from '../screens/Splash';
import { TokenObjectType } from '../constants/artTypes';
import { get } from '../constants/fetch';
import Tutorial from '../screens/Tutorial';
import Tutorial_2 from '../screens/Tutorial_2';
import Tutorial_3 from '../screens/Tutorial_3';
import { ToastAndroid } from 'react-native';

const ConnexionNavigator = () => {
  const Stack = createNativeStackNavigator();
  const options = { headerShown: false };
  const context = useContext(MainContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const getToken = () => {
    const displayLogoutMsg = () => {
      ToastAndroid.show('Veuillez vous connecter', ToastAndroid.SHORT);
    }

    const onError = (errorMsg: string, inToast: boolean = false) => {
      const error: string = 'ConnexionNavigator::getToken - ' + errorMsg;

      if (!!inToast) {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      }
      console.warn(error);
      ToastAndroid.show('Veuillez vous connecter', ToastAndroid.SHORT);
      context?.logOut();
      return setIsLoading(false);
    }

    (async () => {
      const value = await AsyncStorage.getItem('jwt');

      if (!value) {
        return onError('No JWT in LocalStorage', true);
      }

      const data: TokenObjectType = JSON.parse(value);

      if (!data) {
        return onError('Failed to parse JWT', true);
      }

      get(
        '/api/user/profile/who-i-am',
        data?.token,
        (res: any) => {
          context?.setToken(data?.token);
          context?.setUserId(data?.id);
          context?.setisArtist(data?.isArtist);
          context?.setUsername(data?.username);
          context?.setUserEmail(data?.email);
          context?.setUserColor(data?.userColor);
          setIsLoading(false);
        },
        (err: any) => {
          console.log("error getting token: ", { ...err.response });
          onError('/who-i-am returned invalid token. Redirecting...');
        }
      );
    })();
  };


  useEffect(getToken, []);


  if (isLoading) {
    return <Splash />;
  }

  return (
    <Stack.Navigator>
      { context?.token ? (
        <>
          <Stack.Screen name="main" component={BottomNavigator} options={options} />
          <Stack.Screen name="profilingquizz" component={ProfilingQuizzNavigator} options={options} />
          <Stack.Screen name="tutorial" component={Tutorial} options={options} />
          <Stack.Screen name="tutorial_2" component={Tutorial_2} options={options} />
          <Stack.Screen name="tutorial_3" component={Tutorial_3} options={options} />
        </>
      ) : (
        <>
          <Stack.Screen name="login" component={Login} options={options} />
          <Stack.Screen name="signup" component={Signup} options={options} />
          <Stack.Screen name="recover" component={ForgotPassword} options={options} />
        </>
      ) }
    </Stack.Navigator>
  );
};

export default ConnexionNavigator;
