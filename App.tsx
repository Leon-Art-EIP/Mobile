import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import ComponentsShow from './screens/ComponentsShow';
import Login from './screens/LoginPage/LoginPage';
import Signup from './screens/Signup';
import MainNavigator from './navigators/MainNavigator';
import ForgotPassword from './screens/ForgotPassword';
import EditProfile from './navigators/EditProfileNavigator';
import Settings from './navigators/SettingsNavigator';
import OtherProfileNavigator from './navigators/OtherProfileNavigator';
import OtherProfile from './screens/OtherProfile';
import Conversation from './screens/Conversation';
import { MainContextProvider, MainContext } from './context/MainContext';
import axiosInstance from './utils/axiosInstance'; // Adjust the path accordingly
import { SERVER_URL } from 'react-native-dotenv';


declare const global: {HermesInternal: null | {}};

if (typeof global !== 'undefined') {
  (global as any).axiosInstance = axiosInstance;
}

const App = () => {
  const Stack =  createNativeStackNavigator();
  const context = useContext(MainContext);
  const [loading, setLoading] = useState(true); // Define the loading state

  useEffect(() => {
    const fetchTokenFromDB = async () => {
      try {
        const endpoint = '${SERVER_URL}/api/auth/login'; // Define the API endpoint
        console.log('API Endpoint:', endpoint); // Log the API endpoint

        const response = await axios.get(endpoint);
        console.log('Complete Response: ', response); // Log the complete response object

        if (!response || response == null)
          console.log("Merde");

        if (response && response.data && response.data.token) {
          const tokenFromDB = response.data.token;
          console.log('Token from DB:', tokenFromDB); // Log the token from the database
          // Update the token in the context or wherever it's needed in your application
          // For example: context.setToken(tokenFromDB);
        } else {
          console.error('Invalid response format: ', response);
        }
        setLoading(false); // Update the loading state when the token is fetched
      } catch (error) {
        console.error('Error fetching token:', error); // Debug message to log the error
        setLoading(false); // Update the loading state if there's an error
      }
    };
  
    fetchTokenFromDB().catch((error) => {
      console.error('Unhandled Promise Rejection:', error); // Handle any unhandled promise rejections
      setLoading(false); // Update the loading state in case of an unhandled promise rejection
    });
  }, []);
  
  

  // if (loading) {
  //   return <div>Loading...</div>; // Display a loading indicator while fetching the token
  // }
  // will be removed as soon as we check for tokens in localstorage
  let isShowingComponents = false;

  // disables headers for this navigator
  const options = { headerShown: false };


  return isShowingComponents ? (
    <ComponentsShow />
  ) : (
    <MainContextProvider>
      <NavigationContainer independent>
        <Stack.Navigator initialRouteName={context?.token === undefined ? "login" : "main"}>
          <Stack.Screen name="login" component={Login} options={options} />
          <Stack.Screen name="signup" component={Signup} options={options} />
          <Stack.Screen name="main" component={MainNavigator} options={options} />
          <Stack.Screen name="recover" component={ForgotPassword} options={options} />
          <Stack.Screen name="settings" component={Settings} options={options} />
          <Stack.Screen name="editprofile" component={EditProfile} options={options} />
          <Stack.Screen name="other_profile" component={OtherProfile} options={options} />
          <Stack.Screen name="single_conversation" component={Conversation} options={options} />
        </Stack.Navigator>
      </NavigationContainer>
    </MainContextProvider>
  );
};

export default App;
