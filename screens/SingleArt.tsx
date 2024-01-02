import React, { useState, useEffect } from 'react';
import { Alert, View, StyleSheet, Text, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';

const nextPage = () => {
};

const selectTag = () => {
};


const SingleArt = () => {
  const { API_URL } = env;
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    checkIsLiked();
    checkIsSaved();
  }, []);

  const handleArtistButtonClick = async () => {
    // TODO : rendre dynamique
    navigation.navigate('other_profile');

  }

  const previous = async () => {
    navigation.navigate('homemain');
  }

  const handleLikeButtonClick = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(`${API_URL}api/art-publication/like/65377fcbbfacccdbe11c44ce`, {}, {
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
    checkIsLiked();
  };
  const handleSavedButtonClick = async () => {
    //TODO : rendre dynamique
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const requestBody = {
          artPublicationId: "65377fcbbfacccdbe11c44ce",
          collectionName: "Oeuvres likées",
          isPublic: true,
        };  
        const response = await axios.post(`${API_URL}api/collection`, requestBody, {
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
      console.error('Erreur d\'enregistrement :', error);
      Alert.alert('Erreur d\'enregistrement', 'Une erreur s\'est produite.');
    }
    checkIsSaved();
  };
  const checkIsLiked = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        const response = await axios.get(`${API_URL}api/art-publication/users-who-liked/65377fcbbfacccdbe11c44ce`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = response.data;
        const usersWhoLiked = responseData.users;
        const currentUserUsername = "VivantGarrigues";
        const isArtLiked = usersWhoLiked.some((user) => user.username === currentUserUsername);
  
        setIsLiked(isArtLiked);
      } else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du suivi :', error);
      Alert.alert('Erreur de suivi', 'Une erreur s\'est produite.');
    }
  };
  const checkIsSaved = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const collectionsResponse = await axios.get(`${API_URL}api/collection/my-collections`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userCollections = collectionsResponse.data;
        const oeuvresLikeesCollection = userCollections.find(collection => collection.name === "Oeuvres likées");
  
        if (oeuvresLikeesCollection) {
          const oeuvresLikeesCollectionId = oeuvresLikeesCollection._id;
          const oeuvresLikeesDetailsResponse = await axios.get(`${API_URL}api/collection/${oeuvresLikeesCollectionId}/publications`, {
            headers,
          });
          const oeuvresLikeesPublications = oeuvresLikeesDetailsResponse.data;
          const isArtSaved = oeuvresLikeesPublications.some(publication => publication._id === "65377fcbbfacccdbe11c44ce");
          setIsSaved(isArtSaved);
        } else {
          setIsSaved(false);
        }
      } else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du suivi :', error);
      Alert.alert('Erreur de suivi', 'Une erreur s\'est produite.');
    }
    console.log(isSaved);
  };
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <View style={{ flexDirection: 'row', paddingRight: 20, paddingLeft: 20 }}>
        <Text style={styles.artTitle}>Les voix du Néant</Text>
      </View>
      <View>
        <Image style={styles.img} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 20, paddingLeft: 20 }}>
        <TagButton
          onPress={handleArtistButtonClick}/>
        <Text style={{ marginLeft: 90, fontSize: 10 }}/>
        <Button
          value={isSaved ? "Saved" : "Save"}
          secondary= {isSaved ? true : false}
          style={{
            backgroundColor: colors.secondary,
            width: 75,
            height: 38,
            borderRadius: 30,
            marginLeft: 55,
            justifyContent: 'center',
          }}
          textStyle={{fontSize: 14, textAlign: 'center', color: colors.black}}
          onPress={() => handleSavedButtonClick()}
          />
        <Button
          value={isLiked ? "Liké" : "Like"}
          secondary= {isLiked ? true : false}
          style={{
            width: 70,
            height: 38,
            borderRadius: 30,
            marginLeft: 0,
            justifyContent: 'center',
            backgroundColor: colors.artistPlHolder,
          }}
          textStyle={{fontSize: 14, textAlign: 'center', paddingTop: -100}}
          onPress={() => handleLikeButtonClick()}
          />
      </View>
      <View>
      <Text style={{ marginLeft: 20, fontSize: 20 }}>
          200€
        </Text>
      <Text style={{ marginLeft: 20, fontSize: 15 }}>
        Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
      </Text>
      </View>
      <View style={{ marginTop: 20, marginBottom: 30 }}>

        <Button
          value="Acheter"
          onPress={nextPage}
        />
        <Button
          style={{ backgroundColor: colors.secondary }}
          textStyle={{ color: colors.black }}
          value="Retour"
          onPress={previous}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.white,
    },
    logo: {
        flexDirection: 'row',
        height: 100,
        paddingLeft: 20,
        padding: 20,
        borderRadius: 5,
    },
    img: {
        margin: 13,
        height: 300,
        borderRadius: 15,
        backgroundColor: colors.articlePlHolder,
    },
    artTitle: {
        textAlign: 'center',
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 75,
        fontSize: 25,
        color: '#000',
    },
    artText: {
        fontSize: 55,
        color: '#000',
    },
    Tags: {
        justifyContent: 'space-between',
        margin: 50,
        flex: 1,
    },
    TagButton: {
        backgroundColor: '#F4F4F4',
        
    },
    TagButtonText: {
        color: '#000',
    },
    favorite: {
    margin: 10,
    },
    vector: {
        width: 25,
        height: 31,
    }
});


export default SingleArt;
