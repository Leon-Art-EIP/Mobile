import React, { useState, useEffect, useContext } from 'react';
import { Alert, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar, RefreshControl, ToastAndroid, FlatList, ListRenderItem, FlatListProps } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../components/buttons/Button';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import { get, post, put } from '../constants/fetch';
import { getImageUrl, getRandomBgColor } from '../helpers/ImageHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { acCenter, aiCenter, bgRed, cBlack, cTextDark, flex1, jcCenter, mbAuto, mh8, mlAuto, mrAuto, mtAuto, mv4, pt8 } from '../constants/styles';
import { formatName } from '../helpers/NamesHelper';
import Card from '../components/cards/Card';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


type UserDataType = {
  subscriptions: any[];
  stripeAccountId: string;
  subscribers: string[];                            // userIDs who subscribed ?
  subscribersCount: number;
  availability: string;
  subscription: string;
  canPostArticles: boolean;
  is_artist: boolean;
  username: string;
  location: string;
  quizz: string;                                    // I should ask wtf that is
  profilePicture: string;
  collections: string[];                            // collection IDs
  bannerPicture: string;
  likedPublications: string[];                      // userIDs who liked
  biography: string;
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  _id: string;
};

type UserArtworkType = {
   _id: string;
   image: string;
   isForSale: boolean;
   comments: any[];
   description: string;
   userId: string;
   createdAt: {
     _seconds: number;
     _nanoseconds: number;
  },
   artType: string;
   isSold: boolean;
   name: string;
   location: string;
   dimension: string;
   likes: string[]               // userIDs who liked
};


