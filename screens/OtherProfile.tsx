import React, { useState, useEffect, useContext, scrollView } from 'react';
import { Alert, Text, StyleSheet, Image, TouchableOpacity, RefreshControl, ToastAndroid, FlatList, StatusBar, View, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import Button from '../components/buttons/Button';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import { get, post, put } from '../constants/fetch';
import { getImageUrl, getRandomBgColor } from '../helpers/ImageHelper';
import { aiCenter, asCenter, cBlack, cTextDark, flex1, flexRow, fwBold, jcCenter, mb8, mh8, ml4, ml8, mlAuto, mrAuto, mv4, tavCenter } from '../constants/styles';
import { formatName } from '../helpers/NamesHelper';
import Card from '../components/cards/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import Title from '../components/text/Title';


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


type RatingType = {
  orderId: string;
  rating: number;
  comment: string;
  completedAt: Date;
  buyerUsername: string;
  buyerProfilePicture: string;
}


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
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratings, setRatings] = useState<RatingType[]>([]);


  const handleArtworkClick = (publicationId: string) => {
    navigation.navigate('singleart', { id: publicationId });
  };


  const handleBackButtonClick = () => {
    navigation.goBack();
  };


  const isUserFollowing = () => {
    return userData?.subscribers.includes(context?.userId ?? "UNDEFINED");
  }


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
    };

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
    };

    return put(
      '/api/conversations/create',
      { UserOneId: context?.userId, UserTwoId: id },
      context?.token,
      onSuccess,
      (error: any) => {
       if (error.response.status === 409) {
         return onSuccess(error.response);
       }
       return console.error({ ...error });
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
      fetchUserData();
      setIsFollowing(prev => !prev);
    };

    const onErrorCallback = () => {
      console.error('Erreur de follow :');
      Alert.alert('Erreur de follow', "Une erreur s'est produite.");
    };

    post(url, {}, token, callback, onErrorCallback);
  };

  const checkIsFollowing = async () => {
    if (!token) {
      console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      return Alert.alert('Erreur', 'Veuillez vous reconnecter');
    }

    get(
      '/api/follow/following',
      token,
      (response: any) => {
        if (response?.data?.subscribers?.length > 0) {
          return setIsFollowing(
            !!response.data?.subscribers?.includes(id)
          );
        }
      },
      (error: any) => console.error("[api/follow/following]", error)

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

  const getAverageRating = () => {
    if (!userData?._id) {
      return;
    }

    get(
      `/api/order/user/${userData._id}/average-rating`,
      context.token,
      (res: any) => setAverageRating(res.data.averageRating ?? 0),
      (err: any) => console.error({ ...err })
    );
  };

  const getComments = () => {
    if (!userData?._id) {
      return;
    }

    get(
      `/api/order/user/${userData._id}/ratings`,
      context.token,
      (res: any) => setRatings([ ...res.data ]),
      (err: any) => console.error({ ...err })
    );
  };

  const fetchInfos = () => {
    setIsRefreshing(true);
    fetchUserArtworks();
    getCollections();
    getAverageRating();
    getComments();
    checkIsFollowing();
    setIsRefreshing(false);
  };

  useEffect(fetchInfos, [userData]);

  useEffect(() => {
    setIsRefreshing(true);
    fetchUserData();
    checkIsFollowing();
  }, []);

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
          color={colors.tertiary}
          size={24}
        />
      </TouchableOpacity>

      {/* Report button */}
      { userData?._id !== context?.userId && (
        <TouchableOpacity
          onPress={() => navigation.navigate('report', {
            id: userData?._id,
            type: 'account'
          })}
          style={styles.reportDiv}
        >
          <MaterialIcons
            name="report-problem"
            color={colors.tertiary}
            size={24}
          />
        </TouchableOpacity>
      ) }

      {/* Bannière */}
      <View style={styles.banner}>
        <Image
          source={{ uri: getImageUrl(userData?.bannerPicture) }}
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
          <Text style={styles.value}>
            { userData ? Math.max(userData.subscribers.length, 0) : 0 }
          </Text>
          <Text style={styles.title}>
            followers
          </Text>
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
      { userData?._id !== context?.userId && (
        <View style={styles.contactAndFollowView}>
          <Button
            value={isUserFollowing() ? 'Suivi' : 'Suivre'}
            style={[
              isUserFollowing() ? styles.isFollowingButton : styles.followButton,
              { borderColor: context?.userColor }
            ]}
            textStyle={{
              fontSize: 14,
              textAlign: 'center',
              fontWeight: '600',
              color: isUserFollowing() ? context?.userColor : colors.white,
            }}
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
      ) }

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
              numColumns={3}
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
        <>
        <ScrollView>
          <Card>
              <Title size={20}>Description</Title>
              <Text style={cTextDark}>
                { userData?.biography ?
                  userData.biography :
                  "Cet personne utilise Leon'art pour redécouvrir l'art !"
                }
              </Text>
            {/* </ScrollView> */}
          </Card>

          <Card style={flexRow}>
            <Title size={20} style={mrAuto}>Note moyenne</Title>

            { averageRating !== 0 ? [1, 2, 3, 4, 5].map((item: number) => (
              <AntDesign
                key={item}
                name={averageRating && averageRating >= item ? 'star' : 'staro'}
                color={colors.deepyellow}
                size={32}
              />
            )) : (
              <Text style={[cTextDark, asCenter]}>
                Pas de note pour l'instant !
              </Text>
            ) }
          </Card>
          <Card>
            <Title size={20} style={mb8}>Commentaires</Title>

            { ratings.length !== 0 ? (
              <FlatList
                data={ratings}
                renderItem={({ item }: { item: RatingType }) => (
                  <View>
                    <View style={flexRow}>
                      <Image
                        source={{ uri: getImageUrl(item.buyerProfilePicture) }}
                        style={styles.ratingProfilePictureImage}
                      />
                      <Text style={[cTextDark, tavCenter, ml8, fwBold]}>
                        { item.buyerUsername }
                      </Text>

                      <View style={[ mlAuto, flexRow ]}>
                        <Text style={[
                          cTextDark,
                          tavCenter,
                          { color: item.rating >= 3 ? colors.textDark : colors.primary }
                        ]}>
                          { item.rating }/5
                        </Text>
                        <AntDesign
                          name={'star'}
                          color={item.rating >= 3 ? colors.deepyellow : colors.primary}
                          size={24}
                          style={ml4}
                        />
                      </View>
                    </View>
                    <Text style={cTextDark}>{ item.comment }</Text>
                    <View style={styles.line} />
                  </View>
                )}
              />
            ) : (
              <Text style={cTextDark}>
                Ce profil n'a pas reçu de commentaires pour l'instant !
              </Text>
            ) }
            </Card>
          </ScrollView>
        </>
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
  followingButton: {
    flex: 1,
    borderRadius: 50
  },
  followButton: {
    flex: 1,
    borderRadius: 50
  },
  isFollowingButton: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 2,
    backgroundColor: colors.disabledBg,
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
    backgroundColor: colors.bg,
    borderRadius: 50,
    padding: 8,
    position: 'absolute',
    top: 18,
    left: 18,
    zIndex: 1,
  },
  artworkImage: {
    height: 120,
    width: 120,
    borderRadius: 7,
  },
  reportDiv: {
    zIndex: 2,
    position: 'absolute',
    right: 18,
    top: 18,
    backgroundColor: colors.bg,
    borderRadius: 50,
    padding: 8
  },
  ratingProfilePictureImage: {
    height: 30,
    width: 30,
    borderRadius: 50
  },
  line: {
    backgroundColor: colors.text,
    height: 1,
    width: "50%",
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 4
  }
});

export default OtherProfile;
