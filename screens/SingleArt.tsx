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
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import {MainContext} from '../context/MainContext';
import {useStripe} from '@stripe/stripe-react-native';
import {getImageUrl} from '../helpers/ImageHelper';
import ArtistCard from '../components/ArtistCard';
import {ArtistType, PostType} from '../constants/homeValues';
import Modal from 'react-native-modal';
import {
  acCenter,
  aiCenter,
  bgColor, bgGrey, bgRed, br20, cBlack,
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
import Ionicons from "react-native-vector-icons/Ionicons";
import SlidingUpPanel from "rn-sliding-up-panel";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CommentInput from '../components/CommentInput';
import CommentsList from '../components/cards/CommentsList';


const SingleArt = ({ navigation, route } : any) => {

  const { id } = route.params;
  const context = useContext(MainContext);
  const token = context?.token;
  const [artist, setArtist] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [publication, setPublication] = useState(false);
  const [isSold, setSoldState] = useState(false);
  const [isForSale, setSaleState] = useState(false);
  const [author, setAuthor] = useState(false);
  const [artists, setArtists] = useState<ArtistType[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userCollections, setUserCollections] = useState<Collection | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const _slidingPanel = useRef<SlidingUpPanel>(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDeleteModalShown) {
      _slidingPanel.current?.show();
    } else {
      _slidingPanel.current?.hide();
    }
  }, [isDeleteModalShown]);
  
  

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
      const response = await get(`/api/user/profile/${publication.userId}`,
      context?.token);
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

  const deletePost = () => {
    const callback = () => {
      const msg = "Post supprimé avec succès !";
      ToastAndroid.show(msg, ToastAndroid.SHORT);
      setIsDeleteModalShown(false);
      return navigation.goBack();
    };

    const onErrorCallback = (err: any) => {
      const errorMsg: string = err?.response?.data?.msg;

      console.error("Delete post ", err?.response?.status, ' : ', errorMsg);
      ToastAndroid.show(errorMsg, ToastAndroid.LONG);
      return setIsDeleteModalShown(false);
    };

    del(
      `/api/art-publication/${id}`,
      context?.token,
      callback,
      onErrorCallback
    );
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
        setSoldState(response?.data.isSold);
        setSaleState(response?.data.isForSale)
        console.log('🤑💵 Is Sooooold', isSold);
        console.log('💵 !! Is FOR SALE', isForSale);
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
            const currentUserUsername = "";
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
      <View style={{ flexDirection: 'row',  alignItems: 'center'}}>
        <Text style={styles.artTitle}>{publication.name}</Text>
        <Text style={{fontSize: 23, color: 'black' }}>, {publication.price} €</Text>
        { context?.userId === publication?.userId && (
            <TouchableOpacity
              style={[mtAuto, mbAuto, mlAuto]}
              onPress={() => setIsDeleteModalShown(true)}
            >
              <MaterialCommunityIcons
                name='delete'
                color={colors.primary}
                size={32}
              />
            </TouchableOpacity>
          )}
      </View>
      <Text style={{ marginLeft: 30, marginBottom: 10, fontSize: 16, color: colors.darkGreyBg }}>
        {publication.description} ... Afficher plus
      </Text>
      <View>
        <Image
          style={styles.img}
          source={{ uri: getImageUrl(publication.image) }}
          onError={() => console.log("Image loading error")}
        />
      </View>
      <View>
      {isForSale && (
        <Button
          style={[styles.actionButton, isSold ? styles.soldButton : styles.availableButton, { width: '80%' }]}
          textStyle={{ fontSize: 20, textAlign: 'center', color: isSold ? colors.disabledText : 'white' }}
          value={isSold ? "Vendu" : "Acheter"}
          onPress={openPaymentSheet}
          disabled={isSold}
        />
      )}
      </View>


      {/* Informations */}
      <View style={styles.rowContainer}>
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
    <TouchableOpacity
        onPress={() => handleSavedButtonClick()} // Save action for the bookmark icon
    >
        <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} color={colors.black} size={32} />
    </TouchableOpacity>
    <TouchableOpacity
        onPress={() => likePublication()}
    >
        <Ionicons name={isLiked ? "heart" : "heart-outline"} color={colors.black} size={32}/>
    </TouchableOpacity>
</View>

      <View>

    </View>
    <CommentsList id={ id }></CommentsList>

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
      <SlidingUpPanel
        ref={_slidingPanel}
        height={200} // Adjust as needed
        draggableRange={{ top: 200, bottom: 0 }}
        allowDragging={false}
      >
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Are you sure you want to delete this post?</Text>
    <Button title="Yes, Delete" onPress={deletePost} />
    <Button title="Cancel" onPress={() => setIsDeleteModalShown(false)} />
  </View>
</SlidingUpPanel>

    </View>
    </ScrollView>
      <CommentInput id={ id }></CommentInput>
    </View>
  );
};

const styles = StyleSheet.create({

  // Comments :

  commentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  commentContent: {
    flexDirection: 'row',
    marginBottom: 5,
  },

  publishedTime: {
    color: '#888',
  },

  // MAIN :

    container: {
        flex: 1,
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
      marginTop: 10,
      height: 345,
      width: 345,
      borderRadius: 5,
    },
    artTitle: {
      marginLeft: 30,
      fontWeight: 'bold',
      fontSize: 25,
      color: '#000',
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 0,
      alignItems: 'center',
      marginRight: 20,
    },
    actionButton: {
      // borderRadius: 30,
      justifyContent: 'center',
      alignSelf: 'center',
      // marginLeft: 'auto',
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
      width: '70%',
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
    button:
    {
      width: '70%',
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
      // paddingLeft: 15,
      // padding: 8,
      marginBottom: 10,
    },

    // Buttons

    soldButton: {
      backgroundColor: colors.disabledBg,
    },
    availableButton: {
      // Styles specific to the button when it's available
      backgroundColor: colors.primary,
    },
    createButton: {
      // padding: 10,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    createButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    cancelButton: {
      // padding: 10,
      borderRadius: 18,
      backgroundColor: colors.darkGreyBg,
      alignItems: 'center',
      marginTop: 10,
    },
    cancelButtonText: {
      color: 'white',
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
});

export default SingleArt;