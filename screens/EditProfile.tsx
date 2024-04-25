import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ToastAndroid
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, {useState, useContext, useEffect} from 'react';
import {ImageLibraryOptions, launchImageLibrary} from 'react-native-image-picker';

// Local imports
import { getImageUrl } from '../helpers/ImageHelper';
import Button from '../components/buttons/Button';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import { get, post } from '../constants/fetch';
import Title from '../components/text/Title';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Ionicons from "react-native-vector-icons/Ionicons";
import {bgRed, cPrimary} from "../constants/styles";
import ModifyTag from '../components/tags/ModifyTag';
import Subtitle from '../components/text/Subtitle';

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
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 1
      };

      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        return console.log('User cancelled image picker');
      }

      if (response.error) {
        return console.log('ImagePicker Error: ', response.error);
      }

      const source = { uri: response.assets[0]?.uri };

      if (source.uri) {
        return uploadProfilePicture(source.uri);
      }
    } catch (error) {
      console.error('An error occurred while picking the image:', error);
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    console.log("Selected: " + uri);
    const formData = new FormData();

    if (uri) {
      try {
        const fileData = await RNFS.readFile(uri, 'base64');
        formData.append('profilePicture', {
          name: 'image.jpg',
          type: 'image/jpeg',
          uri: Platform.OS === 'android' ? `file://${uri}` : uri,
          data: fileData
        });
      } catch (error) {
        console.error('Error preparing image:', error);
        return;
      }
    }

    post(
      '/api/user/profile/profile-pic',
      formData,
      context?.token,
      () => fetchData(),
      (error: any) => console.error('Error publishing new profile picture : ', { ...error })
    );
  };

  const selectBanner = async () => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 1
      };

      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        throw('User cancelled image picker');
      }

      if (response?.error) {
        throw('ImagePicker Error: ' + response?.error.toString());
      }

      if (!response.assets) {
        throw("Selected image was undefined");
      }

      if (response.assets[0].uri) {
        return uploadBanner(response.assets[0].uri);
      }
    } catch (error) {
      console.error('An error occurred while picking the image:', error);
    }
  };

  const uploadBanner = (uri: string) => {
    const formData = new FormData();

    if (!uri) {
      return console.error('Upload banner error: uri is not defined');
    }

    try {
      RNFS.readFile(uri, 'base64')
        .then((fileData: string) => {
          formData.append('bannerPicture', {
            name: 'image.jpg',
            type: 'image/jpeg',
            uri: Platform.OS === 'android' ? `file://${uri}` : uri,
            data: fileData
          });

          post(
            '/api/user/profile/banner-pic',
            formData,
            context?.token,
            () => fetchData(),
            (error: any) => console.error('Error publishing:', {...error})
          );
        });
    } catch (error: any) {
      console.error('Error preparing image:', {...error});
      return;
    }
  };

  const handleSaveModifications = () => {
    console.log("Modifications saved.");
    saveBiography();
    saveIsAvailable();
    navigation.goBack();
  };

  const saveBiography = () => {
    try {
      if (token) {
        const url = `/api/user/profile/bio`;
        const body = {
          biography: biography
        };
        const callback = (response) => {
          setUserData(response.data);
          if (userData?.biography !== undefined) setBiography(userData.biography);
        };
        const onErrorCallback = (error) => {
          console.error('Error saving modifications:', error);
          if (error.response) {
            console.error('Server responded with non-2xx status:', error.response.data);
          } else if (error.request) {
            console.error('No response received from server');
          } else {
            console.error('Error setting up the request:', error.message);
          }
        };

        post(url, body, token, callback, onErrorCallback);
      } else {
        console.error('Token JWT not found. Make sure the user is logged in.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const saveIsAvailable = () => {
    try {
      if (token) {
        const url = `/api/user/profile/availability`;
        const body = {
          availability: isAvailable
        };
        const callback = (response) => {
          setUserData(response.data);
          if (userData?.availability !== undefined) setIsAvailable(userData.availability);
        };
        const onErrorCallback = (error) => {
          console.error('Error saving modifications:', error);
          if (error.response) {
            console.error('Server responded with non-2xx status:', error.response.data);
          } else if (error.request) {
            console.error('No response received from server');
          } else {
            console.error('Error setting up the request:', error.message);
          }
        };

        post(url, body, token, callback, onErrorCallback);
      } else {
        console.error('Token JWT not found. Make sure the user is logged in.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserData = () => {
    if (!token) {
      console.error('Token JWT not found. Make sure the user is logged in.');
      ToastAndroid.show("Error getting your user information. Please log in", ToastAndroid.SHORT);
      return navigation.navigate('login');
    }

    const url = `/api/user/profile/${userID}`;

    const callback = (response: any) => {
      setUserData(response.data);
    };

    const onErrorCallback = (error: any) => {
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
    };

    get(url, token, callback, onErrorCallback);
  };


  const fetchData = () => {
    try {
      fetchUserData();

      if (userData?.biography) {
        setBiography(userData.biography);
      }

      if (userData?.availability) {
        setIsAvailable(userData.availability);
      }

      if (userData?.profilePicture) {
        setProfilePicture(userData.profilePicture);
      }

      if (userData?.bannerPicture) {
        console.log(userData.bannerPicture);
        setBanner(userData.bannerPicture);
      }
    } catch (error) {
      ToastAndroid.show('Error getting data. Please try again', ToastAndroid.SHORT);
      return console.error('Error fetching user data:', error);
    }
  };


  useFocusEffect(
    React.useCallback(fetchData, [navigation])
  );


  useEffect(fetchData, []);


  return (
    <ScrollView nestedScrollEnabled>
      <View>
        <View style={{ flexDirection: 'row', marginRight: 20 }}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => handleBackButtonClick()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back-outline" color={colors.black} size={32} />
          </TouchableOpacity>
        </View>

        {/* Banner */}

        <ImageBackground
          source={{ uri: getImageUrl(banner) }}
          style={styles.banner}
          resizeMode="cover"
        >
      <ModifyTag
        onPress={selectBanner}
        title="Modifier la bannière"
        style={[ bgRed, styles.bannerTouchable]}
        textStyle={{ cPrimary }}
      />
      </ImageBackground>

        {/* Profile picture */}
        <View style={styles.overlayImage}>
          <TouchableOpacity
            style={styles.circleImageContainer}
            onPress={selectImage}
          >
            <Image
            source={{ uri: getImageUrl(profilePicture) }}
            style={styles.profilePicture}
            onError={(error) => console.error("Error loading profile picture:", error)}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.decorativeLine} />

        <View>
          {/* Name */}
          <View style={styles.infoBlock}>
            <Subtitle>Nom</Subtitle>
            <Text style={styles.infoValue}>{userData?.username}</Text>
          </View>
          {/* Biography */}
          <View style={styles.infoBlock}>
            <Subtitle>Description</Subtitle>
            <TextInput
                placeholder="Parlez nous de vous..."
                onChangeText={handleBiographyChange}
                style={[styles.biographyInput, { backgroundColor: '#F0F0F0' }]}
                value={biography}
              />
          </View>

          {/* Availability */}
          <View style={styles.infoBlock}>
            <Subtitle>Ouvert au commandes</Subtitle>
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
                style={styles.notAvailableButton}
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
};

const styles = StyleSheet.create({
  centeredText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    backgroundColor: colors.offerBg,
    height: 180,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTouchable: {
    backgroundColor: colors.bg,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  overlayImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 110,
    height: 110,
    backgroundColor: colors.white
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
    top: 60,
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.white
  },
  settingsButton: {
    width: '95%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: '10%',
  },
  disconnectButton: {
    width: '80%',
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: '10%',
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
    marginTop: 0,
  },
  availableButton: {
    width: '25%',
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
  },
  notAvailableButton: {
    width: '25%',
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    color: colors.darkGreyFg,
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