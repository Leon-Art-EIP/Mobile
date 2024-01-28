import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Profile from '../screens/Profile';
import FollowerList from '../screens/FollowerList';
import Settings from '../screens/Settings/Settings';
import GeneralConditions from '../screens/Settings/GeneralConditions';
import PasswordAndSecurity from '../screens/Settings/PasswordAndSecurity';
import PersonalInformations from '../screens/Settings/PersonalInformations';
import ProfilingQuizz from '../screens/ProfilingQuizz';
import ProfilingArtist1 from '../screens/ProfilingQuizzArtist1'
import ProfilingArtist2 from '../screens/ProfilingQuizzArtist2'
import ProfilingAmateur1 from '../screens/ProfilingQuizzAmateur1'
import ProfilingAmateur2 from '../screens/ProfilingQuizzAmateur2'
import ProfilingLast from '../screens/ProfilingQuizzFinal';
import EditProfile from '../screens/EditProfile';
import Collection from '../screens/Collection';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();

  // disables header for this navigator
  const options = { headerShown: false };

  return (
    <Stack.Navigator>
      <Stack.Screen name="profile" component={Profile} options={options} />
      <Stack.Screen name="follower_list" component={FollowerList} options={options} />
      <Stack.Screen name="settings" component={Settings} options={options} />
      <Stack.Screen name="edit_profile" component={EditProfile} options={options} />
      <Stack.Screen name="personal_informations" component={PersonalInformations} options={options} />
      <Stack.Screen name="password_and_security" component={PasswordAndSecurity} options={options} />
      <Stack.Screen name="general_conditions" component={GeneralConditions} options={options} />
      <Stack.Screen name="profiling" component={ProfilingQuizz} options={options}/>
      <Stack.Screen name="profilingArtist" component={ProfilingArtist1} options={options}/>
      <Stack.Screen name="profilingArtist2" component={ProfilingArtist2} options={options}/>
      <Stack.Screen name="profilingAmateur" component={ProfilingAmateur1} options={options}/>
      <Stack.Screen name="profilingAmateur2" component={ProfilingAmateur2} options={options}/>
      <Stack.Screen name="profilingLast" component={ProfilingLast} options={options}/>
      <Stack.Screen name="collection" component={Collection} options={options}/>
    </Stack.Navigator>
  );
}

export default ProfileNavigator;

