import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CartScreen from '../screens/CartScreen';


const CartNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables headers for this navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="cartmain" component={CartScreen} options={options} />
    </Stack.Navigator>
  );
}

export default CartNavigator;

