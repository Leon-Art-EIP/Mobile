import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ToastAndroid,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, {useState, useContext, useEffect } from 'react';
import {ImageLibraryOptions, launchImageLibrary} from 'react-native-image-picker';

// Local imports
import { Text } from 'react-native-svg';
import { getImageUrl } from '../helpers/ImageHelper';
import Button from '../components/buttons/Button';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import { get, post } from '../constants/fetch';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Ionicons from "react-native-vector-icons/Ionicons";
import { bgColor, bgDisabled, bgPlatinium, br12, br20, br5, br7, cBlack, cTextDark, flex1, flexRow, mbAuto, mh0, ml0, ml4, ml8, mlAuto, mr0, mr20, mr4, mr8, mrAuto, mt8, mtAuto, mv8, ph24, ph8 } from "../constants/styles";
import ModifyTag from '../components/tags/ModifyTag';
import Subtitle from '../components/text/Subtitle';
import Input from '../components/textInput/Input';
import CheckBox from '@react-native-community/checkbox';


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


const EditProfile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const context = useContext(MainContext);
  const [isAvailable, setIsAvailable] = useState<boolean | undefined>(false);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [bannerPicture, setBannerPicture] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = context?.token;
  const [instagramUrl, setInstagramUrl] = useState<string>('');
  const [twitterUrl, setTwitterUrl] = useState<string>('');
  const [tiktokUrl, setTiktokUrl] = useState<string>('');
  const [facebookUrl, setFacebookUrl] = useState<string>('');


  const setNewBio = (new_bio: string) => {
    let new_userData: UserData | undefined = { ...userData };

    if (!new_userData) {
      return;
    }

    new_userData.biography = new_bio;
    return setUserData({ ...new_userData });
  }


  const selectImage = async (type: 'profile' | 'banner') => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1
    };

    const response = await launchImageLibrary(options);

    if (response.error) {
      return console.log('ImagePicker Error: ', response.error);
    }

    if (response.assets[0]?.uri) {
      if (type === 'profile') {
        setProfilePicture(response?.assets[0]?.uri);
      } else {
        setBannerPicture(response?.assets[0]?.uri);
      }
    }
  };


  const uploadPicture = async (type: 'banner' | 'profile') => {
    const formData = new FormData();
    console.log(type === 'banner' ? bannerPicture : profilePicture);
    const uri: string | undefined = type === 'profile' ? profilePicture : bannerPicture;

    const fileData = await RNFS.readFile(uri, 'base64');
    formData.append(
      type === 'profile' ? 'profilePicture' : 'bannerPicture',
      {
        name: 'image.jpg',
        type: 'image/jpeg',
        uri: Platform.OS === 'android' ? `file://${uri}` : uri,
        data: fileData
      }
    );

    post(
      '/api/user/profile/' + (type === 'banner' ? 'banner' : 'profile') + '-pic',
      formData,
      context?.token,
      fetchUserData,
      (error: any) => {
        if (error.response.status === 413) {
          ToastAndroid.show("Image trop grande (> 5 MB)", ToastAndroid.LONG);
        }
        console.error('Error publishing new profile picture : ', { ...error });
      }
    );
  }

  const handleSaveModifications = () => {
    console.log("Modifications saved.");
    saveBiography();
    saveIsAvailable();
    saveSocialMediaLinks();

    if (bannerPicture) {
      uploadPicture('banner');
    }
    if (profilePicture) {
      uploadPicture('profile');
    }
  }

  const saveBiography = () => {
    post(
      "/api/user/profile/bio",
      { biography: userData?.biography },
      context?.token,
      () => {},
      (err: any) => console.error({ ...err })
    );
  }


  const saveIsAvailable = () => {
    post(
      "/api/user/profile/availability",
      { availability: isAvailable },
      context?.token,
      () => {},
      (err: any) => console.error({ ...err })
    );
  }


  const fetchUserData = () => {
    setIsLoading(true);

    get(
      `/api/user/profile/${context?.userId}`,
      context?.token,
      (res: any) => {
        setUserData({ ...res?.data });
        setInstagramUrl(res.data.socialMediaLinks?.instagram || '');
        setTwitterUrl(res.data.socialMediaLinks?.twitter || '');
        setTiktokUrl(res.data.socialMediaLinks?.tiktok || '');
        setFacebookUrl(res.data.socialMediaLinks?.facebook || '');
        console.log("new user data: ", res?.data);
        setIsLoading(false);
      },
      (err: any) => {
        console.error('Error fetching user data:', err);
        if (err.response) {
          console.error('Server responded with non-2xx status:', err.response.data);
        } else if (err.request) {
          console.error('No response received from server');
        } else {
          console.error('Error setting up the request:', err.message);
        }
      }
    );
  };


  const saveSocialMediaLinks = () => {
    if (!token) {
      console.error('Token JWT not found. Make sure the user is logged in.');
      return;
    }

    const url = '/api/user/profile/social-links';
    const body = {
      instagram: instagramUrl,
      twitter: twitterUrl,
      facebook: facebookUrl,
      tiktok: tiktokUrl
    };

    const callback = (response: any) => {
      console.log('Social media links updated:', response.data);
      ToastAndroid.show('Lien vers vos réseaux sociaux ajouté avec succès !', ToastAndroid.SHORT);
    };

    const onErrorCallback = (error: any) => {
      console.error('Error updating social media links:', error);
      if (error.response) {
        console.error('Server responded with non-2xx status:', error.response.data);
      } else if (error.request) {
        console.error('No response received from server');
      } else {
        console.error('Error setting up the request:', error.message);
      }
    };

    post(url, body, token, callback, onErrorCallback);
  }


  const setupScreen = () => {
    fetchUserData();

    Keyboard.addListener('keyboardDidShow', () => setIsKeyboardFocused(true));
    Keyboard.addListener('keyboardDidHide', () => setIsKeyboardFocused(false));
  }


  useFocusEffect(
    React.useCallback(setupScreen, [navigation])
  );

  useEffect(() => {
    if (!!userData?.availability !== isAvailable) {
      let new_user: UserData | undefined = { ...userData };
      new_user.availability = !new_user?.availability;
      setUserData({ ...new_user });
    }
  }, [userData])


  useEffect(setupScreen, []);


  return (
    <SafeAreaView style={[bgColor, flex1]}>

      { isLoading && (
        <ActivityIndicator
          color={colors.primary}
          size={32}
        />
      ) }

      <View style={[flexRow, mr20]}>
        {/* Back button */}
        <TouchableOpacity
          onPress={navigation.goBack}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back-outline"
            color={colors.black}
            style={[mtAuto, mbAuto, mlAuto, mrAuto]}
            size={32}
          />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <ImageBackground
        source={{ uri: bannerPicture ?? getImageUrl(userData?.bannerPicture) }}
        style={styles.banner}
        resizeMode="cover"
      >
        <ModifyTag
          onPress={() => selectImage('banner')}
          title="Modifier la bannière"
          style={[ cBlack, styles.bannerTouchable]}
          textStyle={{ cBlack }}
        />
      </ImageBackground>

      {/* Profile picture */}
      <View style={styles.overlayImage}>
        <TouchableOpacity
          style={styles.circleImageContainer}
          onPress={() => selectImage('profile')}
        >
          <Image
            source={{ uri: profilePicture ?? getImageUrl(userData?.profilePicture) }}
            style={styles.profilePicture}
            onError={(error) => console.error({ ...error })}
          />
        </TouchableOpacity>
      </View>

      <View style={[flex1, ph24, { marginTop: '20%' }]}>
      <ScrollView>
        {/* Name */}
        <View>
          <Subtitle>Nom</Subtitle>
          <Input
            placeholder={userData?.username}
            style={[bgDisabled, mh0, cTextDark, mt8, { height: 40 }]}
            value={userData?.username}
            disabled
          />
        </View>

        {/* Biography */}
        <View style={[mt8]}>
          <Subtitle>Biographie</Subtitle>
          <Input
            placeholder={userData?.biography}
            placeholderTextColor={colors.text}
            onTextChanged={setNewBio}
            multilines={5}
            style={[bgDisabled, mh0, br20, mt8, cTextDark]}
          />
        </View>
        {/* Availability */}
        <View style={[mt8, flexRow]}>
          <Subtitle>Ouvert aux commandes</Subtitle>
          <CheckBox
            value={isAvailable ?? !!userData?.availability}
            onValueChange={setIsAvailable}
            tintColors={{ true: colors.primary, false: colors.textDark }}
            tintColor={colors.textDark}
            style={[mtAuto, mbAuto, mlAuto]}
          />
        </View>
        <View style={styles.infoBlock}>
            <Subtitle>Liens réseaux sociaux</Subtitle>
            <Text>Renseigner les liens vers vos réseaux</Text>
            <View style={styles.socialMedia}>
              <Ionicons
                name="logo-instagram"
                color={colors.darkGreyBg}
                size={24}
              />
              <Input
                placeholder="Instagram"
                placeholderTextColor={colors.darkGreyBg}
                onTextChanged={setInstagramUrl}
                style={[styles.biographyInput, { backgroundColor: '#F0F0F0' }]}
                value={instagramUrl || 'Non renseigné'}
              />
            </View>
            <View style={styles.socialMedia}>
              <Ionicons
                name="logo-twitter"
                color={colors.darkGreyBg}
                size={24}
              />
              <Input
                placeholder="Twitter"
                placeholderTextColor={colors.darkGreyBg}
                onTextChanged={setTwitterUrl}
                style={[styles.biographyInput, { backgroundColor: '#F0F0F0' }]}
                value={twitterUrl || 'Non renseigné'}
              />
            </View>
            <View style={styles.socialMedia}>
              <Ionicons
                name="logo-facebook"
                color={colors.darkGreyBg}
                size={24}
              />
              <Input
                placeholder="Facebook"
                placeholderTextColor={colors.darkGreyBg}
                onTextChanged={setFacebookUrl}
                style={[styles.biographyInput, { backgroundColor: '#F0F0F0' }]}
                value={facebookUrl || 'Non renseigné'}
              />
            </View>
            <View style={styles.socialMedia}>
              <Ionicons
                name="logo-pinterest"
                color={colors.darkGreyBg}
                size={24}
              />
              <Input
                placeholder="TikTok"
                placeholderTextColor={colors.darkGreyBg}
                onTextChanged={setTiktokUrl}
                style={[styles.biographyInput, { backgroundColor: '#F0F0F0' }]}
                value={tiktokUrl || 'Non renseigné'}
              />
            </View>

            </View>
        </ScrollView>

        { !isKeyboardFocused && (
          <View style={[flexRow, mtAuto]}>
            <Button
              value='Annuler'
              onPress={navigation.goBack}
              secondary
              style={[flex1, ml0, mr8]}
            />
            <Button
              value="Enregistrer"
              style={[flex1, mr0, ml8]}
              textStyle={{ fontSize: 17 }}
              onPress={handleSaveModifications}
            />
          </View>
        ) }
      </View>
    </SafeAreaView>
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
    borderColor: colors.darkGreyFg,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  overlayImage: {
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
  infoBlock: {
    marginTop: 20,
  },
  socialMedia: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  biographyInput: {
    flex: 1,
    marginLeft: 8,
    height: 40,
  },
  contactAndFollow: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 37,
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 17,
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
    borderWidth: 1,
    borderColor: colors.darkGreyFg,
    backgroundColor: colors.bg,
    borderRadius: 50,
    height: 40,
    width: 40,
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
  infoTitle: {
    fontSize: 16,
    color: 'grey',
  },
  infoValue: {
    fontSize: 18,
    color: colors.black,
  },
  buttonContainer: {
    flex: 1,
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
  }
});

export default EditProfile;