const OtherProfile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const id = route?.params?.id;
  const context = useContext(MainContext);
  const token = context?.token;

  const [isFollowing, setIsFollowing] = useState(false);
  const [userArtworks, setUserArtworks] = useState<UserArtworkType[]>([]);
  const [userData, setUserData] = useState<UserDataType | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('Artwork');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [collections, setCollections] = useState([]);

  const handleArtworkClick = (publicationId: string) => {
    navigation.navigate('singleart', { id: publicationId });
  };

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handleContactButtonClick = () => {
    const navigateToConversation = (
      username: string,
      convId: string,
      userId: string | undefined,
      userTwoId: string
    ) => {
      if (!userId) {
        return console.warn("couldn't navigate because user id is empty");
      }

      navigation.navigate('single_conversation', {
        name: username,
        ids: [ convId, userId, userTwoId ]
      });
    }

    const onSuccess = (resp: any) => {
      if (userData) {
        return navigateToConversation(
          userData.username,
          resp.data.convId,
          context?.userId,
          id
        );
      }
      return console.error("Error loading user");
    }

    return put(
      '/api/conversations/create',
      { UserOneId: context?.userId, UserTwoId: id },
      context?.token,
      onSuccess,
      (error: any) => {
       if (error.response.status === 409) {
         return onSuccess(error.response);
       }
       return console.error({ ...error })
      }
    );
  };


  const handleFollowButtonClick = async () => {
    if (!token) {
      console.error('Token JWT not found. Make sure the user is logged in.');
      return;
    }

    const url = `/api/follow/${id}`;

    const callback = () => {
      return fetchInfos();
    };

    const onErrorCallback = (error: any) => {
      console.error('Erreur de follow :', error);
      return Alert.alert('Erreur de follow', 'Une erreur s\'est produite.');
    };

    post(url, {}, token, callback, onErrorCallback);
    fetchUserData();
  };

  const checkIsFollowing = async () => {
    if (!token) {
      console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      return Alert.alert('Erreur', 'Veuillez vous reconnecter');
    }

    get(
      '/api/follow/following',
      token,
      (response) => {
        setIsFollowing(
          !!response.data?.subscriptions.some(
            (subscription: any) => subscription._id === id
          )
        );
      },
      (error: any) => console.error("[api/follow/following]", { ...error })
    );
  };

  const fetchUserArtworks = async () => {
    if (!token) {
      console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      Alert.alert('Erreur', 'Veuillez vous reconnecter');
      return;
    }

    const url = `/api/art-publication/user/${id}`;

    const callback = (res: any) => setUserArtworks(res.data);

    const onErrorCallback = (error: any) => {
      Alert.alert('Error fetching user artworks', 'An error occurred while fetching user artworks.');
      return console.error('Error fetching user artworks:', error);
    };

    get(url, token, callback, onErrorCallback);
  };

  const fetchUserData = () => {
    if (!token) {
      return console.error('Token JWT not found. Make sure the user is logged in.');
    }

    const url = `/api/user/profile/${id}`;

    const callback = (response: any) => {
      setUserData(response.data);
      fetchUserArtworks();
    };

    const onErrorCallback = (error: any) => {
      console.error('Error fetching user data:', error);
    };

    get(url, token, callback, onErrorCallback);
  };

  const getCollections = () => {
    return get(
      `/api/collection/user/${id}/collections`,
      context?.token,
      (res) => {
        setCollections(res.data);
      },
      (err) => {
        console.error('Error getting collections: ', err);
        return ToastAndroid.show(
          'Nous n\'avons pas réussi à avoir les collections de cet utilisateur.',
          ToastAndroid.LONG
        );
      }
    );
  };

  const fetchInfos = () => {
    setIsRefreshing(true);
    fetchUserData();
    fetchUserArtworks();
    getCollections();
    checkIsFollowing();
    setIsRefreshing(false);
  };

  useEffect(fetchInfos, []);

  useFocusEffect(
    React.useCallback(() => {}, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.white}
        barStyle="dark-content"
      />

      {/* Bouton de retour en haut à gauche */}
      <TouchableOpacity
        onPress={handleBackButtonClick}
        style={styles.backButton}
      >
        <AntDesign
          name="left"
          color={colors.white}
          size={24}
        />
      </TouchableOpacity>

      {/* Report button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('report', {
          id: userData?._id,
          type: 'account'
        })}
        style={{ zIndex: 2, position: 'absolute', right: 0 }}
      >
        <MaterialIcons
          name="report-problem"
          color={colors.primary}
          size={24}
        />
      </TouchableOpacity>

      {/* Bannière */}
      <View style={styles.banner}>
        <Image
          source={{ uri: getImageUrl(userData?.bannerImage) }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Photo de profil */}
      <View style={styles.overlayImage}>
        <View style={styles.circleImageContainer}>
          <Image
            source={{ uri: getImageUrl(userData?.profilePicture) }}
            style={styles.profilePicture}
            defaultSource={require('../assets/icons/account.svg')}
          />
        </View>
      </View>

      {/* Blocs de texte */}
      <View style={styles.textBlocks}>
        <View style={styles.textBlock}>
          <Text style={styles.value}>{userData ? Math.max(userData.subscribersCount, 0) : 0}</Text>
          <Text style={styles.title}>followers</Text>
        </View>
        <View style={styles.centerTextBlock}>
          <Text style={styles.centerTitle}>{userData ? userData.username : ''}</Text>
          {userData && userData?.availability !== 'unavailable' && (
            <Text style={styles.centerSubtitle}>Ouvert aux commandes</Text>
          )}
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.value}>{userData ? Math.max(userArtworks.length, 0) : 0}</Text>
          <Text style={styles.title}>posts</Text>
        </View>
      </View>

      {/* Boutons "Suivre" et "Ecrire" */}
      <View style={styles.contactAndFollowView}>
        <Button
          value={isFollowing ? 'Suivi' : 'Suivre'}
          secondary={isFollowing}
          style={styles.contactAndFollowBtn}
          textStyle={{ fontSize: 14, textAlign: 'center' }}
          onPress={handleFollowButtonClick}
        />
        <Button
          value="Ecrire"
          secondary
          style={styles.contactAndFollowBtn}
          textStyle={{ fontSize: 14 }}
          onPress={handleContactButtonClick}
        />
      </View>

      {/* Separator */}
      <View style={styles.decorativeLine} />

      {/* Tabs */}
      <View style={styles.tabsNavigation}>
        <Button
          value="Artwork"
          tertiary={activeTab === 'Artwork'}
          secondary={activeTab !== 'Artwork'}
          style={[styles.navigationTabButton, styles.marginRightForTabs]}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('Artwork')}
        />
        <Button
          value="Collection"
          tertiary={activeTab === 'Collection'}
          secondary={activeTab !== 'Collection'}
          style={[styles.navigationTabButton, styles.marginRightForTabs]}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('Collection')}
        />
        <Button
          value="A propos"
          tertiary={activeTab === 'A propos'}
          secondary={activeTab !== 'A propos'}
          style={styles.navigationTabButton}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('A propos')}
        />
      </View>

      {/* Ensembles de cadres carrés */}
      { activeTab === 'Artwork' && (
        <View style={styles.squareContainer}>

          { userArtworks.length === 0 ? (
            <View style={[ flex1, aiCenter, jcCenter ]}>
              <Image
                source={require('../assets/icons/box.png')}
                style={[
                  { width: 80, height: 80 },
                  mlAuto,
                  mrAuto,
                ]}
              />
              <Text style={[ cTextDark ]}>
                Cet utilisateur n'a pas posté d'oeuvres !
              </Text>
            </View>
          ) : (
            <FlatList
              data={userArtworks}
              renderItem={({ item, index }: { item: UserArtworkType, index: number }) => (
                <TouchableOpacity
                  key={item._id}
                  style={[styles.squareFrame, { marginRight: (index + 1) % 3 !== 0 ? 5 : 0 }]}
                  onPress={() => handleArtworkClick(item?._id)}
                >
                  <Image
                    style={styles.artworkImage}
                    source={{ uri: getImageUrl(item?.image) }}
                    onError={() => console.log('Image loading error')}
                  />
                </TouchableOpacity>
              )}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  refreshing={isRefreshing}
                  onRefresh={fetchInfos}
                />
              }
            />
          ) }
        </View>
      ) }

      { activeTab === 'Collection' && (
        <View style={styles.squareContainer}>

          { collections.length === 0 ? (
            <View style={[ flex1, aiCenter, jcCenter ]}>
              <Image
                source={require('../assets/icons/box.png')}
                style={[
                  { width: 80, height: 80 },
                  mlAuto,
                  mrAuto,
                ]}
              />
              <Text style={[ cTextDark ]}>
                Cet utilisateur n'a pas de collections publiques !
              </Text>
            </View>
          ) : (
            <FlatList
              data={collections}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item?._id.toString()}
                  style={[
                    styles.squareFrame,
                    { backgroundColor: getRandomBgColor() },
                  ]}
                  onPress={() => navigation.navigate('collection', { collection: item })}
                >
                  <Text style={[cBlack, mh8, mv4]}>
                    {formatName(item?.name ?? 'Collection', 10)}
                  </Text>
                </TouchableOpacity>
              )}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  refreshing={isRefreshing}
                  onRefresh={fetchInfos}
                />
              }
            />
          ) }
        </View>
      )}

      { activeTab === 'A propos' && (
        <Card>
          <ScrollView>
            <Text style={cTextDark}>
              {userData?.biography ?? "Cet personne utilise Leon'art pour redécouvrir l'art !"}
            </Text>
          </ScrollView>
        </Card>
      ) }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  banner: {
    backgroundColor: colors.whitesmoke,
    height: 180,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  overlayImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    backgroundColor: colors.white,
    width: 110,
    height: 110,
  },
  circleImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 100,
    overflow: 'hidden',
    position: 'absolute',
    top: -55,
    elevation: 2,
  },
  textBlocks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 70,
  },
  textBlock: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '400',
    color: colors.tertiary,
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.tertiary,
  },
  centerTextBlock: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  centerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.tertiary,
    textAlign: 'center',
  },
  centerSubtitle: {
    fontSize: 12,
    color: 'rgba(112, 0, 255, 1)',
  },
  contactAndFollowView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8
  },
  contactAndFollowBtn: {
    flex: 1,
    borderRadius: 50
  },
  decorativeLine: {
    height: 1,
    backgroundColor: colors.tertiary,
    marginVertical: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  tabsNavigation: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navigationTabButton: {
    width: 105,
    height: 38,
    justifyContent: 'center',
  },
  navigationTabButtonText: {
    fontSize: 12,
  },
  marginRightForTabs: {
    marginRight: 5,
  },
  squareFrame: {
    width: 115,
    height: 115,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    margin: 5,
  },
  squareContainer: {
    flex: 1,
    marginHorizontal: 24,
  },
  backButton: {
    padding: 15,
    position: 'absolute',
    zIndex: 1,
  },
  artworkImage: {
    height: 120,
    width: 120,
    borderRadius: 7,
  },
});

export default OtherProfile;
