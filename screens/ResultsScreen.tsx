import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/Title';
import colors from '../constants/colors';
import { get } from '../constants/fetch';
import { MainContext } from '../context/MainContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { aiCenter, bgGrey, br20, cBlack, cDisabled, flex1, flexRow, jcCenter, mh8, mv4, mv8, ph8, pv24 } from '../constants/styles';
import { formatName } from '../helpers/NamesHelper';
import { getImageUrl } from '../helpers/ImageHelper';


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


  const navigateToPreview = (post: ArtPublicationType) => {
    navigation.navigate('single_art', { id: post?._id });
  }


  const navigateToProfile = (user: UserType) => {
    navigation.navigate('other_profile', { id: user._id })
  }


  useEffect(() => {
    // Get results from received API call
    get(
      "/api/explorer/search?" + params?.url,
      context?.token,
      (res: any) => {
        setPosts(res?.data?.artPublications);
        setUsers(res?.data?.users);
      },
      (err: any) => console.error({ ...err })
    );
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      {/* Header */}
      <View style={[flexRow, aiCenter, mv8]}>
        <Ionicons
          name='chevron-back'
          size={32}
          color={colors.title}
          onPress={() => navigation.goBack()}
          style={mh8}
        />
        <Title>Search</Title>
      </View>

      {/* User horizontal list */}
      { users.length === 0 ? (
        <View style={[jcCenter, aiCenter, pv24, br20, mh8, bgGrey]}>
          <Image
            source={require('../assets/icons/box.png')}
            style={styles.emptyImg}
          />
          <Text style={cDisabled}>Il n'y a pas d'artiste qui porte ce nom !</Text>
        </View>
      ) : (
        <ScrollView horizontal style={[bgGrey, br20, mh8]}>
          { users.map((user: UserType) => (
            <TouchableOpacity
              key={user._id}
              style={[aiCenter, pv24, ph8]}
              onPress={() => navigateToProfile(user)}
            >
              <Image
                style={styles.userImg}
                source={{ uri: getImageUrl(user.profilePicture) }}
              />
              <Text style={[mv4, cBlack]}>{ formatName(user.username, 20) }</Text>
            </TouchableOpacity>
          )) }
        </ScrollView>
      ) }

      {/* Data */}
      <View style={styles.postsFlatlist}>
        { posts.length === 0 ? (

          <View style={[jcCenter, aiCenter, flex1]}>
            <Image
              source={require('../assets/icons/box.png')}
              style={styles.emptyImg}
            />
            <Text>Il n'y a pas de postes qui correspondent à la recherche !</Text>
          </View>

        ) : (

          <FlatList
            data={posts}
            numColumns={3}
            renderItem={({ item, index }) => { console.log(index); return(
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
                {/* <Text>{ e.item?.name }</Text> */}
              </TouchableOpacity>
            )}}
          />

        ) }
      </View>
    </SafeAreaView>
  );
}


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
    borderRadius: 20,
    flex: 1
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
