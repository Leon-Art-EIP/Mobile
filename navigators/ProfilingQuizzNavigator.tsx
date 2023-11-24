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

const ProfilingQuizzNavigator = () => {
  const Stack = createNativeStackNavigator();
  const options = { headerShown: true };

    return (
        <Stack.Navigator>
            <Stack.Screen name="profiling" component={Profiling} options={options}/>
            <Stack.Screen name="profilingartist1" component={ProfilingArtist1} options={options}/>
            <Stack.Screen name="profilingartist2" component={ProfilingArtist2} options={options}/>
            <Stack.Screen name="profilingamateur1" component={ProfilingAmateur1} options={options}/>
            <Stack.Screen name="profilingamateur1" component={ProfilingAmateur2} options={options}/>
            <Stack.Screen name="profilinglast" component={ProfilingLast} options={options}/>
        </Stack.Navigator>
    );
}
export default ProfilingQuizzNavigator;