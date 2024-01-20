import { Alert, TextInput, View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';

import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import { MainContext } from '../context/MainContext';

const AddPublication = ({ navigation }: any) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [artType, setType] = useState('');
  const [description, setDescription] = useState('');
  const [isForSale, setSale] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [dimension, setDimension] = useState('');
  const context = useContext(MainContext);
  
  const publish = () => {
    const parsedPrice = parseFloat(price);
    const isPriceValid = !isNaN(parsedPrice) && parsedPrice >= 0;
    const requestData = {
      image: selectedImage,
      name,
      artType: artType !== '' ? artType : 'empty',
      description: description !== '' ? description : 'empty',
      dimension: dimension !== '' ? dimension : 'empty',
      isForSale: isForSale === 'true',
      price: isPriceValid ? parsedPrice : 0,
      location: location !== '' ? location : 'empty'
    };

      post(
        '/api/art-publication',
        { requestData },
        context?.token,
        () => navigation.navigate('main'),
        (error) => {
          console.error('Error publishing:', error);
        }
      );
      console.log(requestData),
      
      post(
        '/api/art-publication',
        { requestData },
        context?.token,
        () => navigation.navigate('main'),
        (error) => {
          console.error('Error publishing:', error);
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
      style={{ backgroundColor: colors.secondary }}
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
        style={styles.textInput}
      />
      <TextInput
        placeholder="Description"
        onChangeText={handleDescription}
        style={styles.textInput}
        />
      <TextInput
        placeholder="Prix (€)"
        onChangeText={handlePrice}
        style={styles.textInput}
        />
      <TextInput
      placeholder="Genre"
      onChangeText={handleType}
      style={styles.textInput}
      />
    </View>
    <View style={{ marginTop: 20 }}>
      <Button
        value="Ajouter"
        onPress={publish}
        />
      <Button
        style={{ backgroundColor: colors.secondary, marginBottom: 30 }}
        textStyle={{ color: colors.black }}
        value="Annuler"
        onPress={previous}
        />
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
      fontSize: 15,
      marginLeft: 20,
      marginRight: 20,
      backgroundColor: colors.secondary,
      borderRadius: 10,
      marginBottom: 20,
      paddingLeft: 20,
      overlayColor: colors.black,
    },
});


export default AddPublication;
