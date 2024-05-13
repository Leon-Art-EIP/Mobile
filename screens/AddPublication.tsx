import { TextInput, View, StyleSheet, Text, Image, ScrollView, ToastAndroid } from 'react-native';
import React, { useContext, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';

import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import { MainContext } from '../context/MainContext';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgColor, bgPlatinium, flex1, mv24, mv8 } from '../constants/styles';
import Input from '../components/Input';


const AddPublication = ({ navigation } : any) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [artType, setType] = useState('');
  const [description, setDescription] = useState('');
  const [isForSale, setSale] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [dimension, setDimension] = useState('');
  const context = useContext(MainContext);

  const publish = async () => {
    const parsedPrice = parseFloat(price);
    const isPriceValid = !isNaN(parsedPrice) && parsedPrice >= 0;
    const formData = new FormData();

    formData.append('name', name);
    formData.append('artType', artType !== '' ? artType : 'empty');
    formData.append('description', description !== '' ? description : 'empty');
    formData.append('dimension', dimension !== '' ? dimension : 'empty');
    formData.append('isForSale', isForSale === 'true');
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
      () => {
        ToastAndroid.show("Nouveau post créé avec succès !", ToastAndroid.SHORT);
        return navigation.navigate('profile')
      },
      (error) => console.error('Error publishing:', error)
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

  const previous = () => {
    navigation.navigate('homemain');
  };

return (
  <SafeAreaView style={[ flex1, bgColor ]}>

    {/* Title */}
    <View style={styles.logo}>
      <Title style={{ color: colors.primary }}>Leon</Title>
      <Title>'Art</Title>
    </View>

    {/* Actual Screen */}
    <ScrollView style={styles.container}>
      <Text style={styles.artTitle}>Nouveau post</Text>


      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.img} />
      )}

      <Button
        style={[ bgPlatinium, mv24 ]}
        textStyle={{ color: colors.black, fontSize: 16 }}
        value={!!selectImage ? "Modifier l'image" : "Ajouter une image"}
        onPress={selectImage}
      />

      {/* Form */}
      <View>
        <Input
          placeholder="Titre"
          onTextChanged={handleName}
          value={name}
          style={styles.textInput}
        />
        <Input
          placeholder="Description"
          onTextChanged={handleDescription}
          value={description}
          style={styles.textInput}
        />
        <Input
          placeholder="Prix (€)"
          onTextChanged={handlePrice}
          value={price}
          style={styles.textInput}
        />
        <Input
          placeholder="Genre"
          onTextChanged={handleType}
          value={artType}
          style={styles.textInput}
        />
      </View>

      {/* Submit button */}
      <Button
        value="Ajouter"
        onPress={publish}
      />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
      paddingHorizontal: 16,
      backgroundColor: colors.white,
    },
    logo: {
      flexDirection: 'row',
      paddingHorizontal: 36,
      paddingVertical: 12
    },
    img: {
      marginTop: 12,
      marginHorizontal: 16,
      height: 300,
      borderRadius: 20,
      backgroundColor: colors.placeholder,
    },
    artTitle: {
      fontWeight: 'bold',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 0,
      fontSize: 30,
      color: colors.black,
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
    textInput: {
      color: colors.black,
      fontSize: 15,
      /* marginLeft: 20, */
      /* marginRight: 20, */
      backgroundColor: colors.secondary,
      marginBottom: 20,
      paddingLeft: 20,
      overlayColor: colors.black,
    },
});


export default AddPublication;
