import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {useContext, useEffect} from 'react';
import {MainContext, MainContextProvider} from './context/MainContext';
import ConnexionNavigator from './navigators/ConnexionNavigator';
import { StripeProvider } from '@stripe/stripe-react-native';
import { setupNotifications } from './constants/notifications';


const App = ({ noLogin = false }) => {
  const Stack = createNativeStackNavigator();
  const options = { headerShown: false };


  return (
    <StripeProvider
      publishableKey={process.env.REACT_APP_STRIPE_API_KEY ?? ""}
    >
      <MainContextProvider>
        <NavigationContainer independent>
          <Stack.Navigator>
            <Stack.Screen
              name="connexion"
              component={ConnexionNavigator}
              options={options}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MainContextProvider>
    </StripeProvider>
  );
};

export default App;
