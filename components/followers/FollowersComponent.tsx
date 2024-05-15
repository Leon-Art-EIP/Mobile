//* Standard imports
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text, Image, StyleSheet, ScrollView, TouchableOpacity, View, Alert, FlatList, RefreshControl } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

//* Local imports
import colors from '../../constants/colors';
import Title from '../Title';
import { MainContext } from '../../context/MainContext';
import { get, getAsync } from '../../constants/fetch';
import { getImageUrl } from '../../helpers/ImageHelper';
import { useRefresh } from '@react-native-community/hooks';
import { isResumable } from 'react-native-fs';
import Input from '../Input';
import { bgGrey, mh4 } from '../../constants/styles';


type FollowerType = {
  id: string;
  username: string;
  profilePicture: string;
};


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


interface FollowersComponentProps {
  isFollower: boolean; // true for follower list, false for following list
  listener: string;    // outside variable which will trigger rerender
}


const FollowersComponent = ({
  isFollower = true,
  listener = ""
}: FollowersComponentProps) => {
  const navigation = useNavigation();
  const [followers, setFollowers] = useState<FollowerType[]>([]);
  const [searchedFollowers, setSearchedFollowers] = useState<FollowerType[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [search, setSearch] = useState<string>("");
  const context = useContext(MainContext);


  const fetchUserData = async () => {
    if (!context?.token) {
      console.error('Token JWT not found. Make sure the user is logged in.');
      Alert.alert('Token JWT not found. Make sure the user is logged in.');
      return;
    }

    get(
      `/api/user/profile/${context.userId}`,
      context?.token,
      (response: any) => setUserData(response.data),
      (err: any) => console.error('Get user error: ', err)
    );
  }


  const fetchFollowers = async (userIds: string[]) => {
      if (!context?.token) {
        console.error('Token JWT not found. Make sure the user is logged in.');
        Alert.alert('Token JWT not found. Make sure the user is logged in.');
        return;
      }

      let newFollowers: FollowerType[] = [];
      for (let id in userIds) {
        const response: { data: UserData } = await getAsync(
          `/api/user/profile/${userIds[id]}`,
          context?.token
        );
        newFollowers.push({
          id: response?.data._id,
          username: response?.data.username,
          profilePicture: response?.data.profilePicture
        });
      }

      setFollowers([ ...newFollowers ]);
      setSearchedFollowers([ ...newFollowers ]);
  }


  const refreshData = async () => {
    return new Promise<void>(async (resolve) => {
      await fetchUserData();
      await fetchFollowers(isFollower ? userData?.subscribers : userData?.subscriptions);
      resolve()
    });
  }


  useEffect(() => {
    if (search === "") {
      return setSearchedFollowers([ ...followers ]);
    }

    setSearchedFollowers(followers.filter(
      (follower: FollowerType) => follower?.username.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search]);


  useEffect(() => {
    refreshData();
  }, []);


  useEffect(() => { refreshData() }, [listener]);


  useFocusEffect(
    useCallback(() => {
      (async () => await refreshData())()
    }, [navigation])
  );


  const { isRefreshing, onRefresh } = useRefresh(refreshData);


  return (
    <FlatList
      data={searchedFollowers}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.id.toString()}
          style={styles.followerView}
          onPress={() => navigation?.navigate(
            'other_profile',
            { id: item?.id }
          )}
        >
          <View style={{ flexDirection: 'row', height: 60 }}>
            <Image
              source={{ uri: getImageUrl(item?.profilePicture) }}
              style={styles.followerPicture}
            />
            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Title size={16}>{ item?.username }</Title>
            </View>
          </View>
          <View style={styles.lineView} />
        </TouchableOpacity>
      )}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          tintColor={colors.primary}
          colors={[colors.primary]}
          onRefresh={onRefresh}
        />
      }
      ListHeaderComponent={
        <Input
          placeholder='Search...'
          onTextChanged={(text: string) => setSearch(text)}
          style={[bgGrey, mh4]}
        />
      }
    />
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
