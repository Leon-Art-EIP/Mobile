import React, { useState, useEffect, useContext } from 'react';
import { Alert, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar, RefreshControl, ToastAndroid, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import profilePicture from '../assets/images/user.png';
import bannerImage from '../assets/images/banner.jpg';
import Button from '../components/buttons/Button';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import { get, post, put } from '../constants/fetch';
import { getImageUrl, getRandomBgColor } from '../helpers/ImageHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { acCenter, aiCenter, asCenter, cBlack, cTextDark, flex1, jcCenter, mbAuto, mh24, mh4, mh8, mlAuto, mrAuto, mtAuto, mv4, mv8, pt8 } from '../constants/styles';
import { CollectionType } from '../constants/artTypes';
import { formatName } from '../helpers/NamesHelper';
import Card from '../components/cards/Card';

const OtherProfile = ({ route }) => {
  const navigation = useNavigation();
  const id = route?.params?.id;
  const context = useContext(MainContext);
  const token = context?.token;

  const [isFollowing, setIsFollowing] = useState(false);
  const [userArtworks, setUserArtworks] = useState([]);
  const [userArtworksCount, setUserArtworksCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('Artwork');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [collections, setCollections] = useState([]);

  const handleArtworkClick = (publicationId) => {
    navigation.navigate('singleart', { id: publicationId });
  };

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handleContactButtonClick = () => {
    return put(
      '/api/conversations/create',
      { UserOneId: context?.userId, UserTwoId: id },
      context?.token,
      (resp) => {
        navigation.navigate('single_conversation', {
          name: userData.username,
          ids: [resp.data.convId, context?.userId, id],
        });
      },
      (error) => console.error(error)
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

    const onErrorCallback = (error) => {
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
            (subscription) => subscription._id === id
          )
        );
      },
      (error) => console.error({ ...error })
    );
  };

  const fetchUserArtworks = async () => {
    if (!token) {
      console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      Alert.alert('Erreur', 'Veuillez vous reconnecter');
      return;
    }

    const url = `/api/art-publication/user/${id}`;

    const callback = (response) => {
      setUserArtworks(response.data);
      setUserArtworksCount(response.data.length);
    };

    const onErrorCallback = (error) => {
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

    const callback = (response) => {
      setUserData(response.data);
      fetchUserArtworks();
    };

    const onErrorCallback = (error) => {
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
          {userData && userData.availability !== 'unavailable' && (
            <Text style={styles.centerSubtitle}>Ouvert aux commandes</Text>
          )}
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.value}>{userData ? Math.max(userArtworksCount, 0) : 0}</Text>
          <Text style={styles.title}>posts</Text>
        </View>
      </View>

      {/* Boutons "Suivre" et "Ecrire" */}
      <View style={styles.contactAndFollow}>
        <Button
          value={isFollowing ? 'Suivi' : 'Suivre'}
          secondary={isFollowing}
          style={{
            width: 150,
            height: 38,
            borderRadius: 10,
            justifyContent: 'center',
          }}
          textStyle={{ fontSize: 14, textAlign: 'center' }}
          onPress={handleFollowButtonClick}
        />
        <Button
          value="Ecrire"
          secondary
          style={{ width: 150, height: 38, borderRadius: 10 }}
          textStyle={{ fontSize: 14 }}
          onPress={handleContactButtonClick}
        />
      </View>
      <View style={styles.decorativeLine} />
      <View style={styles.tabsNavigation}>
        <Button
          value="Artwork"
          secondary={activeTab !== 'Artwork'}
          primary={activeTab === 'Artwork'}
          style={[styles.navigationTabButton, styles.marginRightForTabs]}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('Artwork')}
        />
        <Button
          value="Collection"
          secondary={activeTab !== 'Collection'}
          primary={activeTab === 'Collection'}
          style={[styles.navigationTabButton, styles.marginRightForTabs]}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('Collection')}
        />
        <Button
          value="A propos"
          secondary={activeTab !== 'A propos'}
          primary={activeTab === 'A propos'}
          style={styles.navigationTabButton}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('A propos')}
        />
      </View>

      {/* Ensembles de cadres carrés */}
      {activeTab === 'Artwork' && (
        <View style={styles.squareContainer}>
          {userArtworks.map((artwork, index) => (
            <TouchableOpacity
              key={artwork._id}
              style={[styles.squareFrame, { marginRight: (index + 1) % 3 !== 0 ? 5 : 0 }]}
              onPress={() => handleArtworkClick(artwork._id)}
            >
              <Image
                style={styles.artworkImage}
                source={{ uri: getImageUrl(artwork.image) }}
                onError={() => console.log('Image loading error')}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {activeTab === 'Collection' && (
        <View style={styles.squareContainer}>
          {collections.length === 0 ? (
            <View style={[flex1, pt8]}>
              <Image
                source={require('../assets/icons/box.png')}
                style={[
                  { width: 100, height: 100 },
                  mlAuto,
                  mrAuto,
                ]}
              />
              <Text style={[cTextDark, mlAuto, mrAuto]}>
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
          )}
        </View>
      )}

      {activeTab === 'A propos' && (
        <Card>
          <ScrollView>
            <Text style={cTextDark}>
              {userData?.biography ?? "Cet personne utilise Leon'art pour redécouvrir l'art !"}
            </Text>
          </ScrollView>
        </Card>
      )}
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
  contactAndFollow: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 37,
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 17,
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginHorizontal: 10,
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
