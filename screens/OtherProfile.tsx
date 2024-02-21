import { Alert, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native'
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign'
// Local imports
import { getImageUrl } from '../helpers/ImageHelper';
import { MainContext } from '../context/MainContext';
import { get, post, put } from '../constants/fetch';
import colors from '../constants/colors';
import Button from '../components/Button';
import { Artwork, ConversationType, UserData } from '../utils/data';

const OtherProfile = ({ route }: any) => {
  const navigation = useNavigation();
  const otherId = route?.params?.id;
  const context = useContext(MainContext);
  const token = context?.token;

  const [isFollowing, setIsFollowing] = useState(false);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [userArtworksCount, setUserArtworksCount] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('Artwork');
  const [conversationID, setConversationID] = useState<string>("");
  const [conversation, setConversation] = useState<ConversationType>();


  const handleArtworkClick = (publicationId: string) => {
    navigation.navigate('singleart', { otherID: publicationId });
  };

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handleFollowButtonClick = async () => {
    const success = (response) => {
      setIsFollowing(!isFollowing);
    };
    post(
      `/api/follow/${otherId}`,
      undefined,
      token,
      success,
      (err: any) => console.warn('Error following user: ', {...err}),
    );
    fetchUserData();
  };

  const handleContactButtonClick = async () => {
    await fetchConversation();
    navigateToConversation();
  };

  const fetchConversation = () => {
    const body = {
      UserOneId: context?.userId,
      UserTwoId: otherId,
    };
    const success = (response) => {
      setConversationID(response.data.convId);
      get(
        `/api/conversations/single/${conversationID}`,
        token,
        (response2: any) => setConversation(response2.data.chat),
        (err: any) => console.warn('Error fetching conversation : ', {...err}),
      );
    };
    put(
      `/api/conversations/create`,
      body,
      token,
      success,
      (err: any) => console.warn('Error accessing conversation : ', {...err}),
    );
  };

  const navigateToConversation = () => {
    console.log(conversation);
    console.log("UserOneId " + conversation?.UserOneId);

    const name = conversation?.UserOneId === context?.userId
    ? conversation?.UserTwoName
    : conversation?.UserOneName;


    const ids = [
      conversation?._id || '',
      conversation?.UserOneId || '',
      conversation?.UserTwoId || ''
    ].map(String);

    console.log('Name 1:', conversation?.UserOneName);
    console.log('Name 2:', conversation?.UserTwoName);
    console.log('SelfID:', context?.userId);
    console.log('Name to be sent:', name);

    navigation?.navigate('single_conversation', {
      name: name || '',
      ids: ids
    });
  };


  const fetchUserArtworks = async () => {
    get(
      `/api/art-publication/user/${otherId}`,
      token,
      (response: any) => setUserArtworks(response.data),
      (err: any) => console.warn('Error fetching user artworks : ', {...err}),
    );
  };

  const fetchUserData = async () => {
    get(
      `/api/user/profile/${otherId}`,
      token,
      (response: any) => setUserData(response.data),
      (err: any) => console.warn('Error fetching user datas : ', {...err}),
    );
  };

  const checkIsFollowing = async () => {
    get(
      "/api/follow/following",
      token,
      (response: any) => setIsFollowing(
        response.data?.subscriptions.some(
          (subscription: { _id: string }) => subscription._id === otherId
        )
      ),
      (err: any) => console.warn('Error checking following : ', {...err}),
    );
  };

  useEffect(() => {
    fetchUserData();
    fetchUserArtworks();
    fetchConversation();
    checkIsFollowing();
  }, []);

  useFocusEffect(
    React.useCallback(() => {}, [navigation])
  );


  return (
    <SafeAreaView style={styles.container}>
    <ScrollView nestedScrollEnabled>
      <StatusBar backgroundColor={colors.white} barStyle='dark-content' />
      {/* Back button */}
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
      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={{ uri: getImageUrl(userData?.bannerImage) }}
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
            defaultSource={require('../assets/icons/account.svg')}
          />
        </View>
      </View>
      {/* Text blocks */}
      <View style={styles.textBlocks}>
        {/* Followers text block */}
        <View style={styles.textBlock}>
          <Text style={styles.value}>{userData ? Math.max(userData.subscribersCount, 0) : 0}</Text>
          <Text style={styles.title}>followers</Text>
        </View>
        {/* Center text block */}
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
      {/* Follow and Contact buttons */}
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
          value="Collection"
          secondary={activeTab !== 'Collection'}
          tertiary={activeTab === 'Collection'}
          style={[styles.navigationTabButton, styles.marginRightForTabs]}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('Collection')}
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
