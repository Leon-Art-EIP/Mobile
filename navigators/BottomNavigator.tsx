import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeNavigator from './HomeNavigator';
import MessageNavigator from './MessageNavigator';
import ProfileNavigator from './ProfileNavigator';
import AddNavigator from './AddNavigator'

import colors from '../constants/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SearchNavigator from './SearchNavigator';


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
          <MaterialIcons
            name="home-filled"
            size={size}
            color={color}
            testID="HomeNavBtn"
          />
        )
      }} />

      {/* Search tab */}
      <Tab.Screen name="Search" component={SearchNavigator} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons
            name="search"
            size={size}
            color={color}
            testID="SearchNavBtn"
          />
        )
      }} />

      {/* Add tab */}
      <Tab.Screen name="Add" component={AddNavigator} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons
            name="add-circle-outline"
            size={size}
            color={color}
            testID="AddNavBtn"
          />
        )
      }} />

      {/* Inbox tab */}
      <Tab.Screen name="Messages" component={MessageNavigator} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons
            name="chat"
            size={size}
            color={color}
            testID="MessagesNavBtn"
          />
        )
      }} />

      {/* Profile tab */}
      <Tab.Screen name="Profile" component={ProfileNavigator} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <FontAwesome
            name="user-circle"
            size={size}
            color={color}
            testID="ProfileNavBtn"
          />
        )
      }} />

    </Tab.Navigator>
  );
}

export default BottomNavigator;
