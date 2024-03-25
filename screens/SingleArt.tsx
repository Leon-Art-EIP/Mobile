import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Alert, Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView, StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
import {del, get, post} from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import {MainContext} from '../context/MainContext';
import {useStripe} from '@stripe/stripe-react-native';
import {getImageUrl} from '../helpers/ImageHelper';
import ArtistCard from '../components/ArtistCard';
import {ArtistType, PostType} from '../constants/homeValues';
import Modal from 'react-native-modal';
import {
  acCenter,
  aiCenter,
  bgColor, bgRed, cBlack,
  cPrimary,
  flex1,
  flexRow,
  mbAuto,
  mh24, mh8,
  ml8, mlAuto,
  mr8,
  mtAuto
} from "../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import SlidingUpPanel from "rn-sliding-up-panel";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const SingleArt = ({ navigation, route } : any) => {
  const context = useContext(MainContext);
  const token = context?.token;
  const [artist, setArtist] = useState<ArtistType | undefined>(undefined);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [publication, setPublication] = useState<PostType | undefined>(undefined);
  const [author, setAuthor] = useState(false);
  const { id } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [userCollections, setUserCollections] = useState<Collection | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const isOwnArtist = context?.userId === artist?._id;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  let _slidingPanel = useRef<SlidingUpPanel>(null);


  useEffect(() => {
    if (isDeleteModalShown) {
      return _slidingPanel.current.show();
    }
    return _slidingPanel.current.hide();
  }, [isDeleteModalShown]);

  useEffect(() => {
    getPublications();
    checkIsLiked();
    checkIsSaved();
  }, [id]);


  useEffect(() => {
    if (publication && publication.userId) {
      fetchArtistDetails();
    }
  }, [publication]);


  const fetchArtistDetails = async () => {
    get(
      `/api/user/profile/${publication.userId}`,
      context?.token,
      (response) => setArtist(response?.data),
      (error) => {
        ToastAndroid.show("Could not get artist data. Try again later", ToastAndroid.LONG);
        return console.error("Error getting profile data: ", error);
      }
    );
  };

  const handleToArtistProfile = (artistId: string) => {
    navigation.navigate('other_profile', { id: artistId });
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
    const requestData = {
      artPublicationId: id,
    };

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


  const deletePost = () => {
    const callback = () => {
      const msg: string = "Post supprimé avec succès !";
      ToastAndroid.show(msg, ToastAndroid.SHORT);
      setIsDeleteModalShown(false);
      return navigation.goBack();
    }

    const onErrorCallback = (err: any) => {
      let errorMsg: string = err?.response?.data?.msg;

      console.error("Delete post ", err?.response?.status, ' : ', errorMsg);
      ToastAndroid.show(errorMsg, ToastAndroid.LONG);
      return setIsDeleteModalShown(false);
    }

    del(
      `/api/art-publication/${id}`,
      context?.token,
      callback,
      onErrorCallback
    );
  }


  const getPublications = () => {
    get(
      `/api/art-publication/${id}`,
      context?.token,
      (response) => {
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
        setIsLiked((current: boolean) => !current);
      } else {
        console.error('Token JWT not found. Make sure the user is logged in.');
        // Alert.alert('Token JWT not found. Make sure the user is logged in.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Alert.alert('Error fetching user data', 'An error occurred while fetching user data.');
    }
  };

  const checkIsLiked = async () => {
    try {
      if (!token) {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        return;
      }

      const url = `/api/art-publication/users-who-liked/${id}`;

      const callback = (response) => {
        const usersWhoLiked = response.data?.users;
        const isArtLiked = usersWhoLiked.some((user) => user?.username === context?.username);

        return setIsLiked(!!isArtLiked);
      };

      const onErrorCallback = (error) => {
        console.error('Error fetching like:', error);
        Alert.alert('Error', 'Les informations de like n\'ont pas pu être récupérées.');
      };

      return get(url, token, callback, onErrorCallback);
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
    <ScrollView
      contentContainerStyle={flex1}
      style={[ bgColor ]}
      scrollEnabled={!isDeleteModalShown}
    >
      <View style={styles.container}>
        <View style={styles.logo}>

          {/* Go back button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[ aiCenter, mr8, mtAuto, mbAuto ]}
          >
            <Ionicons name="chevron-back-outline" color={colors.black} size={32} />
          </TouchableOpacity>

          {/* Title */}
          <Title style={[ cPrimary, mtAuto, mbAuto ]}>Leon</Title>
          <Title style={[ cBlack, mtAuto, mbAuto ]}>'Art</Title>
        </View>

        <View style={[ flexRow, acCenter, mh24 ]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('other_profile', { id: artist?._id })}
          >
            <Image
              source={{ uri: getImageUrl(artist?.profilePicture) }}
              style={{ height: 50, width: 50 }}
            />
          </TouchableOpacity>

          <ScrollView horizontal style={{ marginLeft: 24 }}>
            <Text style={styles.artTitle}>{publication?.name}</Text>
          </ScrollView>
        </View>

        {/* Main picture */}
        <Image
          style={styles.img}
          source={{ uri: getImageUrl(publication?.image) }}
          onError={() => console.log("Image loading error")}
        />

        {/* Action bar */}
        <View style={[ flexRow, flex1, mh24 ]}>

          {/* Save to collection button */}
          <TouchableOpacity
            style={[ styles.deleteBtn, mr8 ]}
            onPress={handleSavedButtonClick}
          >
            <MaterialIcons
              name="playlist-add"
              size={32}
              color={colors.black}
              style={[ mtAuto, mbAuto ]}
            />
          </TouchableOpacity>

          {/* Like button */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={likePublication}
          >
            <MaterialCommunityIcons
              name={isLiked ? 'cards-heart' : 'cards-heart-outline'}
              size={32}
              style={[ mtAuto, mbAuto ]}
              color={isLiked ? colors.primary : colors.black}
            />
          </TouchableOpacity>

          {/* Delete post button */}
          { isOwnArtist && (
            <TouchableOpacity
              style={[ styles.deleteBtn, mlAuto ]}
              onPress={() => setIsDeleteModalShown(true)}
            >
              <MaterialIcons
                name="delete"
                size={32}
                color={colors.primary}
                style={[ mtAuto, mbAuto ]}
              />
            </TouchableOpacity>
          ) }
        </View>
      </View>

      {/* title + description */}
      <View>
        <Text style={{ marginLeft: 35, fontSize: 23, color: 'black' }}>
          { publication?.price ?? "0" } €
        </Text>
        <Text style={{ marginLeft: 35, fontSize: 15 }}>
          { publication?.description ?? "L'artiste n'a pas donné de description à son oeuvre" }
        </Text>
      </View>

      {/* Go back + buy button */}
      <View style={{ marginTop: 20, marginBottom: 30, flexDirection: 'row' }}>

        {/* Go back button */}
        <Button
          style={{ backgroundColor: colors.secondary, flex: 1 }}
          textStyle={{ color: colors.black }}
          value="Retour"
          onPress={previous}
        />

        {/* Buy button */}
        <Button
          value="Acheter"
          onPress={openPaymentSheet}
          style={flex1}
        />
      </View>

      {/* Modal to save in collection */}
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

      {/* Modal to confirm deleting the post */}
      <SlidingUpPanel
        ref={_slidingPanel}
        height={Dimensions.get('window').height / 5}
        containerStyle={styles.deleteModal}
        draggableRange={{ top: Dimensions.get('window').height / 5, bottom: 0 }}
        onBackButtonPress={() => {
          setIsDeleteModalShown(false)
          return true;
        }}
        onBottomReached={() => setIsDeleteModalShown(false)}
      >
        <>
          <Text style={{ margin: 24 }}>Voulez-vous vraiment supprimer cette oeuvre ?</Text>
          <View style={flexRow}>
            <Button
              value="Oui"
              onPress={deletePost}
              style={flex1}
            />
            <Button
              secondary
              value="Non"
              style={flex1}
              onPress={() => setIsDeleteModalShown(false)}
            />
          </View>
        </>
      </SlidingUpPanel>
    </ScrollView>
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
    borderRadius: 30,
    container: {
      width: 45,
      height: 45,
      borderRadius: 30,
      marginTop: 0,
      color: colors.white
    },
    image: {
      width: 45,
      height: 45,
      borderRadius: 30,
      marginTop: 25
    },
  },
  img: {
    alignSelf: 'center',
    resizeMethod: 'contain',
    backgroundColor: colors.bg,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    height: 330,
    width: 330,
    borderRadius: 5,
  },
  artTitle: {
    alignSelf: 'center',
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    color: colors.black,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
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
    marginLeft: 6,
    fontSize: 16,
    flex: 1,
    color: colors.black
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
    color: colors.white,
    flex: 1,
  },
  artText: {
    fontSize: 55,
    color: colors.black,
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
    color: colors.black,
  },
  favorite: {
    margin: 10,
  },
  vector: {
    width: 25,
    height: 31,
  },
  button: {
    width: 70,
    height: 38,
    borderRadius: 30,
    marginLeft: 0,
    justifyContent: 'center',
    backgroundColor: colors.black
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
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
    color: colors.white,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    alignItems: 'center'
  },
  cancelButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: colors.disabledBg,
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  deleteModal: {
    backgroundColor: colors.bg,
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 2
  }
});


export default SingleArt;