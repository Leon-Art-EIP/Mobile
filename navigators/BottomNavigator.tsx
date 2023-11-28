import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeNavigator from './HomeNavigator';
import MessageNavigator from './MessageNavigator';
import CartNavigator from './CartNavigator';
import ProfileNavigator from './ProfileNavigator';
import AddNavigator from './AddNavigator'

import colors from '../constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const BottomNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.disabledFg,
        tabBarShowLabel: false
      })}
    >

      {/* Home tab */}
      <Tab.Screen name="Home" component={HomeNavigator} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="home-filled" size={size} color={color} />
        )
      }} />

      {/* Inbox tab */}
      <Tab.Screen name="Messages" component={MessageNavigator} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="chat" size={size} color={color} />
        )
      }} />

      {/* Add tab */}
      <Tab.Screen name="Add" component={AddNavigator} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="add-circle-outline" size={size} color={color} />
        )
      }} />

      {/* Cart tab */}
      <Tab.Screen name="Cart" component={CartNavigator} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="cart" size={size} color={color} />
        )
      }} />

      {/* Profile tab */}
      <Tab.Screen name="Profile" component={ProfileNavigator} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="user-circle" size={size} color={color} />
        )
      }} />

    </Tab.Navigator>
  );
}

export default BottomNavigator;
