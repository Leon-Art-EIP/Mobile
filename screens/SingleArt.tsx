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
  Touchable,
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
  bgColor, bgGrey, bgRed, br20, cBlack,
  cPrimary,
  flex1,
  flexRow,
  mbAuto,
  mh24, mh8,
  ml8, mlAuto,
  mr8,
  mtAuto,
  mv8,
  ph24,
  ph8,
  pv4,
  pv8
} from "../constants/styles";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import SlidingUpPanel from "rn-sliding-up-panel";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CommentInput from '../components/CommentInput';
import CommentsList from '../components/CommentsList';
import ImageViewer from 'react-native-image-zoom-viewer';


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
  const _slidingPanel = useRef<SlidingUpPanel>(null);

  // In case we use more than one currency for different countries
  const [currency, setCurrency] = useState<string>("€");


  useEffect(() => {
    if (isDeleteModalShown) {
      return _slidingPanel?.current.show();
    }
    return _slidingPanel?.current.hide();
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

  useEffect(() => {
    getPublications();
    checkIsLiked();
    checkIsSaved();
  }, []);


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


  const getArtistName = (userId) => {
    get(
      `/api/user/profile/${userId}`,
      context?.token,
      (response) => {
        setArtist(response.data);
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


  const getPublications = () => {
    get(
      `/api/art-publication/${id}`,
      context?.token,
      (response) => {
        setPublication(response?.data || []);
        getArtistName(response?.data.userId);
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
    if (!token) {
      console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      return Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
    }

    const url = `/api/collection`;
    const body = {
      artPublicationId: id,
      collectionName: collectionName,
      isPublic: true
    };

    const callback = (response: any) => {
      console.log('Saved to collection successfully');
      Alert.alert('Oeuvre ajoutée à la collection \"' + collectionName + "\".");
      setIsSaved(true);
      checkIsSaved();
    };

    const onErrorCallback = (error: any) => {
      console.error('Error while saving to collection:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'enregistrement dans la collection.');
    };

    post(url, body, token, callback, onErrorCallback);
    closeModal();
  };


  const likePublication = async () => {
    if (!token) {
      return console.error('Token JWT not found. Make sure the user is logged in.');
    }

    const url = `/api/art-publication/like/${id}`;
    const body = undefined;

    const onPost = () => {
      /* setIsLiked(prevIsLiked => !prevIsLiked); */
      checkIsLiked();
      console.log(isLiked);

      if (!isLiked && userCollections && userCollections.length > 0) {
        addToCollection(userCollections[0].name);
      }
    };

    const onPostError = (error) => {
      console.error('Erreur de like :', error);
    };

    post(url, body, token, onPost, onPostError);
  };


  const checkIsLiked = async () => {
    if (!token) {
      console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      return Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
    }

    const url = `/api/art-publication/users-who-liked/${id}`;

    const callback = (response) => {
      const usersWhoLiked: any[] = response.data?.users;
      const isArtLiked = usersWhoLiked.some((user: any) => user?._id === context?.userId);

      return setIsLiked(isArtLiked);
    };

    const onErrorCallback = (error) => {
      console.error('Error fetching like:', error);
      Alert.alert('Error', 'Les informations de like n\'ont pas pu être récupérées.');
    };

    return get(url, token, callback, onErrorCallback);
  };


  const checkIsSaved = async () => {
      if (!token) {
        return console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }

      const url = `/api/collection/my-collections`;

      const callback = (response: any) => {
        setUserCollections(response?.data);
        if (!response?.data) {
          return
        }

        for (const collection of response.data) {
          const collectionId = collection._id;

          const collectionCallBack = (collectionResponse: any) => {
            const collection: any[] = collectionResponse.data;
            if (collection.some((publication) => publication._id === id)) {
              setIsSaved(true);
              return;
            }
          };

          get(`/api/collection/${collectionId}/publications`, token, collectionCallBack);
        }
        setIsSaved(false);
      };

      const onErrorCallback = (error: any) => {
        console.error('Error fetching collection:', error);
      };

      get(url, token, callback, onErrorCallback);
  };


  return (
    <View
      style={[ bgColor, flex1, ph24, pv4 ]}
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

          {/* Delete post (if artist) */}
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
          ) }
        </View>

        <View style={[ flexRow, acCenter ]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('other_profile', { id: artist?._id })}
            style={[bgGrey, { borderRadius: 50, height: 50 }]}
          >
            <Image
              source={{ uri: getImageUrl(artist?.profilePicture) }}
              style={{ height: 50, width: 50, borderRadius: 50 }}
            />
          </TouchableOpacity>

          <ScrollView horizontal style={{ marginLeft: 24 }}>
            <Text style={styles.artTitle}>{publication?.name}</Text>
          </ScrollView>

        </View>

        {/* Main picture */}
        { getImageUrl(publication?.image) ? (
          <ImageViewer
            style={styles.img}
            backgroundColor={colors.disabledBg}
            imageUrls={[{ url: getImageUrl(publication?.image) ?? "" }]}
            renderIndicator={() => <></>}
          />
        ) : (
          <View style={styles.img} />
        ) }
      </View>

      <View style={flex1}>
        {/* price + description */}
        <View style={flex1}>

          {/* price, like, save */}
          <View style={[ flexRow, mv8 ]}>
            <Text style={styles.priceText}>
              { publication?.price ?? "0" } { currency }
            </Text>

            <TouchableOpacity
              onPress={likePublication}
              style={mh8}
            >
              <AntDesign
                name={isLiked ? "heart" : "hearto"}
                size={32}
                color={isLiked ? colors.primary : colors.black}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSavedButtonClick}
              style={mh8}
            >
              <Ionicons
                name={isSaved ? "checkmark-circle" : "add-circle-outline"}
                color={isSaved ? colors.primary : colors.black}
                size={32}
              />
            </TouchableOpacity>
          </View>

          {/* description */}
          <ScrollView style={{ flexGrow: 1 }}>
            <Text style={{ fontSize: 15 }}>
              { publication?.description ?? "L'artiste n'a pas donné de description à son oeuvre" }
            </Text>
          </ScrollView>
        </View>

        {/* Go back + buy button */}
        <View style={flexRow}>

          {/* Go back button */}
          <Button
            style={[ flex1, { marginLeft: 0 } ]}
            textStyle={{ color: colors.black }}
            value="Retour"
            onPress={() => navigation.goBack()}
            secondary
          />

          {/* Buy button */}
          <Button
            value="Acheter"
            onPress={openPaymentSheet}
            style={[ flex1, { marginRight: 0 } ]}
          />
        </View>
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

      {/* This is commented for now because it does not work */}
      {/* <CommentInput id={ id }></CommentInput> */}

      {/* Modal to confirm deleting the post */}
      <SlidingUpPanel
        ref={_slidingPanel}
        height={Dimensions.get('window').height / 5}
        containerStyle={styles.deleteModal}
        draggableRange={{ top: Dimensions.get('window').height / 5, bottom: 0 }}
        onBackButtonPress={() => {
          setIsDeleteModalShown(false);
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
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logo: {
    flexDirection: 'row',
    height: 100,
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
    backgroundColor: colors.bg,
    marginTop: 20,
    width: '100%',
    borderRadius: 5,
  },
  priceText: {
    fontSize: 18,
    color: colors.black,
    marginRight: 'auto',
    backgroundColor: colors.disabledBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50
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
