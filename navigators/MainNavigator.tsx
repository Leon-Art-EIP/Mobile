import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgUri } from 'react-native-svg';

import HomeNavigator from './HomeNavigator';
import MessageNavigator from './MessageNavigator';
import CartNavigator from './CartNavigator';
import ProfileNavigator from './ProfileNavigator';
import HomeSVG from '../assets/icons/home.svg';

const MainNavigator = () => {
  const Tab = createBottomTabNavigator();

  // disables header for this navigator
  const options = { headerShown: false };

  return (
    <Tab.Navigator screenOptions={{
      tabBarHideOnKeyboard: true
    }}>
      <Tab.Screen
        name="home"
        component={HomeNavigator}
        options={{
          headerShown: false,
          /* tabBarOptions: { showLabel: false }, */
          tabBarIcon: ({ color, size }) => (
            <SvgUri width="50%" height="50%" svgXmlData={HomeSVG} />
          )
        }}
      />
      <Tab.Screen name="messages" component={MessageNavigator} options={options} />
      <Tab.Screen name="cart" component={CartNavigator} options={options} />
      <Tab.Screen name="profile" component={ProfileNavigator} options={options} />
    </Tab.Navigator>
  );
}

export default MainNavigator;
