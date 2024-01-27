import React, { useState, useEffect, useContext } from 'react';
import { Alert, View, StyleSheet, Text, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import { MainContext } from '../context/MainContext';
import { get, post } from '../constants/fetch';
import Modal from 'react-native-modal';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

const SingleArt = ({ navigation, route }: any) => { 
  const context = useContext(MainContext);
  const token = context?.token;
  const id = route?.params?.id;
  const userId = route?.params?.userId;
  
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userCollections, setUserCollections] = useState<Collection | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const nextPage = () => {
    navigation.navigate('stripe');
  };

  const selectTag = () => {
  };

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
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewCollectionName('');
  };

  const createNewCollection = (collectionName: string) => {
    // Vérifie si le TextInput n'est pas vide
    if (newCollectionName.trim() !== '') {
      // Implémente la logique pour créer une nouvelle collection ici
      // Vous pouvez utiliser newCollectionName pour obtenir le nom entré
      console.log('Création d\'une nouvelle collection:', newCollectionName);

      // Enregistre l'œuvre dans la nouvelle collection
      // addToCollection(newCollectionName);

      // Ferme la modal après la création de la collection et l'ajout de l'œuvre
      closeModal();
    }
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

  useEffect(() => {
    checkIsLiked();
    checkIsSaved();
  }, []);

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
      {/* Modal personnalisée pour créer une nouvelle collection ou ajouter à une collection existante */}
      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enregistrer dans...</Text>

          {/* Liste des collections existantes de l'utilisateur */}
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

          {/* TextInput pour le nom de la nouvelle collection */}
          <TextInput
            style={styles.input}
            placeholder="Nouvelle collection"
            onChangeText={(text) => setNewCollectionName(text)}
          />
          {/* Bouton pour créer une nouvelle collection */}
          <TouchableOpacity style={styles.createButton} onPress={() => addToCollection(newCollectionName)}>
            <Text style={styles.createButtonText}>Créer</Text>
          </TouchableOpacity>

          {/* Bouton pour annuler */}
          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    },
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
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
      borderRadius: 5,
      padding: 8,
      marginBottom: 10,
    },
    createButton: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#3498db',
      alignItems: 'center',
    },
    createButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    cancelButton: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#ccc',
      alignItems: 'center',
      marginTop: 10,
    },
    cancelButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
});


export default SingleArt;
