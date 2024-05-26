import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {MainContextProvider} from './context/MainContext';
import ConnexionNavigator from './navigators/ConnexionNavigator';
import { StripeProvider } from '@stripe/stripe-react-native';


const App = () => {
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
