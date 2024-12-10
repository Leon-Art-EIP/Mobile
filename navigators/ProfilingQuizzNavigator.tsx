import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

//Screens
import Profiling from '../screens/ProfilingQuizz'
import ProfilingArtist1 from '../screens/ProfilingQuizzArtist1'
import ProfilingArtist2 from '../screens/ProfilingQuizzArtist2'
import ProfilingAmateur1 from '../screens/ProfilingQuizzAmateur1'
import ProfilingAmateur2 from '../screens/ProfilingQuizzAmateur2'
import ProfilingLast from '../screens/ProfilingQuizzFinal';
import BottomNavigator from './BottomNavigator';
import Tutorial from '../screens/Tutorial'
import Tutorial2 from '../screens/Tutorial_2'
import Tutorial3 from '../screens/Tutorial_3'

const ProfilingQuizzNavigator = () => {
  const Stack = createNativeStackNavigator();
  const options = { headerShown: false };

    return (
      <Stack.Navigator>
        <Stack.Screen name="profiling" component={Profiling} options={options} />
        <Stack.Screen name="profilingArtist" component={ProfilingArtist1} options={options} />
        <Stack.Screen name="profilingArtist2" component={ProfilingArtist2} options={options} />
        <Stack.Screen name="profilingAmateur" component={ProfilingAmateur1} options={options} />
        <Stack.Screen name="profilingAmateur2" component={ProfilingAmateur2} options={options} />
        <Stack.Screen name="profilingLast" component={ProfilingLast} options={options} />
        <Stack.Screen name="mainNav" component={BottomNavigator} options={options} />
        <Stack.Screen name="tutorial" component={Tutorial} options={options} />
        <Stack.Screen name="tutorial2" component={Tutorial2} options={options} />
        <Stack.Screen name="tutorial3" component={Tutorial3} options={options} />
      </Stack.Navigator>
    );
}
export default ProfilingQuizzNavigator
