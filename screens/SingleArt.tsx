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
  bgColor,
  bgGrey,
  bgRed,
  br20,
  br50,
  cTextDark,
  flex1,
  flexRow,
  mbAuto,
  mh8,
  ml4,
  mlAuto,
  mr20,
  mr4,
  mrAuto,
  mt4,
  mtAuto,
  mv0,
  mv8,
  ph24,
  ph8,
  pv4,
} from '../constants/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
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
import Card from '../components/cards/Card';
import { formatName } from '../helpers/NamesHelper';


const NOT_FOUND = "https://qph.cf2.quoracdn.net/main-qimg-1a4bafe2085452fdc55f646e3e31279c-lq";


const SingleArt = ({ navigation, route }: any) => {
  const { id } = route.params;
  const context = useContext(MainContext);
  const token = context?.token;

  const [artist, setArtist] = useState<ArtistType | undefined>(undefined);
  const [answeringTo, setAnsweringTo] = useState<string | undefined>(undefined);
  const [nestedId, setNestedId] = useState<number | undefined>(undefined);
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
  const [isReportPanelVisible, setIsReportPanelVisible] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('€');
  const [picture, setPicture] = useState<string | undefined>(undefined);

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (isDeleteModalShown) {
      setIsReportPanelVisible(false);
      _slidingPanel.current?.show();
    } else {
      _slidingPanel.current?.hide();
    }
  }, [isDeleteModalShown]);

  useEffect(() => {
    if (isReportPanelVisible) {
      setIsDeleteModalShown(false);
    }
  }, [isReportPanelVisible]);

  useEffect(() => {
    getPublication();
    checkIsLiked();
    checkIsSaved();
  }, [id]);

  useEffect(() => {
    if (publication && publication.userId) {
      fetchArtistDetails();
    }
    if (publication) {
      setPicture(publication.image);
      console.log('picture: ', picture);
    }
  }, [publication]);

  useEffect(() => {
    setIsDeleteModalShown(false);
    setIsReportPanelVisible(false);
    getPublication();
    checkIsLiked();
    checkIsSaved();
  }, []);

  useEffect(() => {
    const imageUrl = getImageUrl(publication?.image);
    if (imageUrl) {
      Image.getSize(imageUrl, (width, height) => {
        const screenWidth = Dimensions.get('window').width * 0.90; // 95% of screen width
        const scaleFactor = width / screenWidth;
        const imageHeight = height / scaleFactor;
        setImageSize({ width: screenWidth, height: imageHeight });
      });
    }
  }, [publication]);

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
      (response: any) => {
        setArtist(response.data);
      },
      (error: any) => {
        console.error('Error fetching Artist Name:', error);
      },
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

  const getPublication = () => {
    setIsRefreshing(true);
    get(
      `/api/art-publication/${id}`,
      context?.token,
      (response: any) => {
        setPublication(response?.data);
        getArtistName(response?.data.userId);
        setSoldState(response?.data.isSold);
        setSaleState(response?.data.isForSale);
        return setIsRefreshing(false);
      },
      (error: any) => {
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

    const callback = () => {
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

    const url = `/api/art-publication/users-who-liked/${id}`;

    const callback = (response: any) => {
      const usersWhoLiked: any[] = response.data?.users;
      const isArtLiked = usersWhoLiked.some((user: any) => user?._id === context?.userId);

      return setIsLiked(isArtLiked);
    };

    const onErrorCallback = (error: any) => {
      console.error('Error fetching like:', { ...error });
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

      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>

        { context?.userId === publication?.userId ? (
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
          ) : (
            <TouchableOpacity
              style={[mtAuto, mbAuto, mlAuto, mr20]}
              onPress={() => navigation.navigate('report', { id: publication?._id, type: 'post' })}
            >
              <AntDesign
                name="warning"
                color={colors.black}
                size={24}
              />
            </TouchableOpacity>
          ) }

      </View>

      <View style={[flexRow, acCenter, mv8, mh8]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('other_profile', { id: artist?._id })}
          style={[bgGrey, { borderRadius: 50, height: 30, marginTop: 'auto', marginBottom: 'auto' }]}
        >
          <Image
            source={{ uri: getImageUrl(artist?.profilePicture) ?? NOT_FOUND }}
            style={{ height: 30, width: 30, borderRadius: 50 }}
          />
        </TouchableOpacity>
        <Text style={styles.artTitle}>{ formatName(publication?.name) }</Text>
      </View>

      {/* Post image */}
      { !!getImageUrl(publication?.image) ? (
        <View
          style={{
            width: '95%',
            height: imageSize.height * 0.95,
            maxHeight: 200,
            borderRadius: 20,
            overflow: 'hidden',
            alignSelf: 'center',
            backgroundColor: colors.disabledBg,
            marginTop: 10,
          }}
        >
          <ImageViewer
            backgroundColor="transparent"
            imageUrls={[{ url: getImageUrl(picture) ?? ' ' }]}
            failImageSource={{ url: NOT_FOUND }}
            renderIndicator={() => <></>}
            loadingRender={() => <Text style={cTextDark}>Loading...</Text>}
          />
        </View>
      ) : (
        <View style={styles.img} />
      ) }

      <View style={[pv4]}>
        <View style={[flexRow, bgGrey, br50, pv4, ph8, mh8]}>
          <TouchableOpacity
            onPress={likePublication}
            style={[mh8, mtAuto, mbAuto]}
          >
            <AntDesign
              name={isLiked ? 'heart' : 'hearto'}
              size={24}
              color={isLiked ? colors.primary : colors.black}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSavedButtonClick}
            style={[mh8, mtAuto, mbAuto]}
          >
            <Ionicons
              name={isSaved ? 'checkmark-circle' : 'add-circle-outline'}
              color={isSaved ? colors.primary : colors.black} size={28}
            />
          </TouchableOpacity>

          { publication?.price && (
            <TouchableOpacity
              onPress={openPaymentSheet}
              style={styles.priceSignView}
              disabled={!isForSale || isSold || context?.userId === publication?.userId}
            >
              <Feather
                name="shopping-cart"
                size={18}
                style={[mtAuto, mbAuto, ml4, mr4]}
                color={colors.offerFg}
              />
              <Text style={styles.priceSignText}>{
                publication?.price?.toString() + ' ' + currency
              }</Text>
            </TouchableOpacity>
          ) }
        </View>

        {/* Description */}
        <Card style={[ mh8, mv0, br20, mt4 ]}>
          <Text style={{ fontSize: 13, color: colors.textDark }}>{
            publication?.description ?? "L'artiste n'a pas donné de description à son oeuvre"
          }</Text>
        </Card>
      </View>

      <View style={styles.line} />

      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <CommentsList
          id={id}
          nestedId={nestedId}
          setNestedId={setNestedId}
          setAnsweringTo={setAnsweringTo}
        />
      </ScrollView>
      <CommentInput
        id={id}
        nestedId={nestedId}
        answeringTo={answeringTo}
      />

      {/* Collection modal */}
      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          <Subtitle style={styles.modalTitle}>Enregistrer dans...</Subtitle>

          <FlatList
            contentContainerStyle={[mlAuto, mrAuto]}
            data={userCollections}
            keyExtractor={(item) => item._id}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.collectionButton}
                onPress={() => addToCollection(item.name)}
              >
                <Text style={styles.collectionButtonText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <Input
            style={styles.input}
            placeholder="Nouvelle collection"
            onTextChanged={(text: string) => setNewCollectionName(text)}
          />

          <View style={flexRow}>
            <Button
              value="Annuler"
              style={styles.collectionBtn}
              textStyle={{ fontSize: 14 }}
              onPress={closeModal}
              secondary
            />
            <Button
              value="Créer"
              onPress={() => addToCollection(newCollectionName)}
              style={styles.collectionBtn}
              textStyle={{ fontSize: 14 }}
            />
          </View>
        </View>
      </Modal>

      {/* Delete sliding panel */}
      { context?.userId === artist?._id && (
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
      ) }

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  collectionBtn: {
    marginHorizontal: 2,
    height: 40,
    marginVertical: 0,
    flex: 1,
  },
  line: {
    backgroundColor: colors.disabledFg,
    height: 1,
    marginHorizontal: '20%',
    marginVertical: 4,
    borderRadius: 20
  },
  logo: {
    flexDirection: 'row',
    borderRadius: 5,
  },
  img: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 10,
    width: '95%',
    borderRadius: 20,
  },
  artTitle: {
    marginTop: 'auto',
    marginLeft: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Dimensions.get('window').width - 24,
    /* height: Dimensions.get('window').height - 24, */
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
    borderRadius: 12,
    backgroundColor: colors.offerBg,
    marginBottom: 10,
    marginHorizontal: 2,
    height: 100,
    minWidth: 100,
    alignItems: 'center',
  },
  collectionButtonText: {
    color: colors.offerFg
  },
  input: {
    backgroundColor: colors.disabledBg,
    marginHorizontal: 4,
    marginVertical: 8,
    height: 40
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
  priceSignView: {
    flexDirection: 'row',
    backgroundColor: colors.offerBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
    marginLeft: 'auto',
    marginRight: 8
  },
  priceSignText: {
    color: colors.offerFg,
    marginHorizontal: 4,
    fontWeight: 'bold'
  }
});

export default SingleArt;
