import { Alert, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, RefreshControl, FlatListProps, ListRenderItem, ImageBackground, StatusBar } from 'react-native'
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// Local imports
import SettingsButtonImage from '../assets/images/settings_logo.png'
import EditButtonImage from '../assets/images/edit_logo.png'
import BackArrow from '../assets/images/back_arrow.png'
import emptyCollectionImage from '../assets/icons/hamburger.png'
import Button from '../components/Button';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import { get } from '../constants/fetch';
import { getImageUrl, getRandomBgColor } from '../helpers/ImageHelper';
import { cTextDark, mh4, mv4 } from '../constants/styles';
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Card from "../components/Card";
import { CollectionType } from '../constants/artTypes';
import { formatName } from '../helpers/NamesHelper';
import { SafeAreaView } from 'react-native-safe-area-context';


const Profile = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Artwork');
  const [userCollections, setUserCollections] = useState<CollectionType[]>([]);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [userArtworksCount, setUserArtworksCount] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const context = useContext(MainContext);
  const token = context?.token;
  const userID = context?.userId;


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

  const fetchUserArtworks = async () => {
    try {
      if (token) {
        const url = `/api/art-publication/user/${userID}`;
        const callback = (response) => {
          setUserArtworks(response.data);
          setUserArtworksCount(response.data.length);
        };
        const onErrorCallback = (error) => {
          console.error('Error fetching user artworks:', error);
          if (error.response) {
            // La requête a été effectuée et le serveur a répondu avec un statut de réponse qui n'est pas 2xx
            console.error('Server responded with non-2xx status:', error.response.data);
          } else if (error.request) {
            // La requête a été effectuée mais aucune réponse n'a été reçue
            console.error('No response received from server');
          } else {
            // Une erreur s'est produite lors de la configuration de la requête
            console.error('Error setting up the request:', error.message);
          }
          Alert.alert('Error fetching user artworks', 'An error occurred while fetching user artworks.');
        };
        get(url, token, callback, onErrorCallback);
      } else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des œuvres de l\'utilisateur :', error);
      Alert.alert('Erreur de récupération des œuvres', 'Une erreur s\'est produite.');
    }
  };

  const fetchUserData = async () => {
        try {
      if (token) {
        const url = `/api/user/profile/${userID}`;
        const callback = (response) => {
          setUserData(response.data);
          fetchUserArtworks();
        };
        const onErrorCallback = (error) => {
          console.error('Error fetching user data:', error);
          if (error.response) {
            // La requête a été effectuée et le serveur a répondu avec un statut de réponse qui n'est pas 2xx
            console.error('Server responded with non-2xx status:', error.response.data);
          } else if (error.request) {
            // La requête a été effectuée mais aucune réponse n'a été reçue
            console.error('No response received from server');
          } else {
            // Une erreur s'est produite lors de la configuration de la requête
            console.error('Error setting up the request:', error.message);
          }
          // Alert.alert('Error fetching user data', 'An error occurred while fetching user data.');
        };

        get(url, token, callback, onErrorCallback);
      } else {
        console.error('Token JWT not found. Make sure the user is logged in.');
        // Alert.alert('Token JWT not found. Make sure the user is logged in.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Alert.alert('Error fetching user data', 'An error occurred while fetching user data.');
    }
  }


  const updateCollections = async () => {
    try {
      const token = context?.token;
      if (token) {
        get(
          `/api/collection/my-collections`,
          token,
          (response: any) => {
            setUserCollections(response.data);
            setIsRefreshing(false);
          },
          (error: any) => console.error({ ...error })
        )
      } else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert("Erreur", "Veuillez vous reconnecter");
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des collections de l\'utilisateur :', error);
      Alert.alert('Erreur de récupération des collections', 'Une erreur s\'est produite.');
    }
  }


  const reloadProfile = () => {
    setIsRefreshing(true);
    fetchUserData();
    updateCollections();
  }


  useFocusEffect(
    React.useCallback(reloadProfile, [navigation])
  );


  useEffect(reloadProfile, []);


  return (
    <SafeAreaView>

      <StatusBar backgroundColor={colors.bg} barStyle="dark-content" />

      <View>
        {/* Buttons : Back, Edit profile and Settings */}
        <View style={{ flexDirection: 'row', marginRight: 20, zIndex: 10 }}>

          {/* Go back button */}
          <TouchableOpacity
            onPress={() => handleBackButtonClick()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back-outline" color={colors.black} size={32} />
          </TouchableOpacity>

          {/* Edit button */}
          <TouchableOpacity
            onPress={() => handleEditButtonClick()}
            style={styles.editButton}
          >
            <Feather name="edit-2" color={colors.black} size={24} />
          </TouchableOpacity>

          {/* Settings button */}
          <TouchableOpacity
            onPress={() => handleSettingsButtonClick()}
            style={styles.settingButton}
          >
            <MaterialIcons name="settings" color={colors.black} size={32} />
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
                <Text style={styles.title}>followers</Text>
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
            <Text style={styles.value}>{userData ? Math.max(userArtworksCount, 0) : 0}</Text>
            <Text style={styles.title}>posts</Text>
          </View>
        </View>

        {/* Decorative line */}
        <View style={styles.decorativeLine} />

        {/* Tab selections button : Artwork, Collections and About */}
        <View style={styles.tabsNavigation}>
          <Button
            value="Artwork"
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
            <FlatList
              data={userArtworks}
              numColumns={3}
              renderItem={(e) => (
                <TouchableOpacity
                  onPress={() => handleArtworkClick(e.item._id)}
                  key={e.item._id}
                  style={[ mh4, mv4 ]}
                >
                  <Image
                    source={{ uri: getImageUrl(e.item.image) }}
                    style={styles.artworkImage}
                  />
                </TouchableOpacity>
              )}
              refreshControl={(
                <RefreshControl
                  colors={[ colors.primary ]}
                  refreshing={isRefreshing}
                  onRefresh={reloadProfile}
                />
              )}
            />
          </View>
        ) }

        {/* Collections tab */}
        { activeTab === 'Collections' && userCollections.length !== 0 && (
          <FlatList
            data={userCollections}
            numColumns={2}
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
                colors={[ colors.primary ]}
                refreshing={isRefreshing}
                onRefresh={reloadProfile}
              />
            )}
          />
        ) }

        { activeTab === 'A propos' && (
          <Card style={styles.biographyContainer}>
            <Text style={[styles.biography, { paddingLeft: 15 }, cTextDark]}>
              { userData?.biography ?? "Cette personne utilise Leon'art pour redécouvrir l'art !"}
            </Text>
          </Card>
        ) }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredText: {
    justifyContent: 'center',
    alignItems: 'center', // Ajoutez cette ligne
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
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
    width: 105, height: 38, justifyContent: 'center',
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
    maxWidth: '33%',
    height: 115,
    backgroundColor: colors.platinium,
    borderRadius: 10,
    margin: 5,
    marginBottom: 10
  },
  squareContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 50
  },
  settingButton: {
    position: 'absolute',
    top: 16,
    right: 0
  },
  collectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.tertiary,
    // backgroundColor: colors.tertiary,
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
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5
  },
  biography: {
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
