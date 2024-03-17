import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {useContext, useEffect} from 'react';
import {MainContext, MainContextProvider} from './context/MainContext';
import ConnexionNavigator from './navigators/ConnexionNavigator';
import { StripeProvider } from '@stripe/stripe-react-native';


const App = ({ noLogin = false }) => {
  const Stack = createNativeStackNavigator();
  const options = { headerShown: false };
  const context = useContext(MainContext);


  return (
    <StripeProvider
      publishableKey='pk_test_51ORdmCAInJ0GXaTlLAFRQipFiF7YcUMunXEYmVdiLARSZraedy1pslBOL5iDqXTVKssWfUb9sXyuAW8uSOqY2IAH00u4hR1NlU'>
      <MainContextProvider>
        <NavigationContainer independent>
          <Stack.Navigator>
            <Stack.Screen
              name="connexion"
              component={ConnexionNavigator}
              // initialParams={{ token }}
              options={options}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MainContextProvider>
    </StripeProvider>
  );
};

export default App;
