import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/text/Title';
import colors from '../constants/colors';
import { get } from '../constants/fetch';
import { MainContext } from '../context/MainContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  aiCenter,
  bgGrey,
  br20,
  cBlack,
  cDisabled,
  flex1,
  flexRow,
  jcCenter,
  mbAuto,
  mh24,
  mh8, mt8, mtAuto, mv24,
  mv4,
  mv8,
  ph8,
  pv24, taCenter
} from '../constants/styles';
import { formatName } from '../helpers/NamesHelper';
import { getImageUrl } from '../helpers/ImageHelper';
import Card from '../components/cards/Card';


type ArtPublicationType = {
  id: string,
  name: string,
  artType: string,
  image: string,
  price: number,
  isForSale: boolean,
  description: string
}

type UserType = {
  _id: string,
  username: string,
  profilePicture: string
}

type ResultsScreenProps = {
  url: string;
}


const ResultsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route?.params as ResultsScreenProps;
  const context = useContext(MainContext);
  const [posts, setPosts] = useState<ArtPublicationType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);


  const navigateToPreview = (post: ArtPublicationType) => {
    navigation.navigate('single_art', { id: post?._id });
  };


  const navigateToProfile = (user: UserType) => {
    navigation.navigate('other_profile', { id: user._id });
  };


  const getResults = () => {
    setIsRefreshing(true);

    const onGetSuccessful = (res: any) => {
      const posts: ArtPublicationType[] = res?.data?.artPublications ?? [];
      let users: UserType[] = res?.data?.users ?? [];

      users = users.filter((user: UserType) => user._id !== context?.userId);

      setPosts(posts);
      setUsers(users);
      setIsRefreshing(false);
    };

    const onGetError = (err: any) => {
      ToastAndroid.show(
        "Une erreur est survenue. Veuillez réessayer plus tard",
        ToastAndroid.LONG
      );
      return console.error({ ...err });
    };

    // Get results from received API call
    get(
      "/api/explorer/search?" + params?.url,
      context?.token,
      onGetSuccessful,
      onGetError
    );
  };


  useEffect(getResults, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      {/* Header */}
      <View style={[flexRow, aiCenter, mv24]}>
        <Ionicons
          name='chevron-back-outline'
          size={32}
          color={colors.title}
          onPress={() => navigation.goBack()}
          style={mh24}
        />
        <Title>Search</Title>
      </View>

      {/* User horizontal list */}
      { users.length === 0 ? (
        <View style={[jcCenter, aiCenter, pv24, br20, mh8, bgGrey]}>
          <Image
            source={require('../assets/icons/box.png')}
            style={[ styles.emptyImg, mtAuto ]}
          />
          <Text style={[cDisabled, mt8, mbAuto]}>Il n'y a pas d'artiste qui porte ce nom !</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          style={[flex1]}
        >
          { users.map((user: UserType) => (
            <Card
              key={user._id}
              pressable
              style={[aiCenter, ph8, mh8]}
              onPress={() => navigateToProfile(user)}
            >
              <Image
                style={styles.userImg}
                source={{ uri: getImageUrl(user.profilePicture) }}
              />
              <Text style={[mv4, cBlack, mtAuto]}>{ formatName(user.username, 20) }</Text>
            </Card>
          )) }
        </ScrollView>
      ) }

      {/* Data */}
      { posts.length === 0 ? (
        <ScrollView
          contentContainerStyle={[aiCenter, flex1]}
          style={styles.postsFlatlist}
          scrollEnabled={false}
          refreshControl={
            <RefreshControl
              onRefresh={getResults}
              refreshing={isRefreshing}
              tintColor={context?.userColor ?? colors.primary}
              colors={[ context?.userColor ?? colors.primary ]}
            />
          }
        >
          <Image
            source={require('../assets/icons/box.png')}
            style={[ styles.emptyImg, mtAuto ]}
          />
          <Text style={[ cDisabled, taCenter, mt8, mbAuto ]}>
            Il n'y a pas de postes qui correspondent à la recherche !
          </Text>
        </ScrollView>

      ) : (

        <FlatList
          data={posts}
          numColumns={3}
          refreshControl={
            <RefreshControl
              onRefresh={getResults}
              refreshing={isRefreshing}
              tintColor={colors.primary}
              colors={[ colors.primary ]}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToPreview(item)}
              style={styles.singleArt}
            >
              <Image
                style={{
                  backgroundColor: colors.offerBg,
                  width: '100%',
                  aspectRatio: 1,
                  borderRadius: 17
                }}
                source={{ uri: getImageUrl(item.image) }}
              />
            </TouchableOpacity>
          )}
        />
      ) }
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1
  },
  userImg: {
    borderRadius: 50,
    backgroundColor: colors.text,
    height: 100,
    width: 100
  },
  emptyImg: {
    height: 70,
    width: 70
  },
  postsFlatlist: {
    ...mh8,
    ...mv8,
    ...bgGrey,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexGrow: 2
  },
  singleArt: {
    backgroundColor: "#ddd",
    flex: 1,
    /* paddingVertical: 8, */
    /* paddingHorizontal: 8, */
    margin: 4,
    borderRadius: 20
  }
});


export default ResultsScreen;