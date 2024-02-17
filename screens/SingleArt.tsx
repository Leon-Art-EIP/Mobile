import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, StyleSheet, Text, Image, Dimensions, ScrollView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { post, get } from '../constants/fetch';

import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainContext } from '../context/MainContext';
import { useStripe } from '@stripe/stripe-react-native';
import { Linking } from 'react-native';
import { getImageUrl } from '../helpers/ImageHelper';
import ArtistCard from '../components/ArtistCard';
import { ArtistType } from '../constants/homeValues';
import axios from 'axios';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import Modal from 'react-native-modal';

const screenWidth = Dimensions.get('window').width;

const SingleArt = ({ navigation, route } : any) => {

  const context = useContext(MainContext);
  const token = context?.token;
  const [artist, setArtist] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [publication, setPublication] = useState(false);
  const [author, setAuthor] = useState(false);
  const [artists, setArtists] = useState<ArtistType[]>([]);
  const { id } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [userCollections, setUserCollections] = useState<Collection | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPublications();
    checkIsLiked();
    checkIsSaved();
  }, [id]);
  
  useEffect(() => {
    // if (publication && publication.userId) {
    //   fetchArtistDetails();
    // }
  }, [publication]);
  

  const fetchArtistDetails = async () => {
    try {
      const response = await get(`/api/user/profile/${publication.userId}`, context?.token);
      setArtist(response.data);
    }
    catch (error) {
      console.error("Error fetching artist details:", error);
    }
  };

  const handleToArtistProfile = (artist: ArtistType) => {
    console.log('artist id: ', artist._id);
    navigation.navigate('other_profile', { id: artist._id });
  };

  const getAuthorName = (userId) => {
    get(
      `/api/user/profile/${userId}`,
      context?.token,
      (response) => {
        setAuthor(response.data);
      },
      (error) => {
        console.error("Error fetching Artist Name:", error);
      }
    );
  };

  const fetchPaymentSheetParams = () => {
    console.log('In fetchPaymentSheetParams, sending id:', id);

    const requestData = {
      artPublicationId: id,
    };

  console.log('In fetchedpayebrlgvweblrfvbweijvbofvbe');
  post(
    '/api/order/create',
    requestData,
    context?.token,
    (response) => {
      console.log('Payment Sheet Params:', response);

      if (response && response.data && response.data.url) {
        const paymentUrl = response.data.url;
        Linking.openURL(paymentUrl)
          .catch(err => {
            console.error('Failed to open URL:', err);
            Alert.alert('Error', 'Failed to open the payment page.');
          });
      } else {
        console.error('No URL found in the response');
        Alert.alert('Error', 'Payment URL not found.');
      }
    },
  (error) => {
    console.error('Error fetching payment sheet parameters:', error);
    if (error.response && error.response.data && error.response.data.errors) {
      error.response.data.errors.forEach(err => {
        console.error(`API error - ${err.param}: ${err.msg}`);
        Alert.alert('This publication is not for sale');
      });
    }
  }
);

console.log('Request to /api/order/create sent with payload:', requestData);
};

  const openPaymentSheet = async () => {
    fetchPaymentSheetParams();
  };

  const handleArtistButtonClick = async () => {
    navigation.navigate('other_profile');
    
  }
  
  const previous = async () => {
    navigation.navigate('homemain');
  }


  const showAlert = (message) => {
    Alert.alert(
      "Art Publication",
      message,
    );
  };

  const getPublications = () => {
    get(
      `/api/art-publication/${id}`,
      context?.token,
      (response) => {
        console.log('🎨 Publications:', response.data)
        setPublication(response?.data || []);
        getAuthorName(response?.data.userId);
      },
      (error) => {
        console.error("Error fetching publications:", error);
      }
      );
    };
    
    const handleSavedButtonClick = async () => {
      setModalVisible(true);
    };

    const closeModal = () => {
      setModalVisible(false);
      setNewCollectionName('');
    };

    const addToCollection = async (collectionName: string) => {
      try {
        if (token) {
          const url = `/api/collection`;
          const body = {
            artPublicationId: id,
            collectionName: collectionName,
            isPublic: true
          };
          const callback = (response) => {
            console.log('Saved to collection successfully');
            Alert.alert('Oeuvre ajoutée à la collection \"' + collectionName + "\".");
            setIsSaved(true);
          };
          const onErrorCallback = (error) => {
            console.error('Error while saving to collection:', error);
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'enregistrement dans la collection.');
          };
          post(url, body, token, callback, onErrorCallback);
        } else {
          console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
          Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du token JWT :', error);
        Alert.alert('Erreur lors de la récupération du token JWT', 'Une erreur s\'est produite.');
      }
      closeModal();
    };

    const likePublication = async () => {
      try {
        if (token) {
          const url = `/api/art-publication/like/${id}`;
          const body = undefined;
          const callback = () => {
            setIsLiked(prevIsLiked => !prevIsLiked);
            console.log(isLiked);
            if (!isLiked && userCollections && userCollections.length > 0) {
              addToCollection(userCollections[0].name);
            }
          };
          const onErrorCallback = (error) => {
            console.error('Erreur de like :', error);
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
            // Alert.alert('Erreur de follow', 'Une erreur s\'est produite.');
          };
  
          post(url, body, token, callback, onErrorCallback);
        } else {
          console.error('Token JWT not found. Make sure the user is logged in.');
          // Alert.alert('Token JWT not found. Make sure the user is logged in.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Alert.alert('Error fetching user data', 'An error occurred while fetching user data.');
      }
      checkIsLiked();
    };
    
    const selectTag = () => {
    };

    const checkIsLiked = async () => {
      try {
        if (token) {
          const url = `/api/art-publication/users-who-liked/${id}`;
          const callback = (response) => {
            const responseData = response.data;
            const usersWhoLiked = responseData.users;
            const currentUserUsername = "VivantGarrigues";
            const isArtLiked = usersWhoLiked.some((user) => user.username === currentUserUsername);
  
            setIsLiked(isArtLiked);
            console.log(isLiked);
          };
          const onErrorCallback = (error) => {
            console.error('Error fetching like:', error);
            Alert.alert('Error', 'Les informations de like n\'ont pas pu être récupérées.');
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
  
    const checkIsSaved = async () => {
      try {
        if (token) {
          const url = `/api/collection/my-collections`;
          const callback = (response) => {
            setUserCollections(response.data);
            if (response.data) {
              for (const collection of response.data) {
                const collectionId = collection._id;
                try {
                  const collectionCallBack = (collectionResponse) => {
                    const collection = collectionResponse.data;
                    if (collection.some((publication) => publication._id === id)) {
                      setIsSaved(true);
                      return;
                    }
                  }
                  get(`/api/collection/${collectionId}/publications`, token, collectionCallBack);
                } catch (error) {
                  console.error(`Erreur lors de la récupération des détails de la collection ${collectionId}:`, error);
                }
              }
            }
            setIsSaved(false);
          };
          const onErrorCallback = (error) => {
            console.error('Error fetching collection:', error);
          };
          get(url, token, callback, onErrorCallback);
        } else {
          console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des œuvres de l\'utilisateur :', error);
      }
    };

    return (
      <View style={styles.container}>

      <ScrollView>
      <View style={styles.container}>

      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <View style={{ flexDirection: 'row'}}>
       <Text style={styles.artTitle}>{publication.name}</Text>
      <Text style={{ marginLeft: 35, fontSize: 23, color: 'black' }}> Prix : </Text>
      <Text style={{ marginLeft: 3, marginRight: 40, fontSize: 23, color: 'black' }}>
        {publication.price} €
       </Text>
      </View>
      <View style={{ flexDirection : 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        {author && (
          <ArtistCard
          showTitle={false}
          onPress={() => handleToArtistProfile(author)}
          item={author}
          path="other_profile"
          style={styles.artistCardStyle}
          />
          )}
        <Text style={styles.userIdText}>
          {author ? author.username : 'Loading...'}
        </Text>
      </View>
      <Text style={{ marginLeft: 27, marginBottom: 10, fontSize: 15, color: colors.darkGreyBg }}>
        {publication.description} ... Afficher plus
      </Text>
      <View>
        <Image 
          style={styles.img}
          source={{ uri: getImageUrl(publication.image) }}
          onError={() => console.log("Image loading error")}
        />
      </View>
      <View style={styles.rowContainer}>
        <Button
          value={isSaved ? "Enregistré" : "Enregistrer"}
          secondary={isSaved ? true : false}
          style={[styles.actionButton, { backgroundColor: colors.secondary }]}
          textStyle={{ fontSize: 14, textAlign: 'center', color: colors.black }}
          onPress={() => handleSavedButtonClick()}
        />
        <Button
          value={isLiked ? "Liké" : "Liker"}
          secondary={isLiked ? true : false}
          style={[styles.actionButton]}
          textStyle={{ fontSize: 14, textAlign: 'center', color: isLiked ? 'black' : 'white', }}
          onPress={likePublication}
        />
        <Button
          style={[styles.actionButton]}
          textStyle={{ fontSize: 14, textAlign: 'center', color: isLiked ? 'black' : 'white', }}
          value="Acheter"
          onPress={openPaymentSheet}
        />
      </View>
      <View>

      </View>
      {/* Fake Comments Section */}
    <View style={{ marginTop: 20, marginBottom: 30, marginLeft: 20, marginRight: 20 }}>
      {/* Display Fake Comments */}
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', marginRight: 5 }}>John Doe:</Text>
        <Text>This is an amazing piece of art!</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', marginRight: 5 }}>Jane Smith:</Text>
        <Text>I love the colors used in this artwork.</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', marginRight: 5 }}>Anonymous:</Text>
        <Text>Great job!</Text>
      </View>
    </View>

      {/*  MODAL */}

      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enregistrer dans...</Text>
          <FlatList
            data={userCollections}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.collectionButton}
                onPress={() => addToCollection(item.name)}
              >
                <Text style={styles.collectionButtonText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TextInput
            style={styles.input}
            placeholder="Nouvelle collection"
            onChangeText={(text) => setNewCollectionName(text)}
          />
          <TouchableOpacity style={styles.createButton} onPress={() => addToCollection(newCollectionName)}>
            <Text style={styles.createButtonText}>Créer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
    </ScrollView>
    <View style={{ marginTop: 0, marginBottom: 0, marginLeft: 20, marginRight: 20, }}>
      <TextInput
        placeholder="Commenter..."
        style={{
          borderWidth: 1,
          borderColor: colors.secondary,
          backgroundColor: colors.secondary,
          borderRadius: 50,
          padding: 10,
          paddingLeft: 20,
        }}
        // You can handle the user's input using onChangeText prop
        // For example: onChangeText={(text) => handleCommentInput(text)}
        />
      </View>
          {/* Comment Input */}
          {/* <View style={styles.commentInputContainer}>
        <TextInput
          placeholder="Commenter..."
          style={styles.commentInput}
          // value={newComment}
          onChangeText={text => setNewComment(text)}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.white,
    },
    logo: {
        flexDirection: 'row',
        height: 100,
        paddingLeft: 20,
        padding: 20,
        borderRadius: 5,
    },
    artistCardStyle: {
      // borderRadius: 30,
      container: { width: 40, height: 40, borderRadius: 30, marginTop: 0, color: 'white'},
      image: { width: 40, height: 40, borderRadius: 30, marginTop: 30 },
    },
    img: {
      alignSelf: 'center',
      resizeMode: 'contain',
      marginTop: 0,
      height: 345,
      width: 345,
      borderRadius: 5,
    },
    artTitle: {
      // alignSelf: 'center',
      marginLeft: 30,
      // textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 25,
      color: '#000',
      flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 0,
      alignItems: 'center',
    },
    actionButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 30,
      justifyContent: 'center',
      marginLeft: 'auto',
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.secondary,
    },
    buttonText: {
      fontSize: 14,
      color: colors.black,
    },
    userIdText: {
      marginLeft: 0,
      fontSize: 18,
      flex: 1,
      color: 'black',
    },
    saveButton: {
      backgroundColor: colors.secondary,
      width: 75,
      height: 38,
      borderRadius: 30,
      justifyContent: 'center',
      flex: 1,
    },
    likeButton: {
      color: 'white',
      flex: 1,
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
    },
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      maxHeight: 250,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 0,
    },
    collectionButton: {
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ccc',
      marginBottom: 10,
      alignItems: 'center',
    },
    collectionButtonText: {
      color: '#3498db',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 15,
      paddingLeft: 15,
      padding: 8,
      marginBottom: 10,
    },
    createButton: {
      padding: 10,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    createButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    cancelButton: {
      padding: 10,
      borderRadius: 18,
      backgroundColor: colors.darkGreyBg,
      alignItems: 'center',
      marginTop: 10,
    },
    cancelButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
});

export default SingleArt;
