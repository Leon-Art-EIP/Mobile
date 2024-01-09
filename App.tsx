import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { MainContextProvider } from './context/MainContext';
import ConnexionNavigator from './navigators/ConnexionNavigator';
import { StripeProvider } from '@stripe/stripe-react-native';

const App = ({ noLogin = false }) => {
  const Stack = createNativeStackNavigator();
  const options = { headerShown: false };

  return (
    
    
    <MainContextProvider >
      <NavigationContainer independent>
        <Stack.Navigator>
          <Stack.Screen
            name="connexion"
            component={ConnexionNavigator}
            initialParams={{ noLogin }}
            options={options}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MainContextProvider>
  );
};

export default App;
