import { Alert, View, Text, Linking, StyleSheet, Image, TouchableOpacity, FlatList, RefreshControl, StatusBar, ScrollView, Dimensions, ToastAndroid } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-native-modal';
// Local imports
import Button from '../components/buttons/Button';
import colors from '../constants/colors';

import { MainContext } from '../context/MainContext';
import { get, post } from '../constants/fetch';
import { getImageUrl, getRandomBgColor } from '../helpers/ImageHelper';
import { aiCenter, bgColor, cTextDark, flex1, flexRow, jcCenter, mh4, mlAuto, mrAuto, mt8, mv4, mr20, mtAuto, mbAuto, mh24, bgRed } from '../constants/styles';
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Card from '../components/cards/Card';
import { CollectionType } from '../constants/artTypes';
import { formatName } from '../helpers/NamesHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/textInput/Input';
import Subtitle from '../components/text/Subtitle';


const Profile = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Artwork');
  const [userCollections, setUserCollections] = useState<CollectionType[]>([]);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const context = useContext(MainContext);
  const [newCollectionName, setNewCollectionName] = useState<string>("");
  const token = context?.token;
  const userID = context?.userId;

  const [instagramUrl, setInstagramUrl] = useState<string>('');
  const [twitterUrl, setTwitterUrl] = useState<string>('');
  const [tiktokUrl, setTiktokUrl] = useState<string>('');
  const [facebookUrl, setFacebookUrl] = useState<string>('');


  const handleToFollowerList = () => {
    // TODO : rendre dynamique
    navigation.navigate('follower_list');
  };

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handleEditButtonClick = () => {
    navigation.navigate('edit_profile');
  };

  const handleSettingsButtonClick = () => {
    navigation.navigate('settings');
  };

  const handleArtworkClick = (id: string) => {
    navigation.navigate('singleArt', { id: id });
  };

  const handleCollectionClick = (collection: CollectionType) => {
    navigation.navigate('collection', { collection: collection });
  };

  interface Artwork {
    _id: string;
    userId: string;
    image: string;
    artType: string;
    name: string;
    description: string;
    dimension: string;
    isForSale: boolean;
    price: number;
    location: string;
    likes: any[];
    comments: any[];
    __v: number;
  }

  interface UserData {
    _id: string;
    username: string;
    is_artist: boolean;
    availability: string;
    subscription: string;
    collections: any[];
    subscriptions: any[];
    subscribers: any[];
    subscribersCount: number;
    likedPublications: any[];
    canPostArticles: boolean;
    __v: number;
    bannerPicture: string;
    profilePicture: string;
    biography: string;
  }

  const handleIconPress = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL", err));
  };

  const fetchUserArtworks = async () => {
    if (!token) {
      console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      return;
    }

    const url = `/api/art-publication/user/${context.userId}`;
    console.log(context);

    const callback = (response: any) => {
      setUserArtworks(response.data);
    };

    const onErrorCallback = (error: any) => {
      Alert.alert('Une erreur est survenue', 'Nous n\'avons pas pu récupérer les informations liées à votre compte.');
      return console.error('Error fetching user artworks:', error);
    };

    get(url, token, callback, onErrorCallback);
  };

  const fetchUserData = async () => {
    if (!token) {
      Alert.alert('Une erreur est survenue', 'Veuillez vous reconnecter.');
      console.error('Token JWT not found. Make sure the user is logged in.');
      return;
    }
  
    const url = `/api/user/profile/${userID}`;
  
    const callback = (response: any) => {
      setUserData(response.data);
      fetchUserArtworks();
      
      const socialLinks = response.data.socialMediaLinks || {};
      setInstagramUrl(socialLinks.instagram || '');
      setTwitterUrl(socialLinks.twitter || '');
      setTiktokUrl(socialLinks.tiktok || '');
      setFacebookUrl(socialLinks.facebook || '');
    };
  
    const onErrorCallback = (error: any) => {
      Alert.alert('Une erreur est survenue', 'Nous n\'avons pas pu récupérer les informations liées à votre compte.');
      return console.error('Error fetching user data:', error);
    };
  
    get(url, token, callback, onErrorCallback);
  };
  

  const updateCollections = async () => {
    if (!token) {
      console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      Alert.alert("Erreur", "Veuillez vous reconnecter");
      return;
    }

    get(
      `/api/collection/my-collections`,
      token,
      (response: any) => {
        setUserCollections(response.data);
        setIsRefreshing(false);
      },
      (error: any) => console.error({ ...error })
    );
  };

  const reloadProfile = () => {
    console.log("context: ", context);
    setIsRefreshing(true);
    fetchUserData();
    updateCollections();
  };


  // Should be able to create a new empty collection from the profile screen
  // but it doesn't work yet. We're waiting for the back-end (as usual lol)
  const createCollection = async (collectionName: string) => {
    if (!token) {
      console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      return Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
    }

    if (!collectionName) {
      return ToastAndroid.show('Veuillez nommer votre collection', ToastAndroid.SHORT);
    }

    const url = `/api/collection`;
    const body = {
      artPublicationId: undefined,
      collectionName: collectionName,
      isPublic: true,
    };

    const callback = (response: any) => {
      Alert.alert('Oeuvre ajoutée à la collection "' + collectionName + '".');
    };

    const onErrorCallback = (error: any) => {
      console.error('Error while saving to collection:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'enregistrement dans la collection.');
    };

    post(url, body, token, callback, onErrorCallback);
    return setIsModalVisible(false);
  };

  useFocusEffect(
    React.useCallback(reloadProfile, [navigation])
  );


  useEffect(reloadProfile, []);


  return (
    <SafeAreaView style={[ flex1, bgColor ]}>
      <StatusBar backgroundColor={colors.bg} barStyle="dark-content" />

      {/* Buttons : Back, Edit profile and Settings */}
      <View style={[ flexRow, mr20, { zIndex: 2 } ]}>

        {/* Go back button */}
        <TouchableOpacity
          onPress={handleBackButtonClick}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back-outline"
            color={colors.whitesmoke}
            size={32}
          />
        </TouchableOpacity>

        {/* Edit button */}
        <TouchableOpacity
          onPress={() => handleEditButtonClick()}
          style={styles.editButton}
        >
          <Feather name="edit-2" color={colors.whitesmoke} size={24} />
        </TouchableOpacity>

        {/* Settings button */}
        <TouchableOpacity
          onPress={() => handleSettingsButtonClick()}
          style={styles.settingButton}
        >
          <MaterialIcons
            name="settings"
            color={colors.whitesmoke}
            size={32}
          />
        </TouchableOpacity>
      </View>
      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={{ uri: getImageUrl(userData?.bannerPicture) }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Profile picture */}
      <View style={styles.overlayImage}>
        <View style={styles.circleImageContainer}>
          <Image
            source={{ uri: getImageUrl(userData?.profilePicture) }}
            style={styles.profilePicture}
          />
        </View>
      </View>

      {/* Text blocks : followers, name and posts*/}
      <View style={styles.textBlocks}>

        {/* Bloc de texte followers */}
        <View style={styles.textBlock}>
          <TouchableOpacity onPress={handleToFollowerList}>
            <View style={styles.centeredText}>
              <Text style={styles.value}>{userData ? Math.max(userData.subscribersCount, 0) : 0}</Text>
              <Text style={styles.title}>abonnés</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bloc de texte au centre */}
        <View style={styles.centerTextBlock}>
          <Text style={styles.centerTitle}>{userData ? userData.username : ""}</Text>
          {userData && userData.availability !== "unavailable" && (
            <Text style={styles.centerSubtitle}>Ouvert aux commandes</Text>
          )}
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.value}>{userData ? Math.max(userArtworks.length, 0) : 0}</Text>
          <Text style={styles.title}>posts</Text>
        </View>
      </View>

      {/* Decorative line */}
      <View style={styles.decorativeLine} />

      {/* Tab selections button : Artwork, Collections and About */}
      <View style={styles.tabsNavigation}>
        <Button
          value="Oeuvres"
          secondary={activeTab !== 'Artwork'}
          tertiary={activeTab === 'Artwork'}
          style={[styles.navigationTabButton, styles.marginRightForTabs]}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('Artwork')}
        />
        <Button
          value="Collections"
          secondary={activeTab !== 'Collections'}
          tertiary={activeTab === 'Collections'}
          style={[styles.navigationTabButton, styles.marginRightForTabs]}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('Collections')}
        />
        <Button
          value="A propos"
          secondary={activeTab !== 'A propos'}
          tertiary={activeTab === 'A propos'}
          style={styles.navigationTabButton}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('A propos')}
        />
      </View>

      {/* Artworks */}
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
              renderItem={(e) => (
                <TouchableOpacity
                  onPress={() => handleArtworkClick(e.item._id)}
                  key={e.item._id}
                  style={[mh4, mv4]}
                >
                  <Image
                    source={{ uri: getImageUrl(e.item.image) }}
                    style={styles.artworkImage}
                  />
                </TouchableOpacity>
              )}
              refreshControl={(
                <RefreshControl
                  colors={[colors.primary]}
                  refreshing={isRefreshing}
                  onRefresh={reloadProfile}
                />
              )}
            />
          ) }
        </View>
      )}

      {/* Collections tab */}
      { activeTab === 'Collections' && (
        <>
          { userCollections.length !== 0 ? (
            <FlatList
              contentContainerStyle={[mh24]}
              data={userCollections}
              numColumns={3}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  key={item?._id.toString()}
                  style={[
                    styles.squareFrame,
                    { backgroundColor: getRandomBgColor() }
                  ]}
                  onPress={() => handleCollectionClick(item)}
                >
                  <Text style={styles.collectionName}>{
                    formatName(item?.name ?? "Collection", 10)
                  }</Text>
                </TouchableOpacity>
              )}
              refreshControl={(
                <RefreshControl
                  colors={[colors.primary]}
                  refreshing={isRefreshing}
                  onRefresh={reloadProfile}
                />
              )}
            />
          ) : (
            <Card style={{
              backgroundColor: colors.offerBg,
              alignSelf: 'center',
              ...aiCenter, ...mtAuto, ...mbAuto
            }}>
              <TouchableOpacity
                style={flexRow}
                /* onPress={() => setIsModalVisible(true)} */
                onPress={() => ToastAndroid.show("Cette fonctionnalité arrive bientôt !", ToastAndroid.LONG)}
              >
                <Ionicons name="add" color={colors.offerFg}size={24} />
                <Text style={{ color: colors.offerFg, marginLeft: 8 }}>Créer une nouvelle collection</Text>
              </TouchableOpacity>
            </Card>
          ) }
        </>
      ) }

      { activeTab === 'A propos' && (
        <Card style={styles.biographyContainer}>
          <Text style={[styles.biography, cTextDark]}>
            {userData?.biography ?? "Cette personne utilise Leon'art pour redécouvrir l'art !"}
          </Text>
          <View style={styles.rowContainer}>

            { instagramUrl && (
              <TouchableOpacity onPress={() => handleIconPress(instagramUrl)}>
                <Ionicons
                  name="logo-instagram"
                  color={colors.darkGreyBg}
                  size={24}
                />
              </TouchableOpacity>
            ) }
            { twitterUrl && (
              <TouchableOpacity onPress={() => handleIconPress(twitterUrl)}>
                <Ionicons
                  name="logo-twitter"
                  color={colors.darkGreyBg}
                  size={24}
                />
              </TouchableOpacity>
            ) }
            { facebookUrl && (
              <TouchableOpacity onPress={() => handleIconPress(facebookUrl)}>
                <Ionicons
                  name="logo-facebook"
                  color={colors.darkGreyBg}
                  size={24}
                />
              </TouchableOpacity>
            ) }
            { tiktokUrl && (
              <TouchableOpacity onPress={() => handleIconPress(tiktokUrl)}>
                <Ionicons
                  name="logo-pinterest"
                  color={colors.darkGreyBg}
                  size={24}
                />
              </TouchableOpacity>
            ) }
          </View>
        </Card>
      ) }

      {/* Collection modal */}
      <Modal
        isVisible={isModalVisible}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Subtitle style={styles.modalTitle}>Créer une nouvelle collection</Subtitle>

          <Input
            style={styles.input}
            placeholder="Nouvelle collection"
            onTextChanged={setNewCollectionName}
          />

          <View style={[flexRow, mt8]}>
            <Button
              value="Annuler"
              style={styles.collectionBtn}
              textStyle={{ fontSize: 14 }}
              onPress={() => setIsModalVisible(false)}
              secondary
            />
            <Button
              value="Créer"
              onPress={() => createCollection(newCollectionName)}
              style={styles.collectionBtn}
              textStyle={{ fontSize: 14 }}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredText: {
    justifyContent: 'center',
    alignItems: 'center', // Ajoutez cette ligne
  },
  input: {
    backgroundColor: colors.disabledBg,
    marginHorizontal: 4,
    marginVertical: 8,
  },
  banner: {
    backgroundColor: 'lightblue',
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
  modal: {
    height: Dimensions.get('window').height / 3,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Dimensions.get('window').width - 24,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
  },
  collectionBtn: {
    marginHorizontal: 2,
    height: 40,
    marginVertical: 0,
    flex: 1,
  },
  modalTitle: {
    color: colors.textDark,
    fontSize: 18,
    marginBottom: 10,
  },
  collectionButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    alignItems: 'center',
  },
  collectionButtonText: {
    color: '#3498db',
  },
  profilePicture: {
    width: 110,
    height: 110,
    backgroundColor: colors.white,
    borderRadius: 200
  },
  circleImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 100,
    overflow: 'hidden',
    position: 'absolute',
    top: -55,
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
    color: colors.black,
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.black,
  },
  centerTextBlock: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  centerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.black,
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
    backgroundColor: colors.black,
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginLeft: 20,
    marginRight: 20,
  },
  squareFrame: {
    flex: 1,
    height: 115,
    backgroundColor: colors.platinium,
    borderRadius: 10,
    margin: 5,
    marginBottom: 10,
  },
  squareContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 50,
  },
  settingButton: {
    position: 'absolute',
    top: 16,
    right: 0,
  },
  collectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    padding: 8,
    marginBottom: 5,
    borderRadius: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  artworkName: {
    fontSize: 16,
    color: 'black',
    marginLeft: 20,
  },
  biographyContainer: {
    backgroundColor: colors.bg,
    marginLeft: 24,
    marginRight: 24,
    marginTop: 5,
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  biography: {
    marginHorizontal: 0,
    marginVertical: 0,
    fontSize: 14,
    color: colors.black,
  },
  artworkImage: {
    height: 120,
    width: 120,
    borderRadius: 7,
  },
});

export default Profile;
