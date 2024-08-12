import React, { useEffect, useState, useContext } from 'react';
import { Alert, TextInput, View, StyleSheet, Text, Image, ScrollView, Linking, TouchableOpacity, Platform, StatusBar, ToastAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ArtTypeFilter, artTypeFilters } from '../constants/artTypes';  // Importer les filtres
import Entypo from 'react-native-vector-icons/Entypo';  // Pour les icônes des filtres

import { post, get } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import { MainContext } from '../context/MainContext';
import RNFS from 'react-native-fs';
import InfoModal from '../components/infos/InfoModal';
import { bgColor, bgGrey, br0, br20, cPrimary, cTextDark, flex1, flexRow, jcSA, mb24, mbAuto, mh0, mh24, mh4, mtAuto, mv24, mv8, ph24, ph4, ph8, pv24, pv8 } from '../constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/textInput/Input';
import Card from '../components/cards/Card';


const AddPublication = ({ navigation }: any) => {
  const [tab, setTab] = useState<'art' | 'text'>('art');
  const [postText, setPostText] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [artType, setType] = useState('');
  const [description, setDescription] = useState('');
  const [isForSale, setSale] = useState(false);
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [dimension, setDimension] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [modalType, setModalType] = useState('error');
  const context = useContext(MainContext);

  // Etats pour les filtres de genres
  const [filters, setFilters] = useState<ArtTypeFilter[]>(artTypeFilters);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isArtTypeDisplayed, setIsArtTypeDisplayed] = useState<boolean>(false);
  const [selectedSubFilters, setSelectedSubFilters] = useState<string[]>([]);


  // Adjust function to handle sub-filters
  const selectOrDeselect = (filterName: string, isSubFilter: boolean = false) => {
    let newFilterArray: string[] = [];
    let array = isSubFilter ? selectedSubFilters : selectedFilters;

    if (array.includes(filterName)) {
      newFilterArray = array.filter(f => f !== filterName);
      if (!isSubFilter) {
        handleType('');
      }
    } else {
      newFilterArray = [...array, filterName];
      if (!isSubFilter) {
        handleType(filterName);
      }
    }

    isSubFilter ? setSelectedSubFilters(newFilterArray) : setSelectedFilters(newFilterArray);
  };


  const checkAccountLinkStatus = () => {
    get(
      `/api/stripe/account-link-status`,
      context?.token,
      (response) => {
        if (response && response.data && response.data.linked !== undefined) {
          console.log("LINKED STATUS", response.data.linked);
          setIsAccountLinked(response.data.linked);
        } else {
          console.error('Invalid response format:', response.data);
        }
      },
      (error) => {
        console.error('Error checking account link status:', error);
      }
    );
  };


  const publish = async () => {
    if (!name /*|| !artType*/ || !description || !price || !selectedImage) {
      setModalMessage("Assurez-vous d'avoir renseigné tous les champs avant de publier votre œuvre.");
      setModalVisible(true);
      return;
    }

    const parsedPrice = parseFloat(price);
    const isPriceValid = !isNaN(parsedPrice) && parsedPrice >= 0;
    const formData = new FormData();

    formData.append('name', name);
    formData.append('artType', artType !== '' ? artType : 'empty');
    formData.append('description', description !== '' ? description : 'empty');
    formData.append('dimension', dimension !== '' ? dimension : 'empty');
    formData.append('isForSale', false);
    formData.append('price', isPriceValid ? parsedPrice : 0);
    formData.append('location', location !== '' ? location : 'empty');

    if (selectedImage) {
      try {
        const fileData = await RNFS.readFile(selectedImage, 'base64');
        formData.append('image', {
          name: 'image.jpg',
          type: 'image/jpeg',
          uri: Platform.OS === 'android' ? `file://${selectedImage}` : selectedImage,
          data: fileData
        });
      } catch (error) {
        console.error('Error preparing image:', error);
        return;
      }
    }

    post(
      '/api/art-publication',
      formData,
      context?.token,
      () => navigation.navigate('main'),
      (error) => {
        console.error('Error publishing:', error);
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach((err: any) => {
            console.error(`Validation error - ${err.param}: ${err.msg}`);
          });
        }
      }
    );

    setModalType('success');
    setModalMessage("Votre œuvre a bien été publiée.");
    setModalVisible(true);
    navigation.navigate('homemain');
  };


  const linkStripeAccount = () => {
    post(
      '/api/stripe/account-link',
      undefined,
      context?.token,
      (response) => {
        if (response && response.data && response.data.url) {
          const url = response.data.url;
          Linking.openURL(url)
            .then(() => console.log('Link opened successfully'))
            .catch((err) => console.error('Error opening link:', err));
        } else {
          console.error('Error: Unable to retrieve URL');
        }
      },
      (error) => {
        console.error('Error linking Stripe account:', error);
      }
    );
  };


  const selectImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 1,
      };

      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setSelectedImage(source.uri);
      }
    } catch (error) {
      console.error('An error occurred while picking the image:', error);
    }
  };


  const handleName = (value: string) => {
    setName(value);
  };


  const handleDescription = (value: string) => {
    setDescription(value);
  };


  const handlePrice = (value: string) => {
    setPrice(value);
  };


  const handleType = (value: string) => {
    setType(value);
  };


  const sendText = () => {
    return post(
      `/api/posts`,
      { text: postText, artPublicationId: undefined },
      context?.token,
      () => {
        navigation.navigate('Home');
        ToastAndroid.show("Post envoyé !", ToastAndroid.SHORT);
      },
      (err: any) => console.error({ ...err })
    );
  }


  const sellWithAccount = async () => {
    if (!name || !artType || !description || !price || !selectedImage) {
      setModalMessage("Assurez-vous d'avoir renseigner tous les champs avant de publier votre œuvre.");
      setModalType('error');
      setModalVisible(true);
      return;
    }
    if (!isAccountLinked) {
      setModalMessage("Votre compte Stripe n'est pas encore relié à l'application ! Pour ce faire, rendez-vous dans vos paramètres et mettez votre œuvre à la vente ensuite. ");
      setModalType('error');
      setModalVisible(true);
      return;
    }

    const isForSale = true;

    if (isAccountLinked) {
      const parsedPrice = parseFloat(price);
      const isPriceValid = !isNaN(parsedPrice) && parsedPrice >= 0;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('artType', artType !== '' ? artType : 'empty');
      formData.append('description', description !== '' ? description : 'empty');
      formData.append('dimension', dimension !== '' ? dimension : 'empty');
      formData.append('isForSale', isForSale);
      formData.append('price', isPriceValid ? parsedPrice : 0);
      formData.append('location', location !== '' ? location : 'empty');

      if (selectedImage) {
        try {
          const fileData = await RNFS.readFile(selectedImage, 'base64');
          formData.append('image', {
            name: 'image.jpg',
            type: 'image/jpeg',
            uri: Platform.OS === 'android' ? `file://${selectedImage}` : selectedImage,
            data: fileData
          });
        } catch (error) {
          console.error('Error preparing image:', error);
          return;
        }
      }

      post(
        '/api/art-publication',
        formData,
        context?.token,
        () => navigation.navigate('main'),
        (error) => {
          console.error('Error publishing:', error);
          if (error.response && error.response.data && error.response.data.errors) {
            error.response.data.errors.forEach((err: any) => {
              console.error(`Validation error - ${err.param}: ${err.msg}`);
            });
          }
        }
      );
      setModalMessage("Votre œuvre a bien été publiée.");
      setModalType('success');
      setModalVisible(true);
      navigation.navigate('homemain');
    }
    else {
      Alert.alert('Account Not Linked', 'Please link your Stripe account before selling.');
    }
  };


  useEffect(() => {
    checkAccountLinkStatus();
  }, []);


  return (
    <SafeAreaView style={[flex1, bgColor]}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.bg} />

      <View style={[ flexRow, ph24, mv24 ]}>
        <Title style={styles.artTitle}>Nouvelle publication</Title>
      </View>

      {/* Tabs */}
      <View style={[flexRow, jcSA, pv8, mh24, ph4 ]}>

        <TouchableOpacity
          onPress={() => setTab('art')}
          disabled={tab === 'art'}
          style={[flex1, pv8, ph24, mh4, br20, {
            backgroundColor: tab === 'art' ? colors.darkGreyBg : colors.disabledBg
          }]}
        >
          <Text
            style={{
              color: tab === 'art' ? colors.white : colors.darkGreyFg,
              textAlign: 'center'
            }}
          >Art</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTab('text')}
          disabled={tab === 'text'}
          style={[flex1, pv8, ph24, mh4, br20, {
            backgroundColor: tab === 'text' ? colors.darkGreyBg : colors.disabledBg
          }]}
        >
          <Text
            style={{
              color: tab === 'text' ? colors.white : colors.darkGreyFg,
              textAlign: 'center'
            }}
          >Post</Text>
        </TouchableOpacity>

      </View>

      { tab === 'art' ? (
        <ScrollView style={styles.container}>

          { selectedImage ? (
            <TouchableOpacity onPress={selectImage}>
              <Image source={{ uri: selectedImage }} style={styles.img} />
            </TouchableOpacity>
          ) : (
            <Button
              style={{ backgroundColor: colors.whitesmoke }}
              textStyle={{ color: colors.darkGreyBg }}
              value={ selectedImage ? "Modifier l'image" : "Choisir une image"}
              onPress={selectImage}
            />
          ) }

          <View>

            {/* Title */}
            <Input
              placeholder="Titre"
              placeholderTextColor={colors.disabledFg}
              onTextChanged={handleName}
              value={name}
              style={[ flex1, bgGrey ]}
            />

            {/* Description */}
            <Input
              placeholder="Description"
              placeholderTextColor={colors.disabledFg}
              onTextChanged={handleDescription}
              multilines={10}   // can go to 10 lines maximum
              value={description}
              style={[ flex1, mv8, bgGrey, br20, { textAlignVertical: 'top' } ]}
            />

            {/* Price */}
            <Input
              placeholder="Prix (€)"
              placeholderTextColor={colors.disabledFg}
              onTextChanged={handlePrice}
              value={price}
              style={[ flex1, bgGrey ]}
            />

            <Card style={[ { paddingHorizontal: 12 }, pv8, { marginHorizontal: 16 }, br20 ]}>
              <TouchableOpacity
                style={[ flexRow, ph8 ]}
                onPress={() => setIsArtTypeDisplayed(e => !e)}
              >
                <Text style={[ flex1, selectedFilters.length !== 0 ? cPrimary : cTextDark ]}>
                  Genre
                </Text>
                <Entypo
                  style={[ mtAuto, mbAuto ]}
                  name={isArtTypeDisplayed ? "chevron-thin-down" : "chevron-thin-right"}
                  size={18}
                  color={selectedFilters.length !== 0 ? colors.primary : colors.black}
                />
              </TouchableOpacity>
            </Card>

            { isArtTypeDisplayed && filters.map((filter: ArtTypeFilter) => (
              <View key={filter.category.toString()}>
                <TouchableOpacity
                  style={styles.filterTouchableOpacity}
                  onPress={() => selectOrDeselect(filter.category)}
                >
                  <Text style={{ color: selectedFilters.includes(filter.category) ? colors.primary : colors.black }}>
                    {filter.category}
                  </Text>
                </TouchableOpacity>

                {/* Display sub-filters if main filter is selected */}
                { selectedFilters.includes(filter.category) && filter.types.map(subFilter => (
                  <TouchableOpacity
                    key={subFilter}
                    style={[styles.subFilterTouchableOpacity, { marginLeft: 20 }]}
                    onPress={() => selectOrDeselect(subFilter, true)}
                  >
                    <Text style={{ color: selectedSubFilters.includes(subFilter) ? colors.primary : colors.black }}>
                      {subFilter}
                    </Text>
                  </TouchableOpacity>
                )) }

              </View>
            )) }

            <Button
              value="Publier et mettre à la vente"
              onPress={sellWithAccount}
              style={styles.saleButton}
            />
          </View>

          <View style={mtAuto}>
            <Button
              value="Publier sans possibilité d'achat"
              onPress={publish}
              style={styles.nosaleButton}
            />

            <InfoModal
              isVisible={isModalVisible}
              message={modalMessage}
              onClose={() => setModalVisible(false)}
              messageType="error"
            />
          </View>
        </ScrollView>

      ) : (

        <View style={[ flex1, ph8, pv24 ]}>
          <Card style={[ flex1, mb24, ph24 ]}>
            <TextInput
              onChangeText={setPostText}
              placeholder='Laissez libre court à vos pensées'
              multiline
              numberOfLines={10}
              style={[ cTextDark, flex1, bgGrey, br0, mh0, { textAlignVertical: 'top' } ]}
              placeholderTextColor={colors.disabledFg}
            />
          </Card>

          <Button
            onPress={sendText}
            value="Poster"
            style={[ mh24, mtAuto ]}
          />
        </View>

      ) }
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.bg,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.bg,
  },
  logo: {
    flexDirection: 'row',
    height: 100,
    paddingLeft: 20,
    padding: 20,
    borderRadius: 5,
  },
  img: {
    marginHorizontal: 16,
    marginVertical: 12,
    height: 300,
    borderRadius: 20,
    backgroundColor: colors.placeholder,
  },
  artTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    color: colors.black
  },
  textInput: {
    color: colors.textDark,
    fontSize: 15,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 20,
    overlayColor: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinium,
  },
  saleButton: {
    backgroundColor: colors.primary,
    marginBottom: 0,
    marginTop: 30,
  },
  nosaleButton: {
    backgroundColor: colors.darkGreyBg,
    marginBottom: 40,
  },
  filterTouchableOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginTop: 20,
  },
  filterText: {
    color: colors.black,
    flex: 1,
    fontSize: 18,
  },
  subFilterTouchableOpacity: {
    paddingLeft: 30,
    marginLeft: 50,
    marginTop: 10,
  }
});


export default AddPublication;
