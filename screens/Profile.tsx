import { Alert, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
// Local imports
import SettingsButtonImage from '../assets/images/settings_logo.png'
import emptyCollectionImage from '../assets/icons/hamburger.png'
import EditButtonImage from '../assets/images/edit_logo.png'
import BackArrow from '../assets/images/back_arrow.png'
import Button from '../components/Button';
import colors from '../constants/colors';
import { get } from '../constants/fetch';
import { MainContext } from '../context/MainContext';
import { getImageUrl } from '../helpers/ImageHelper';
import { Artwork, UserData } from '../utils/data';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

const Profile = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const token = context?.token;
  const userID = context?.userId;
  const [activeTab, setActiveTab] = useState('Artwork'); 
  const [userCollections, setUserCollections] = useState([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [userArtworksCount, setUserArtworksCount] = useState<number>(0);

  const handleToFollowerList = () => {
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

  const handleArtworkClick = (pageName) => {
    navigation.navigate(pageName);
  };

  const handleCollectionClick = (collection) => {
    navigation.navigate('collection', { collection: collection});
  };

  const fetchUserArtworks = async () => {
    const success = (response) => {
      setUserArtworks(response.data);
      setUserArtworksCount(response.data.length);
    };
    get(
      `/api/art-publication/user/${userID}`,
      token,
      success,
      (err: any) => console.warn('Error fetching user artworks: ', {...err}),
    );
  };

  const fetchUserData = async () => {
    const success = (response) => {
      setUserData(response.data);
      fetchUserArtworks();
    };
    get(
      `/api/user/profile/${userID}`,
      token,
      success,
      (err: any) => console.warn('Error fetching user data: ', {...err}),
    );
  };

  const updateCollections = async () => {
      get(
        `/api/collection/my-collections`,
        token,
        (response: any) => setUserCollections(response.data),
        (err: any) => console.warn('Error updating user\'s collections: ', {...err}),
      );
  };

  useFocusEffect(
    React.useCallback(() => {}, [navigation])
  );

  useEffect(() => {
    fetchUserData();
    updateCollections();
  }, []);


  return (
    <ScrollView nestedScrollEnabled>
      <View>
        {/* Buttons : Back, Edit profile and Settings */}
        <View style={{ flexDirection: 'row', marginRight: 20 }}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => handleBackButtonClick()}
            style={styles.backButton}
          >
            <Image source={BackArrow} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
          {/* Edit button */}
          <TouchableOpacity
            onPress={() => handleEditButtonClick()}
            style={styles.editButton}
          >
            <Image source={EditButtonImage} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
          {/* Settings button */}
          <TouchableOpacity
            onPress={() => handleSettingsButtonClick()}
            style={styles.settingButton}
          >
            <Image source={SettingsButtonImage} style={{ width: 40, height: 40 }} />
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
          {/* Followers block text */}
          <View style={styles.textBlock}>
            <TouchableOpacity onPress={handleToFollowerList}>
              <View style={styles.centeredText}>
                <Text style={styles.value}>{userData ? Math.max(userData.subscribersCount, 0) : 0}</Text>
                <Text style={styles.title}>followers</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* Name and availability block text */}
          <View style={styles.centerTextBlock}>
            <Text style={styles.centerTitle}>{userData ? userData.username : ""}</Text>
            {userData && userData.availability !== "unavailable" && (
              <Text style={styles.centerSubtitle}>Ouvert aux commandes</Text>
            )}
          </View>
          {/* Posts text block */}
          <View style={styles.textBlock}>
            <Text style={styles.value}>{userData ? Math.max(userArtworksCount, 0) : 0}</Text>
            <Text style={styles.title}>posts</Text>
          </View>
        </View>
        {/* Decorative line */}
        <View style={styles.decorativeLine} />
        {/* Tab selections buttons : Artwork, Collections and About */}
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
        {/* Artwork tab */}
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
                  onError={() => console.log("Image loading error")}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {/* Collections tab */}
        {activeTab === 'Collections' && userCollections.length > 0 && (
          <View style={styles.squareContainer}>
            {userCollections.map((collection, index) => (
              <TouchableOpacity
                key={collection._id}
                style={[
                  styles.squareFrame,
                  {
                    width: '48%',
                    marginLeft: index % 2 === 0 ? 0 : '2%',
                    marginRight: index % 2 === 0 ? '2%' : 0,
                    marginBottom: 10,
                  },
                ]}
                onPress={() => handleCollectionClick(collection)}
              >
                <Image
                  source={
                    collection.artPublications.length > 0
                      ? { uri: `${API_URL}api/${collection.artPublications[0].image}` }
                      : emptyCollectionImage // Remplace avec le chemin réel de ton image vide
                  }
                  style={{ flex: 1, borderRadius: 10 }}
                  resizeMode="cover"
                  onError={(error) => console.log(`Error loading image for collection ${collection._id}:`, error.nativeEvent)}
                />
                <Text style={styles.collectionName}>{collection.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {/* About tab */}
        {activeTab === 'A propos' && (
          <View style={styles.biographyContainer}>
            <Text style={[styles.biography, { backgroundColor: '#F0F0F0', paddingLeft: 15 }]}>
              {userData?.biography}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
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
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 50,
    zIndex: 1,
  },
  settingButton: {
    position: 'absolute',
    top: 16,
    right: 0,
    zIndex: 1,
  },
  collectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.tertiary,
    padding: 8,
    marginBottom: 5,
    borderRadius: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  biographyContainer: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
  },
  biography: {
    fontSize: 18,
    color: colors.black,
  },
  artworkImage: {
    height: 120,
    width: 120,
    borderRadius: 7,
  },
});

export default Profile;