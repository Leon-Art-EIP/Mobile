import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { del, get, post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import { MainContext } from '../context/MainContext';
import { getImageUrl } from '../helpers/ImageHelper';
import { ArtistType, PostType } from '../constants/homeValues';
import Modal from 'react-native-modal';
import {
  acCenter,
  aiCenter,
  bgColor,
  bgGrey,
  cBlack,
  cPrimary,
  flex1,
  flexRow,
  mbAuto,
  mh8,
  mlAuto,
  mr8,
  mr20,
  mrAuto,
  mtAuto,
  mv8,
  ph24,
  pv4,
} from '../constants/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SlidingUpPanel from 'rn-sliding-up-panel';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommentInput from '../components/CommentInput';
import CommentsList from '../components/cards/CommentsList';
import Subtitle from '../components/text/Subtitle';
import ImageViewer from 'react-native-image-zoom-viewer';
import Input from '../components/textInput/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CollectionType } from '../constants/artTypes';
import InfoModal from '../components/infos/InfoModal';

const SingleArt = ({ navigation, route }: any) => {
  const { id } = route.params;
  const context = useContext(MainContext);
  const token = context?.token;

  const [artist, setArtist] = useState<ArtistType | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSold, setSoldState] = useState(false);
  const [isForSale, setSaleState] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [publication, setPublication] = useState<PostType | undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userCollections, setUserCollections] = useState<CollectionType[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const _slidingPanel = useRef<SlidingUpPanel>(null);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState('');

  const [currency, setCurrency] = useState<string>('€');

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
    if (publication && publication.userId) {
      fetchArtistDetails();
    }
  }, [publication]);

  useEffect(() => {
    getPublications();
    checkIsLiked();
    checkIsSaved();
  }, []);

  const fetchArtistDetails = async () => {
    const onErrorCallback = (error: any) => {
      ToastAndroid.show('Could not get artist data. Try again later', ToastAndroid.LONG);
      return console.error('Error getting profile data: ', error);
    };

    if (!publication?.userId) {
      return onErrorCallback('publication.userId is undefined');
    }

    return get(
      `/api/user/profile/${publication?.userId}`,
      context?.token,
      (response) => setArtist(response?.data),
      onErrorCallback,
    );
  };

  const deletePost = () => {
    const callback = () => {
      const msg = 'Post supprimé avec succès !';
      ToastAndroid.show(msg, ToastAndroid.SHORT);
      setIsDeleteModalShown(false);
      return navigation.goBack();
    };

    const onErrorCallback = (err: any) => {
      const errorMsg: string = err?.response?.data?.msg;

      console.error('Delete post ', err?.response?.status, ' : ', errorMsg);
      ToastAndroid.show(errorMsg, ToastAndroid.LONG);
      return setIsDeleteModalShown(false);
    };

    del(`/api/art-publication/${id}`, context?.token, callback, onErrorCallback);
  };

  const getArtistName = (userId: string) => {
    get(
      `/api/user/profile/${userId}`,
      context?.token,
      (response) => {
        setArtist(response.data);
      },
      (error) => {
        console.error('Error fetching Artist Name:', error);
      },
    );
  };

  const fetchPaymentSheetParams = () => {
    console.log('In fetchPaymentSheetParams, sending id:', id);

    const requestData = {
      artPublicationId: id,
    };

    post(
      '/api/order/create',
      requestData,
      context?.token,
      (response: any) => {
        if (response && response.data && response.data.url) {
          const paymentUrl = response.data.url;
          Linking.openURL(paymentUrl).catch((err) => {
            console.error('Failed to open URL:', err);
            Alert.alert('Error', 'Failed to open the payment page.');
          });
        }
      },
      (error: any) => {
        console.error('Error fetching payment sheet parameters:', error);
      },
    );
  };


  const openPaymentSheet = async () => {
    fetchPaymentSheetParams();
  };


  const getPublications = () => {
    setIsRefreshing(true);
    get(
      `/api/art-publication/${id}`,
      context?.token,
      (response) => {
        console.log('🎨 Publications:', response.data);
        setPublication(response?.data || []);
        getArtistName(response?.data.userId);
        setSoldState(response?.data.isSold);
        setSaleState(response?.data.isForSale);
        setIsRefreshing(false);
      },
      (error) => {
        console.error('Error fetching publications:', error);
      },
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

    if (!collectionName) {
      return ToastAndroid.show('Veuillez nommer votre collection', ToastAndroid.SHORT);
    }

    const url = `/api/collection`;
    const body = {
      artPublicationId: id,
      collectionName: collectionName,
      isPublic: true,
    };

    const callback = (response: any) => {
      Alert.alert('Oeuvre ajoutée à la collection "' + collectionName + '".');
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
      checkIsLiked();
    };

    const onPostError = (error: any) => {
      console.error('Erreur de like :', error);
    };

    post(url, body, token, onPost, onPostError);
  };

  const checkIsLiked = async () => {
    if (!token) {
      console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      return Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
    }

    console.log()
    const url = `/api/art-publication/users-who-liked/${id}`;

    const callback = (response: any) => {
      const usersWhoLiked: any[] = response.data?.users;
      const isArtLiked = usersWhoLiked.some((user: any) => user?._id === context?.userId);

      return setIsLiked(isArtLiked);
    };

    const onErrorCallback = (error: any) => {
      console.error('Error fetching like:', { ...error });
      /* Alert.alert('Error', 'Les informations de like n\'ont pas pu être récupérées.'); */
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
        return;
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
    <SafeAreaView style={[bgColor, flex1, ph24, pv4]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      <View style={styles.container}>

      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
        {/* { context?.userId === publication?.userId && (
            <TouchableOpacity
              style={[mtAuto, mbAuto, mlAuto, mr20]}
              onPress={() => setIsDeleteModalShown(true)}
            >
              <MaterialCommunityIcons
                name='delete'
                color={colors.primary}
                size={32}
              />
            </TouchableOpacity>
          ) } */}
      </View>

      <View style={{ flexDirection: 'row',  alignItems: 'center'}}>
        {/* <Text style={styles.artTitle}>{publication?.name}</Text> */}
        {/* <Text style={{fontSize: 23, color: 'black' }}>, {publication?.price} €</Text> */}
        </View>

        <View style={[flexRow, acCenter]}>
          <TouchableOpacity onPress={() => navigation.navigate('other_profile', { id: artist?._id })} style={[bgGrey, { borderRadius: 50, height: 50 }]}>
            <Image source={{ uri: getImageUrl(artist?.profilePicture) }} style={{ height: 50, width: 50, borderRadius: 50 }} />
          </TouchableOpacity>
          <Text style={styles.artTitle}>{publication?.name}</Text>
          <Text style={{ fontSize: 23, color: 'black', marginRight: 5, }}>, {publication?.price} €</Text>
          {context?.userId === publication?.userId && (
            <TouchableOpacity onPress={() => setIsDeleteModalShown(true)}>
              <MaterialCommunityIcons name="delete" color={colors.primary} size={32} />
            </TouchableOpacity>
          )}
        </View>

        {getImageUrl(publication?.image) ? (
          <ImageViewer style={styles.img} backgroundColor={colors.disabledBg} imageUrls={[{ url: getImageUrl(publication?.image) ?? '' }]} renderIndicator={() => <></>} />
        ) : (
          <View style={styles.img} />
        )}
      </View>

      <View style={flex1}>
        <View style={flex1}>
          <View style={[flexRow, mv8]}>
            <TouchableOpacity onPress={likePublication} style={mh8}>
              <AntDesign name={isLiked ? 'heart' : 'hearto'} size={32} color={isLiked ? colors.primary : colors.black} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSavedButtonClick} style={mh8}>
              <Ionicons name={isSaved ? 'checkmark-circle' : 'add-circle-outline'} color={isSaved ? colors.primary : colors.black} size={32} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1, marginBottom:0 }}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={getPublications} tintColor={colors.primary} colors={[colors.primary]} />}
          >
            <Text style={{ fontSize: 15 }}>{publication?.description ?? "L'artiste n'a pas donné de description à son oeuvre"}</Text>
          </ScrollView>

          <ScrollView style={{ flex: 1 }}>
            <CommentsList id={id}></CommentsList>
          </ScrollView>
        </View>
        <CommentInput id={id}></CommentInput>

        <View>
          {isForSale && !isSold && context?.userId !== publication?.userId && (
            <Button
              style={[styles.actionButton, styles.buyButton, { width: '100%' }]}
              textStyle={{ fontSize: 16, textAlign: 'center', color: 'white' }}
              value="Acheter"
              onPress={openPaymentSheet}
            />
          )}
        </View>

        <View style={flexRow}>
          <Button style={[flex1, { marginLeft: 0 }]} textStyle={{ color: colors.black }} value="Retour" onPress={() => navigation.goBack()} secondary />
        </View>
      </View>

      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          <Subtitle style={styles.modalTitle}>Enregistrer dans...</Subtitle>
          <Input style={styles.input} placeholder="Nouvelle collection" onTextChanged={(text: string) => setNewCollectionName(text)} />
          <FlatList
            data={userCollections}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.collectionButton} onPress={() => addToCollection(item.name)}>
                <Text style={styles.collectionButtonText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <Input style={styles.input} placeholder="Nouvelle collection" onTextChanged={(text: string) => setNewCollectionName(text)} />

          <View style={flexRow}>
            <Button value="Annuler" style={styles.collectionBtn} textStyle={{ fontSize: 14 }} onPress={closeModal} secondary />
            <Button value="Créer" onPress={() => addToCollection(newCollectionName)} style={styles.collectionBtn} textStyle={{ fontSize: 14 }} />
          </View>
        </View>
      </Modal>

      {/* Delete sliding panel */}
      <SlidingUpPanel
        ref={_slidingPanel}
        height={200}
        draggableRange={{ top: 200, bottom: 0 }}
        allowDragging={false}
        containerStyle={bgColor}
      >
        <>
          <Text style={{ marginHorizontal: 24, marginTop: 24, color: colors.textDark, fontSize: 16 }}>Voulez-vous vraiment supprimer cette oeuvre ?</Text>

          <View style={flexRow}>
            <Button value="Oui" onPress={deletePost} style={flex1} />
            <Button secondary value="Non" style={flex1} onPress={() => setIsDeleteModalShown(false)} />
          </View>
          <InfoModal
            isVisible={isInfoModalVisible}
            message={infoModalMessage}
            onClose={() => setInfoModalVisible(false)} messageType="success"
          />
        </>
      </SlidingUpPanel>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  collectionBtn: {
    marginHorizontal: 2,
    height: 40,
    marginVertical: 0,
    flex: 1,
  },
  logo: {
    flexDirection: 'row',
    height: 100,
    borderRadius: 5,
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
    marginLeft: 10,
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
    justifyContent: 'center',
    alignSelf: 'center',
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
  priceText: {
    fontSize: 18,
    color: colors.black,
    marginRight: 'auto',
    backgroundColor: colors.disabledBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
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
    backgroundColor: colors.black,
  },
  modal: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Dimensions.get('window').width - 24,
    height: Dimensions.get('window').height - 24,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: colors.textDark,
    fontSize: 18,
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
    backgroundColor: colors.disabledBg,
    marginHorizontal: 4,
    marginVertical: 8,
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
    alignItems: 'center',
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
    marginBottom: 'auto',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  deleteButton: {
    marginLeft: 0, // Ensures the delete button is aligned to the right
  },
  deleteModal: {
    backgroundColor: colors.bg,
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 2,
  },
  soldButton: {
    backgroundColor: colors.disabledBg,
  },
  availableButton: {
    backgroundColor: colors.primary,
  },
  buyButton: {
    backgroundColor: colors.primary,
    width: '100%',
    marginVertical: 10,
  },
});


export default SingleArt;
