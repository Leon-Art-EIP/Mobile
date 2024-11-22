import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {MainContextProvider} from './context/MainContext';
import ConnexionNavigator from './navigators/ConnexionNavigator';
import BottomNavigator from './navigators/BottomNavigator';
import HomeNavigator from './navigators/HomeNavigator';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { Linking } from 'react-native';


const App = () => {
  const Stack = createNativeStackNavigator();
  const options = { headerShown: false };


  return (
    <MainContextProvider>
      <NavigationContainer independent>
        <Stack.Navigator>
          <Stack.Screen
            name="connexion"
            component={ConnexionNavigator}
            options={options}
          />
          {/* <Stack.Screen */}
          {/*   name="connexion" */}
          {/*   component={BottomNavigator} */}
          {/*   options={options} */}
          {/* /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </MainContextProvider>
  );
};

export default App;
