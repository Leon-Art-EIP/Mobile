import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/MainContext';

// Navigators
import ProfilingQuizzNavigator from './ProfilingQuizzNavigator';

//Screens
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import GoogleLogin from '../screens/GoogleLogin';
import ForgotPassword from '../screens/ForgotPassword';
import BottomNavigator from './BottomNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from '../screens/Splash';
import { TokenObjectType } from '../constants/artTypes';
import { post } from '../constants/fetch';
import { NavigationContext } from '@react-navigation/native';

// Quizz and Tutorial

import Tutorial from '../screens/Tutorial';
import Tutorial_2 from '../screens/Tutorial_2';
import Tutorial_3 from '../screens/Tutorial_3';
import ProfilingQuizz from '../screens/ProfilingQuizz';
// import ProfilingQuizzArtist from '../screens/ProfilingQuizzArtist1';
// import Profili

const ConnexionNavigator = () => {
  const Stack = createNativeStackNavigator();
  const options = { headerShown: false };
  const context = useContext(MainContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const getToken = () => {
    (async () => {
      const value = await AsyncStorage.getItem('jwt');

      if (!value) {
        return setIsLoading(false);
      }

      const data: TokenObjectType = JSON.parse(value);

      if (!data) {
        return setIsLoading(false);
      }

      post(
        '/api/auth/validate-reset-token',
        { token: data?.token },
        undefined,
        (res: any) => {
          console.log('no problem: ', { ...res });
          context?.setToken(data?.token);
          context?.setUserId(data?.id);
          context?.setisArtist(data?.isArtist);
          context?.setUsername(data?.username);
          context?.setUserEmail(data?.email);
          context?.setUserColor(data?.userColor);
          setIsLoading(false);
        },
        (err: any) => {
          console.log("error getting token: ", { ...err.response.status });
          if (err.response.status === 404) {
            context?.logOut();
            setIsLoading(false);
          }
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
      {context?.token ? (
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
          {/* <Stack.Screen name="profilingquizz" component={ProfilingQuizzNavigator} options={options} /> */}
          <Stack.Screen name="recover" component={ForgotPassword} options={options} />
        </>
      )}
    </Stack.Navigator>
  );
};

//   return context?.token ? (
//     <Stack.Navigator>
//       <Stack.Screen name="main" component={BottomNavigator} options={options} />
//       <Stack.Screen name="tutorial" component={Tutorial} options={options} />
//       <Stack.Screen name="tutorial_2" component={Tutorial_2} options={options} />
//       <Stack.Screen name="tutorial_3" component={Tutorial_3} options={options} />
//       <Stack.Screen name="login" component={Login} options={options} />
//       {/* <Stack.Screen name="profilingmain" component={ProfilingQuizz} options={options} /> */}
//     </Stack.Navigator>
//   ) : (
//     <Stack.Navigator>
//       <Stack.Screen name="login" component={Login} options={options} />
//       <Stack.Screen name="signup" component={Signup} options={options} />
//       <Stack.Screen name="main" component={BottomNavigator} options={options} />
//       <Stack.Screen name="google" component={GoogleLogin} options={options} />
//       <Stack.Screen name="recover" component={ForgotPassword} options={options} />
//       <Stack.Screen name="profilingquizz" component={ProfilingQuizzNavigator} options={options} />
//     </Stack.Navigator>
//   );
// };

export default ConnexionNavigator;
