//* Standard imports
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, Image, StyleSheet, ScrollView, TouchableOpacity, View, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

//* Local imports
import colors from '../../constants/colors';
import Title from '../text/Title';

/*
 * There is a problem that prevents the app to get
 * values from the .env file, so Imma just go with
 * a constant value until it's fixed
 */
const API_URL = "http://10.0.2.2:5000/";

type FollowerType = {
  id: string;
  username: string;
  profilePicture: string;
};

const FollowersComponent = () => {
  const navigation = useNavigation();
  const [followers, setFollowers] = useState<FollowerType[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  interface UserData {
    _id: string;
    username: string;
    is_artist: boolean;
    availability: string;
    subscription: string;
    collections: any[]; // Replace with the actual type
    subscriptions: any[]; // Replace with the actual type
    subscribers: any[]; // Replace with the actual type
    subscribersCount: number;
    likedPublications: any[]; // Replace with the actual type
    canPostArticles: boolean;
    __v: number;
    bannerPicture: string;
    profilePicture: string;
  }

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const userId = await AsyncStorage.getItem('id');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get<UserData>(
          `${API_URL}api/user/profile/${userId}`,
          { headers }
        );
        setUserData(response.data);
      } else {
        console.error('Token JWT not found. Make sure the user is logged in.');
        // Alert.alert('Token JWT not found. Make sure the user is logged in.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Alert.alert('Error fetching user data', 'An error occurred while fetching user data.');
    }
  };

  const fetchFollowers = async (userIds: string[]) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        console.error('Token JWT not found. Make sure the user is logged in.');
        // Alert.alert('Token JWT not found. Make sure the user is logged in.');
        return [];
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const promises = userIds.map(async (userId) => {
        const response = await axios.get<UserData>(
          `${API_URL}api/user/profile/${userId}`,
          { headers }
        );
        return response.data;
      });
  
      const usersData = await Promise.all(promises);
      const followersData: FollowerType[] = usersData.map((user) => ({
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture || 'uploads/static/default-profile-pic.png',
      }));
      
      setFollowers(followersData); // Met à jour l'état followers avec les données obtenues
    } catch (error) {
      console.error('Error fetching users data:', error);
      // Alert.alert('Error fetching users data', 'An error occurred while fetching users data.');
    }
  };

  useEffect(() => {
    fetchUserData();
    if (userData?.subscribers) fetchFollowers(userData.subscribers);
  }, [userData?.subscribers]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      { followers.map((follower: FollowerType) => (
        <TouchableOpacity
          key={follower.id.toString()}
          style={styles.followerView}
          onPress={() => navigation?.navigate(
            'other_profile',
            // {
            //   id: follower.id,
            //   name: follower.profileName
            // }
            // TODO : rendre dynamique
          )}
        >
          <View style={{ flexDirection: 'row', height: 60 }}>
            <Image
              source={require('../../assets/images/user.png')}
              style={styles.followerPicture}
            />
            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Title size={16}>{ follower.username }</Title>
            </View>
          </View>
          <View style={styles.lineView} />
        </TouchableOpacity>
      )) }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  followerPicture: {
    borderWidth: 1,
    borderColor: colors.white,
    width: 50,
    height: 50,
    borderRadius: 50,
    marginHorizontal: 12,
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  followerView: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lineView: {
    marginTop: 4,
    marginLeft: 24,
    backgroundColor: '#00000022',
    height: 1
  },
  unreadDot: {
    backgroundColor: colors.primary,
    height: 6,
    width: 6,
    borderRadius: 50,
    marginTop: 'auto',
    marginBottom: 'auto',
  }
});

export default FollowersComponent;
