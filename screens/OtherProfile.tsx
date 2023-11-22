import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import colors from '../constants/colors';
import bannerImage from '../assets/images/banner.jpg'
import profilePicture from '../assets/images/user.png'
import BackArrow from '../assets/images/back_arrow.png'
import Button from '../components/Button';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from '../env';

const OtherProfile = () => {
  const [followTargetID, setfollowTargetID] = useState<string | undefined>(undefined);
  const navigation = useNavigation();
  const [isFollowing, setIsFollowing] = useState(false);
  const { API_URL } = env;

  const [activeTab, setActiveTab] = useState('Artwork'); // État pour suivre le dernier bouton cliqué
  // TODO : remplacer pars cette version quand SingleArt est ready
  // const handleArtworkClick = (pageName, artworkId) => {
  //   navigation.navigate(pageName, artworkId);
  // };
  const handleArtworkClick = (pageName) => {
    navigation.navigate(pageName);
  };
  const handleBackButtonClick = () => {
    navigation.goBack();
  };
  const handleContactButtonClick = () => {
    //TODO : rediriger dynamiquement vers la bonne page
    navigation?.navigate('single_conversation', { id: 0, name: 'Marine Weber' });
  };
  const handleFollowButtonClick = async () => {
    //TODO : rendre dynamique
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(`${API_URL}api/follow/652bc1fb1753a08d6c7d3f5d`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }
    }
    catch (error) {
      console.error('Erreur de follow :', error);
      Alert.alert('Erreur de follow', 'Une erreur s\'est produite.');
    }
    checkIsFollowing();
  };
  const checkIsFollowing = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        const response = await axios.get(`${API_URL}api/follow/following`, {
          headers,
          params: {
            limit: 10,
          },
        });
        const responseData = response.data;
        const subscriptions = responseData.subscriptions;

        const isUserFollowed = subscriptions.some((subscription: { _id: string; }) => subscription._id === "652bc1fb1753a08d6c7d3f5d");
        setIsFollowing(isUserFollowed);
      } else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du suivi :', error);
      Alert.alert('Erreur de suivi', 'Une erreur s\'est produite.');
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
    likes: any[]; // You might want to define a type for likes as well
    comments: any[]; // You might want to define a type for comments as well
    __v: number;
  }
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const fetchUserArtworks = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        // TODO: Replace the hardcoded user ID with a dynamic value
        const userId = "652bc1fb1753a08d6c7d3f5d";
        const response = await axios.get<Artwork[]>(`${API_URL}api/art-publication/user/${userId}`, {
          headers,
          params: {
            page: 1,
            limit: 30,
          },
        });
        setUserArtworks(response.data);
      } else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des œuvres de l\'utilisateur :', error);
      Alert.alert('Erreur de récupération des œuvres', 'Une erreur s\'est produite.');
    }
  };
  useEffect(() => {
    fetchUserArtworks();
    checkIsFollowing();
  }, []);
  useFocusEffect(
    React.useCallback(() => {}, [navigation])
  );

  return (
    <ScrollView nestedScrollEnabled>
    <View>
      {/* Bouton de retour en haut à gauche */}
      <TouchableOpacity
        onPress={() => handleBackButtonClick()}
        style={styles.backButton}
      >
        <Image source={BackArrow} style={{ width: 24, height: 24, tintColor: 'white' }} />
      </TouchableOpacity>
      {/* Bannière */}
      <View style={styles.banner}>
        <Image
          source={bannerImage}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>
      {/* Photo de profile */}
      <View style={styles.overlayImage}>
        <View style={styles.circleImageContainer}>
          <Image
            source={profilePicture}
            style={styles.profilePicture}
          />
        </View>
      </View>
      {/* Blocs de texte */}
      <View style={styles.textBlocks}>
        {/* Bloc de texte follower */}
        <View style={styles.textBlock}>
          {/* TODO : remplacer par les vrais valeurs */}
          <Text style={styles.value}>1.3k</Text>
          <Text style={styles.title}>followers</Text>
        </View>

        {/* Bloc de texte au centre */}
        <View style={styles.centerTextBlock}>
          {/* TODO : remplacer par les vrais valeurs */}
          <Text style={styles.centerTitle}>Marine Weber</Text>
          <Text style={styles.centerSubtitle}>Ouvert aux commandes</Text>
        </View>

        {/* Bloc de texte posts */}
        <View style={styles.textBlock}>
          {/* TODO : remplacer par les vrais valeurs */}
          <Text style={styles.value}>64</Text>
          <Text style={styles.title}>posts</Text>
        </View>
      </View>
      {/* Boutons "Suivre" et "Ecrire" */}
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
      {/* Trait décoratif de séparation */}
      <View style={styles.decorativeLine} />
      {/* Boutons d'onglet, "Artwork", "Collections" et "A propos" */}
      <View style={styles.tabsNavigation}>
        <Button
          value="Artwork"
          secondary={activeTab !== 'Artwork'} // Utilisez secondary si ce n'est pas le bouton actif
          tertiary={activeTab === 'Artwork'} // Utilisez tertiary si c'est le bouton actif
          style={[styles.navigationTabButton, styles.marginRightForTabs]}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('Artwork')} // Met à jour le bouton actif
          />
        <Button
          value="Collection"
          secondary={activeTab !== 'Collection'}
          tertiary={activeTab === 'Collection'}
          style={[styles.navigationTabButton, styles.marginRightForTabs]}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('Collection')} // Met à jour le bouton actif
          />
        <Button
          value="A propos"
          secondary={activeTab !== 'A propos'}
          tertiary={activeTab === 'A propos'}
          style={styles.navigationTabButton}
          textStyle={styles.navigationTabButtonText}
          onPress={() => setActiveTab('A propos')} // Met à jour le bouton actif
          />
      </View>
      {/* Ensembles de cadres carrés */}
      {activeTab === 'Artwork' &&
  <View style={styles.squareContainer}>
    {userArtworks.map((artwork, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.squareFrame, { marginRight: (index + 1) % 3 !== 0 ? 5 : 0 }]}
      onPress={() => handleArtworkClick('singleArt', { artworkId: artwork._id })}
    >
      <Image
        source={{ uri: `${API_URL}api/${artwork.image}` }}
        style={{ flex: 1, borderRadius: 10 }}
        resizeMode="cover"
        onError={(error) => console.log(`Error loading image ${index}:`, error.nativeEvent)}
      />
    </TouchableOpacity>
  ))}
  </View>
}

    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  },
  centerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.tertiary,
    textAlign: 'center',
  },
  centerSubtitle: {
    fontSize: 12,
    color: 'rgba(112, 0, 255, 1)', // TODO : mettre une valeur provenant de colors
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
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
});

export default OtherProfile;