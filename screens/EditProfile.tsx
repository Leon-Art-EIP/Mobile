import { Alert, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useContext } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
// Local imports

import SettingsButtonImage from '../assets/images/settings_logo.png'
import EditButtonImage from '../assets/images/edit_logo.png'
import BackArrow from '../assets/images/back_arrow.png'
import { getImageUrl } from '../helpers/ImageHelper';
import Button from '../components/Button';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import { get, post } from '../constants/fetch';
import Title from '../components/Title';
import ImagePicker from 'react-native-image-picker';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
// import bannerImage from '../assets/images/banner.jpg'
// import profilePicture from '../assets/images/user.png'

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

const EditProfile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [biography, setBiography] = useState<string>('');
  const context = useContext(MainContext);
  const token = context?.token;
  const userID = context?.userId;
  const [isAvailable, setIsAvailable] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [banner, setBanner] = useState<string>('');
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>('');
  const [selectedBanner, setSelectedBanner] = useState<string>('');

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

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handleBiographyChange = (value: string) => {
    setBiography(value);
  };

  const selectImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 1,
      };
  
      const response = await launchImageLibrary(options);
  
      if (response.didCancel) {
        console.log('🟢 User cancelled image picker');
      } else if (response.error) {
        console.log('🔴 ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        if (source.uri !== undefined) {
          setSelectedProfilePicture(source.uri);
          uploadProfilePicture();
        }
      }
    } catch (error) {
      console.log('🔴 An error occurred while picking the image:', error);
    }
  };
  
  const uploadProfilePicture = async () => {
    console.log("🟢 Image selected as profile picture: " + selectedProfilePicture);
  
    const formData = new FormData();
    if (selectedProfilePicture) {
      try {
        const fileData = await RNFS.readFile(selectedProfilePicture, 'base64');
        formData.append('profilePicture', {
          name: 'image.jpg',
          type: 'image/jpeg',
          uri: Platform.OS === 'android' ? `file://${selectedProfilePicture}` : selectedProfilePicture,
          data: fileData
        });
      } catch (error) {
        console.log('🔴 Error preparing image:', error);
        return;
      }
    }

    post(
      '/api/user/profile/profile-pic',
      formData,
      context?.token,
      (response) => {
        setProfilePicture(response.data.profilePicture);
      },
      (error) => {
        console.log('🔴 Error publishing:', error);
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach(err => {
            console.log(`🔴 Validation error - ${err.param}: ${err.msg}`);
          });
        }
      }
    );
  };

  const selectBanner = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 1,
      };
  
      const response = await launchImageLibrary(options);
  
      if (response.didCancel) {
        console.log('🟢 User cancelled image picker');
      } else if (response.error) {
        console.log('🔴 ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        if (source.uri !== undefined) {
          setSelectedBanner(source.uri);
          uploadBanner();
        }
      }
    } catch (error) {
      console.log('🔴 An error occurred while picking the image:', error);
    }
  };
  
  const uploadBanner = async () => {
    console.log("🟢 Image selected as banner: " + selectedBanner);

  
    const formData = new FormData();
    if (selectedBanner) {
      try {
        const fileData = await RNFS.readFile(selectedBanner, 'base64');
        formData.append('bannerPicture', {
          name: 'image.jpg',
          type: 'image/jpeg',
          uri: Platform.OS === 'android' ? `file://${selectedBanner}` : selectedBanner,
          data: fileData
        });
      } catch (error) {
        console.log('🔴 Error preparing image:', error);
        return;
      }
    }

    post(
      '/api/user/profile/banner-pic',
      formData,
      context?.token,
      (response) => {
        // setUserData(response.data);
        setBanner(response.data.bannerPicture);
      },
      (error) => {
        console.log('🔴 Error publishing:', error);
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach(err => {
            console.log(`🔴 Validation error - ${err.param}: ${err.msg}`);
          });
        }
      }
    );
  };

  const handleSaveModifications = () => {
    console.log("🟢 Profile modifications saved.");
    // Save new biography
    saveBiography();
    // Save availability
    saveIsAvailable();
    // Save new banner
    // Save new Profile picture
    navigation.goBack();
  }

  const saveBiography = () => {
    const url = `/api/user/profile/bio`;
    const body = {
      biography: biography
    };
    const callback = (response) => {
      setUserData(response.data);
      if (userData?.biography !== undefined) setBiography(userData.biography);
    };
    const onErrorCallback = (error) => {
      console.log('🔴 Error saving modifications:', error);
      if (error.response) {
        // La requête a été effectuée et le serveur a répondu avec un statut de réponse qui n'est pas 2xx
        console.log('🔴 Server responded with non-2xx status:', error.response.data);
      } else if (error.request) {
        // La requête a été effectuée mais aucune réponse n'a été reçue
        console.log('🔴 No response received from server');
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.log('🔴 Error setting up the request:', error.message);
      }
      Alert.alert('Une erreur est survenue.', 'Les modifications n\'ont pas pu être sauvegardées.');
    };

    post(url, body, token, callback, onErrorCallback);
  };

  const saveIsAvailable = () => {
    const url = `/api/user/profile/availability`;
    const body = {
      availability: isAvailable
    };
    const callback = (response) => {
      setUserData(response.data);
      if (userData?.availability !== undefined) setIsAvailable(userData.availability);
    };
    const onErrorCallback = (error) => {
      console.log('🔴 Error saving modifications:', error);
      if (error.response) {
        // La requête a été effectuée et le serveur a répondu avec un statut de réponse qui n'est pas 2xx
        console.log('🔴 Server responded with non-2xx status:', error.response.data);
      } else if (error.request) {
        // La requête a été effectuée mais aucune réponse n'a été reçue
        console.log('🔴 No response received from server');
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.log('🔴 Error setting up the request:', error.message);
      }
      Alert.alert('Une erreur est survenue.', 'Les modifications n\'ont pas pu être sauvegardées.');
    };
      
    post(url, body, token, callback, onErrorCallback);
  };

  const fetchUserData = async () => {
    const url = `/api/user/profile/${userID}`;
    const callback = (response) => {
      setUserData(response.data);
      console.log("🟢 User data fetched");
    };
    const onErrorCallback = (error) => {
      Alert.alert('Une erreur est survenue.', 'Vos informations n\'ont pas pu être récupérées.');
      console.log('🔴 Error fetching user data:', error);
      if (error.response) {
        console.log('🔴 Server responded with non-2xx status:', error.response.data);
      } else if (error.request) {
        console.log('🔴 No response received from server');
      } else {
        console.log('🔴 Error setting up the request:', error.message);
      }
    };

    get(url, token, callback, onErrorCallback);
  };

  useFocusEffect(
    React.useCallback(() => {}, [navigation])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserData();
        if (userData?.biography !== undefined) setBiography(userData.biography);
        if (userData?.availability !== undefined) setIsAvailable(userData.availability);
        if (userData?.profilePicture !== undefined) setProfilePicture(userData.profilePicture);
        if (userData?.bannerPicture !== undefined) setBanner(userData.bannerPicture);
      } catch (error) {
        console.log('🔴 Error updating screen:', error);
      }
    };

    fetchData();
  }, [profilePicture, banner]);

  return (
    <ScrollView nestedScrollEnabled>
    <View>
      <View style={{ flexDirection: 'row', marginRight: 20 }}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => handleBackButtonClick()}
          style={styles.backButton}
          >
          <Image source={BackArrow} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>
      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={{ uri: getImageUrl(banner) }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <Title style={styles.mainTitle}>Modifier la bannière</Title>
      </View>
      <TouchableOpacity
          onPress={selectBanner}
          style={styles.editBannerButton}
        >
          <Image source={EditButtonImage} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
      {/* Profile picture */}
      <View style={styles.overlayImage}>
        <View style={styles.circleImageContainer}>
          <Image
          source={{ uri: getImageUrl(profilePicture) }}
          style={styles.profilePicture}
          onError={(error) => console.log("🔴 Error loading profile picture:", error)}
          />
        </View>
        <TouchableOpacity
          onPress={selectImage}
          style={styles.editProfilePictureButton}
        >
          <Image source={EditButtonImage} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.decorativeLine} />
      <View>
        {/* Name */}
        <View style={styles.infoBlock}>
          <Title style={styles.infoTitle}>Nom</Title>
          <Text style={styles.infoValue}>{userData?.username}</Text>
        </View>
        {/* Biography */}
        <View style={styles.infoBlock}>
          <Title style={styles.infoTitle}>Description</Title>
          <TextInput
              placeholder="Parlez nous de vous..."
              onChangeText={handleBiographyChange}
              style={[styles.biographyInput, { backgroundColor: '#F0F0F0', paddingLeft: 15 }]}
              value={biography}
            />
        </View>
        {/* Availability */}
        <View style={styles.infoBlock}>
          <Title style={styles.infoTitle}>Ouvert au commandes</Title>
          <View style={styles.buttonContainer}>
            <Button
              value="Oui"
              style={styles.availableButton}
              textStyle={{ fontSize: 18, fontWeight: 'bold' }}
              onPress={() => setIsAvailable("available")}
              secondary={isAvailable === "unavailable"}
            />
            <Button
              value="Non"
              style={styles.availableButton}
              textStyle={{ fontSize: 18, fontWeight: 'bold' }}
              onPress={() => setIsAvailable("unavailable")}
              secondary={isAvailable === "available"}
            />
          </View>
        </View>
        <Button
          value="Enregistrer les modifications"
          style={styles.disconnectButton}
          textStyle={{ fontSize: 18, fontWeight: 'bold' }}
          onPress={() => handleSaveModifications()}
          />
      </View>
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
    marginTop: 70,
    marginBottom: 20,
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
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  editProfilePictureButton: {
    top: 16,
    left: 40,
    zIndex: 1,
  },
  editBannerButton: {
    bottom: 50,
    left: 340,
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
    // backgroundColor: colors.tertiary,
    padding: 8,
    marginBottom: 10,
    borderRadius: 40,
    marginLeft: 10,
    marginRight: 30,
  },
  artworkName: {
    fontSize: 16,
    color: 'black',
    marginLeft: 20,
  },
  mainTitle: {
    position: 'absolute',
    top: 60, // Ajustez la valeur en fonction de votre design
    width: '100%', // Centrer horizontalement
    textAlign: 'center', // Centrer horizontalement
    fontSize:30, // Ajustez la taille de la police en fonction de votre design
    fontWeight: 'bold',
    color: 'white', // Ajustez la couleur en fonction de votre design
  },
  settingsButton: {
    width: '95%', // Utilise '80%' pour que le bouton occupe 80% de la largeur de l'écran
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center', // Centre le bouton horizontalement
    marginHorizontal: '10%', // Ajoute des marges de 10% de chaque côté
  },
  disconnectButton: {
    width: '80%', // Utilise '80%' pour que le bouton occupe 80% de la largeur de l'écran
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignSelf: 'center', // Centre le bouton horizontalement
    marginHorizontal: '10%', // Ajoute des marges de 10% de chaque côté
  },
  infoBlock: {
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    color: 'grey',
  },
  infoValue: {
    fontSize: 18,
    color: colors.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 0, // Ajustez la marge en fonction de vos besoins
  },
  availableButton: {
    width: '25%', // Utilise '80%' pour que le bouton occupe 80% de la largeur de l'écran
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 100,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  biographyInput: {
    marginLeft: 0,
    marginRight: 0,
    flex: 1,
    borderRadius: 50
  },
});

export default EditProfile;