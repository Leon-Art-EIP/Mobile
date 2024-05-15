import { useEffect, useState, useContext } from 'react';
import { Alert, TextInput, View, StyleSheet, Text, Image, ScrollView, Linking } from 'react-native';
// import React, { useContext, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';

import { getImageUrl } from '../helpers/ImageHelper';
import { post, get } from '../constants/fetch'; // Import the get function
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import { MainContext } from '../context/MainContext';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const AddPublication = ({ navigation }: any) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [artType, setType] = useState('');
  const [description, setDescription] = useState('');
  const [isForSale, setSale] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [dimension, setDimension] = useState('');
  const [isAccountLinked, setIsAccountLinked] = useState(false); // State to store whether the Stripe account is linked
  const context = useContext(MainContext);

  useEffect(() => {
    checkAccountLinkStatus();
  }, []);

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
          error.response.data.errors.forEach(err => {
            console.error(`Validation error - ${err.param}: ${err.msg}`);
          });
        }
      }
    );
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
  }
  const handleDescription = (value: string) => {
    setDescription(value);
  };
  const handlePrice = (value: string) => {
    setPrice(value);
  };

  const handleType = (value: string) => {
    setType(value);
  };

  const previous = () => {
    navigation.navigate('homemain');      
  }

  const sellWithAccount = async () => {
    const isForSale = true;
  
    if (isAccountLinked) {
      const parsedPrice = parseFloat(price);
      const isPriceValid = !isNaN(parsedPrice) && parsedPrice >= 0;
  
      const formData = new FormData();
      formData.append('name', name);
      formData.append('artType', artType !== '' ? artType : 'empty');
      formData.append('description', description !== '' ? description : 'empty');
      formData.append('dimension', dimension !== '' ? dimension : 'empty');
      formData.append('isForSale', isForSale); // Set isForSale to true
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
            error.response.data.errors.forEach(err => {
              console.error(`Validation error - ${err.param}: ${err.msg}`);
            });
          }
        }
      );
    } else {
      Alert.alert('Account Not Linked', 'Please link your Stripe account before selling.');
    }
  };
  
  
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <View style={{ flexDirection: 'row', paddingRight: 20, paddingLeft: 20 }}>
        <Text style={styles.artTitle}>Add Publication</Text>
      </View>
      <Button
        style={{ backgroundColor: colors.platinium }}
        textStyle={{ color: colors.black }}
        value="+"
        onPress={selectImage}
      />
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.img} />
      )}
      <View>
        <TextInput
          placeholder="Titre"
          onChangeText={handleName}
          value={name}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Description"
          onChangeText={handleDescription}
          value={description}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Prix (€)"
          onChangeText={handlePrice}
          value={price}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Genre"
          onChangeText={handleType}
          value={artType}
          style={styles.textInput}
        />
      <Button
        value="Publier et mettre à la vente"
        onPress={sellWithAccount}
        disabled={!isAccountLinked} // Disable button if account is not linked
        style={styles.textButton}
      />
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          value="Publier sans possibilité d'achat"
          onPress={publish}
        />
        <Button
          style={{ backgroundColor: colors.secondary, marginBottom: 30 }}
          textStyle={{ color: colors.black }}
          value="Annuler"
          onPress={previous}
        />
        {/* <InfoModal 
          isVisible={isModalVisible}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
          messageType="error"
        /> */}
      </View>
    </ScrollView>
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
    borderRadius: 4.5,
    backgroundColor: colors.placeholder,
  },
  artTitle: {
    marginTop: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    fontSize: 30,
    color: '#000',
  },
  textInput: {
    fontSize: 15,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 20,
    overlayColor: colors.black,
  },
  textButton: {
    color: colors.black,
    backgroundColor: colors.darkGreyBg,
  },
});

export default AddPublication;