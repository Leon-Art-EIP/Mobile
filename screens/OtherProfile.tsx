import React, { useState, useEffect, useContext } from 'react';
import { Alert, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native'
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import profilePicture from '../assets/images/user.png'
import bannerImage from '../assets/images/banner.jpg'
import Button from '../components/buttons/Button';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import { get, post } from '../constants/fetch';
import { getImageUrl } from '../helpers/ImageHelper';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

const OtherProfile = ({ route }: any) => {
  const navigation = useNavigation();
  const id = route?.params?.id;
  const context = useContext(MainContext);
  const token = context?.token;

  const [isFollowing, setIsFollowing] = useState(false);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [userArtworksCount, setUserArtworksCount] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('Artwork');

  const handleArtworkClick = (publicationId: string) => {
    navigation.navigate('singleart', { id: publicationId });
    
  };

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handleContactButtonClick = () => {
    // navigation.navigate('single_conversation', { id: id, name: userData?.username });
    // navigation?.navigate(
    //   'single_conversation',
    //   {
    //     name: conversation?.UserOneId === context?.userId ? conversation['UserTwoName'] : conversation['UserOneName'],
    //     // ids: conversation ID, your ID, the correspondant ID
    //     ids: [
    //       conversation['_id'],
    //       conversation['UserOneId'],
    //       conversation['UserTwoId']
    //     ]
    //   }
    // )
  };

  const handleFollowButtonClick = async () => {
    try {
      if (token) {
        const url = `/api/follow/${id}`;
        const body = undefined;
        const callback = () => {
          setIsFollowing(!isFollowing);
        };
        const onErrorCallback = (error) => {
          console.error('Erreur de follow :', error);
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
    fetchUserData();
  };


  const checkIsFollowing = async () => {
    try {
      if (token) {
        get(
          "/api/follow/following",
          token,
          (response: any) => setIsFollowing(
            response.data?.subscriptions.some(
              (subscription: { _id: string }) => subscription._id === id
            )
          ),
          (error: any) => console.error({ ...error })
        );
      } else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Erreur', 'Veuillez vous reconnecter');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du suivi :', error);
    }
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

  const fetchUserArtworks = async () => {
    try {
      const token = context?.token;
      if (token) {
        get(
          `/api/art-publication/user/${id}`,
          token,
          (response: any) => setUserArtworks(response.data),
          (error: any) => console.error({ ...error })
        )
      } else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert("Erreur", "Veuillez vous reconnecter");
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des œuvres de l\'utilisateur :', error);
      Alert.alert('Erreur de récupération des œuvres', 'Une erreur s\'est produite.');
    }
  };

  const fetchUserData = async () => {
    try {
      if (token) {
        const url = `/api/user/profile/${id}`;
        const callback = (response) => {
          setUserData(response.data);
        };
        const onErrorCallback = (error) => {
          console.error('Error fetching user data:', error);
          if (error.response) {
            console.error('Server responded with non-2xx status:', error.response.data);
          } else if (error.request) {
            console.error('No response received from server');
          } else {
            console.error('Error setting up the request:', error.message);
          }
        };

        get(url, token, callback, onErrorCallback);
      } else {
        console.error('Token JWT not found. Make sure the user is logged in.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  useEffect(() => {
    fetchUserData();
    fetchUserArtworks();
    checkIsFollowing();
  }, []);

  useFocusEffect(
    React.useCallback(() => {}, [navigation])
  );


  return (
    <SafeAreaView style={styles.container}>
    <ScrollView nestedScrollEnabled>
      <StatusBar backgroundColor={colors.white} barStyle='dark-content' />
      <TouchableOpacity
        onPress={() => handleBackButtonClick()}
        style={styles.backButton}
      >
        <AntDesign
          name="left"
          color={colors.white}
          onPress={() => navigation.goBack()}
          size={24}
        />
      </TouchableOpacity>
      <View style={styles.banner}>
        <Image
          source={{ uri: getImageUrl(userData?.bannerImage) }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.overlayImage}>
        <View style={styles.circleImageContainer}>
          <Image
            source={{ uri: getImageUrl(userData?.profilePicture) }}
            style={styles.profilePicture}
            defaultSource={require('../assets/icons/account.svg')}
          />
        </View>
      </View>
      <View style={styles.textBlocks}>
        <View style={styles.textBlock}>
          <Text style={styles.value}>{userData ? Math.max(userData.subscribersCount, 0) : 0}</Text>
          <Text style={styles.title}>followers</Text>
        </View>
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
      <View style={styles.contactAndFollow}>
        <Button
          value={isFollowing ? "Suivi" : "Suivre"}
          secondary= {isFollowing ? true : false}
          style={{
            width: 150,
            height: 38,
            borderRadius: 10,
            justifyContent: 'center',
          }}
          textStyle={{fontSize: 14, textAlign: 'center', paddingTop: -100}}
          onPress={() => handleFollowButtonClick()}
          />
        <Button
          value="Ecrire"
          secondary
          style={{width: 150, height: 38, borderRadius: 10,}}
          textStyle={{fontSize: 14}}
          onPress={() => handleContactButtonClick()}
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
      {activeTab === 'Artwork' &&
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
      }
    </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1
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
    flex: 1,
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
    elevation: 2
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
    backgroundColor: colors.darkGreyBg,
    padding: 12,
    borderRadius: 50,
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  artworkImage: {
    height: 120,
    width: 120,
    borderRadius: 7,
  },
});


export default OtherProfile;
