import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeNavigator from '../navigators/HomeNavigator';
import SearchNavigator from '../navigators/SearchNavigator';
import CartNavigator from '../navigators/CartNavigator';
import ProfileNavigator from '../navigators/ProfileNavigator';

const MainNavigator = () => {
  const Tab = createBottomTabNavigator();

  // disables header for this navigator
  const options = { headerShown: false };

  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={HomeNavigator} options={options} />
      <Tab.Screen name="search" component={SearchNavigator} options={options} />
      <Tab.Screen name="cart" component={CartNavigator} options={options} />
      <Tab.Screen name="profile" component={ProfileNavigator} options={options} />
    </Tab.Navigator>
  );
}

export default MainNavigator;
