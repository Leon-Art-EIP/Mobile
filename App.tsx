import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { MainContextProvider, MainContext } from './context/MainContext';

import MainNavigator from './navigators/MainNavigator';
import ConnexionNavigator from './navigators/ConnexionNavigator';
import ComponentsShow from './screens/ComponentsShow';

// App component

const App = () => {
  const Stack = createNativeStackNavigator();
  const options = { headerShown: false };

  return (
    <MainContextProvider>
      <NavigationContainer independent>
        <Stack.Navigator>
          <Stack.Screen name="connexion" component={ConnexionNavigator} options={options} />
        </Stack.Navigator>
      </NavigationContainer>
    </MainContextProvider>
  );
};

export default App;