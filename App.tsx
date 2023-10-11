import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';

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

const App = () => {
  const Stack =  createNativeStackNavigator();
  const context = useContext(MainContext);

  useEffect(() => {}, []);

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
