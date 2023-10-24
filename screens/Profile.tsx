import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import colors from '../constants/colors';
import bannerImage from '../assets/images/banner.jpg'
import profilePicture from '../assets/images/user.png'
import BackArrow from '../assets/images/back_arrow.png'
import EditButtonImage from '../assets/images/edit_logo.png'
import SettingsButtonImage from '../assets/images/settings_logo.png'
import Button from '../components/Button';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import env from '../env';

const Profile = () => {
  const { API_URL } = env;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Artwork'); 
  const [userCollections, setUserCollections] = useState([]);

  const handleBackButtonClick = () => {
    navigation.goBack();
  };
  const handleEditButtonClick = () => {
    navigation.navigate('editprofile');
  };
  const handleSettingsButtonClick = () => {
    navigation.navigate('settings');
  };

  useFocusEffect(
    React.useCallback(() => {
      
      
    }, [navigation])
  );
  useEffect(() => {
    // Appelez checkIsFollowing lors du chargement de la page
    updateCollections();
  }, []);
  const updateCollections = async () => {
    const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        // Effectuez l'appel API pour obtenir les collections de l'utilisateur connecté
        const collectionsResponse = await axios.get(`${API_URL}api/collection/my-collections`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userCollections = collectionsResponse.data;
        setUserCollections(userCollections);
        console.log(userCollections);
      }
      else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }
  }
  return (
    <ScrollView nestedScrollEnabled>
    <View>
      <View style={{ flexDirection: 'row', marginRight: 20 }}>
        <TouchableOpacity
          onPress={() => handleBackButtonClick()}
          style={styles.backButton}
        >
          <Image source={BackArrow} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleEditButtonClick()}
          style={styles.editButton}
        >
          <Image source={EditButtonImage} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSettingsButtonClick()}
          style={styles.settingButton}
        >
          <Image source={SettingsButtonImage} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.banner}>
        <Image
          source={bannerImage} 
          style={styles.bannerImage} 
          resizeMode="cover" 
        />
      </View>
      
      <View style={styles.overlayImage}>
        <View style={styles.circleImageContainer}>
          <Image
            source={profilePicture}
            style={styles.profilePicture}
          />
        </View>
      </View>
      
      <View style={styles.textBlocks}>
        
        <View style={styles.textBlock}>
          
          <Text style={styles.value}>1.3k</Text>
          <Text style={styles.title}>followers</Text>
        </View>

        
        <View style={styles.centerTextBlock}>
          
          <Text style={styles.centerTitle}>Linus T</Text>
          <Text style={styles.centerSubtitle}>Ouvert aux commandes</Text>
        </View>

        
        <View style={styles.textBlock}>
          
          <Text style={styles.value}>64</Text>
          <Text style={styles.title}>posts</Text>
        </View>
      </View>
      
      <View style={styles.decorativeLine} />
      
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
      
      {activeTab === 'Artwork' &&
        Array.from({ length: 7 }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.rowContainer}>
            {Array.from({ length: 3 }, (_, colIndex) => (
              <View key={colIndex} style={styles.squareFrameArtwork} />
            ))}
          </View>
        ))
      }
      
      {activeTab === 'Collection' && userCollections.length > 0 && (
        <View>
          {userCollections.map(collection => (
            <View key={collection._id}>
              <Text style={styles.collectionName}>{collection.name}</Text>
              {collection.artPublications.map(artworkId => (
                <Text key={artworkId} style={styles.artworkName}>
                  {artworkId}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}
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
  squareFrameArtwork: {
    width: 115, 
    height: 115, 
    backgroundColor: 'lightgray', 
    borderRadius: 10, 
  },
  squareFrameCollection: {
    width: 174, 
    height: 115, 
    backgroundColor: colors.tertiary, 
    borderRadius: 10, 
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
    color: 'white', // Texte en blanc
    backgroundColor: colors.tertiary, // Fond noir pour la capsule
    padding: 10, // Espace autour du texte à l'intérieur de la capsule
    marginBottom: 10, // Espace entre les capsules de collection
    borderRadius: 40, // Coins arrondis pour la capsule
    marginLeft: 10,
    marginRight: 30,
  },
  artworkName: {
    fontSize: 16,
    color: 'black',
    marginLeft: 20,
  },
});

export default Profile;
