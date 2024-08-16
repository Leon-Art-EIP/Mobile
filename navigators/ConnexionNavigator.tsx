import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { MainContext } from '../context/MainContext';

// Navigators
import ProfilingQuizzNavigator from './ProfilingQuizzNavigator';

//Screens
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import GoogleLogin from '../screens/GoogleLogin';
import ForgotPassword from '../screens/ForgotPassword';
import BottomNavigator from './BottomNavigator';
import Tutorial from '../screens/Tutorial';
import Tutorial_2 from '../screens/Tutorial_2';
import Tutorial_3 from '../screens/Tutorial_3';


const ConnexionNavigator = () => {
  const Stack = createNativeStackNavigator();
  const options = { headerShown: false };
  const context = useContext(MainContext);


  return context?.token ? (
    <Stack.Navigator>
      <Stack.Screen name="main" component={BottomNavigator} options={options} />
      <Stack.Screen name="tutorial" component={Tutorial} options={options} />
      <Stack.Screen name="tutorial_2" component={Tutorial_2} options={options} />
      <Stack.Screen name="tutorial_3" component={Tutorial_3} options={options} />
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
