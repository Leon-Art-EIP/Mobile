import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useContext, useEffect } from 'react';
import axiosInstance from './utils/axiosInstance';
import { ActivityIndicator, Text } from 'react-native';
import { MainContextProvider, MainContext } from './context/MainContext';
import axios from 'axios';
import env from './env';

// Screens
import ComponentsShow from './screens/ComponentsShow';
import Login from './screens/Login';
import Signup from './screens/Signup';
import ForgotPassword from './screens/ForgotPassword';
import OtherProfile from './screens/OtherProfile';
import Conversation from './screens/Conversation';
import Profiling from './screens/ProfilingQuizz'
import ProfilingArtist1 from './screens/ProfilingQuizzArtist1'
import ProfilingArtist2 from './screens/ProfilingQuizzArtist2'
import ProfilingAmateur1 from './screens/ProfilingQuizzAmateur1'
import ProfilingAmateur2 from './screens/ProfilingQuizzAmateur2'
import ProfilingLast from './screens/ProfilingQuizzFinal';
import SingleArt from './screens/SingleArt';


// Navigators
import MainNavigator from './navigators/MainNavigator';
import EditProfile from './navigators/EditProfileNavigator';
import OtherProfileNavigator from './navigators/OtherProfileNavigator';
import Settings from './navigators/SettingsNavigator';
import BottomNavigator from './navigators/BottomNavigator';

const App = () => {
  const Stack =  createNativeStackNavigator();
  const context = useContext(MainContext);
  const [loading, setLoading] = useState(true);

  let isShowingComponents = false;
  const options = { headerShown: false };


  return isShowingComponents ? (
    <ComponentsShow />
  ) : (
    <MainContextProvider>
      <NavigationContainer independent>
        <Stack.Navigator initialRouteName={context?.token === undefined ? "login" : "main"}>
          <Stack.Screen name="login" component={Login} options={options} />
          <Stack.Screen name="signup" component={Signup} options={options} />
          <Stack.Screen name="main" component={BottomNavigator} options={options} />
          <Stack.Screen name="recover" component={ForgotPassword} options={options} />
          <Stack.Screen name="settings" component={Settings} options={options} />
          <Stack.Screen name="editprofile" component={EditProfile} options={options} />
          <Stack.Screen name="other_profile" component={OtherProfile} options={options} />
          <Stack.Screen name="single_conversation" component={Conversation} options={options} />
          <Stack.Screen name="profiling" component={Profiling} options={options} />
          <Stack.Screen name="profilingArtist" component={ProfilingArtist1} options={options} />
          <Stack.Screen name="profilingArtist2" component={ProfilingArtist2} options={options} />
          <Stack.Screen name="profilingAmateur" component={ProfilingAmateur1} options={options} />
          <Stack.Screen name="profilingAmateur2" component={ProfilingAmateur2} options={options} />
          <Stack.Screen name="profilingLast" component={ProfilingLast} options={options} />
          <Stack.Screen name="singleArt" component={SingleArt} options={options} />
        </Stack.Navigator>
      </NavigationContainer>
    </MainContextProvider>
  );
};

export default App;
