import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgUri } from 'react-native-svg';

import HomeNavigator from './HomeNavigator';
import MessageNavigator from './MessageNavigator';
import CartNavigator from './CartNavigator';
import ProfileNavigator from './ProfileNavigator';
import AddNavigator from './AddNavigator'
import HomeSVG from '../assets/icons/home.svg';

const MainNavigator = () => {
  const Tab = createBottomTabNavigator();
  const options = { headerShown: false };

  return (
    <Tab.Navigator screenOptions={{
      tabBarHideOnKeyboard: true
    }}>
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        // options={{
        //   headerShown: false,
        //             tabBarIcon: ({ color, size }) => (
        //     <SvgUri width="50%" height="50%" svgXmlData={HomeSVG} />
        //   )
        // }}
      />
      <Tab.Screen name="Messages" component={MessageNavigator} options={options} />
      <Tab.Screen name="Add" component={AddNavigator} options={options} />
      <Tab.Screen name="Cart" component={CartNavigator} options={options} />
      <Tab.Screen name="Profile" component={ProfileNavigator} options={options} />
    </Tab.Navigator>
  );
}

export default MainNavigator;
