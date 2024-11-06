import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Platform, ToastAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import { MainContext } from '../context/MainContext';
import RNFS from 'react-native-fs';
import Input from '../components/textInput/Input';
import Card from '../components/cards/Card';
import { Alert } from 'react-native';

const AddPublication = ({ navigation }) => {
  const [tab, setTab] = useState('art');
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [dimension, setDimension] = useState('');
  const [selectedFilters, setSelectedFilters] = useState(undefined);
  const [selectedSubFilters, setSelectedSubFilters] = useState(undefined);
  const context = useContext(MainContext);

  // Reset state variables when the component unmounts
  useEffect(() => {
    // This cleanup function resets all 'remplissage' fields when the screen is left
    return () => {
      setTab('art');
      setPostText('');
      setSelectedImage(null);
      setName('');
      setDescription('');
      setPrice('');
      setLocation('');
      setDimension('');
      setSelectedFilters(undefined);
      setSelectedSubFilters(undefined);
    };
  }, []);

  // Function to select an image from the library
  const selectImage = async () => {
    try {
      const options = { mediaType: 'photo', quality: 1 };
      const response = await launchImageLibrary(options);
      if (!response.didCancel) {
        setSelectedImage(response.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const publish = async () => {
    if (!name || !description || !selectedImage) {
      Alert.alert("Informations incomplètes", "Tous les champs doivent être remplis pour pouvoir publier votre œuvre.");
      return;
    }

    const parsedPrice = parseFloat(price);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', isNaN(parsedPrice) ? 0 : parsedPrice);
    formData.append('location', location);
    formData.append('dimension', dimension);

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
        ToastAndroid.show("Publication successful!", ToastAndroid.SHORT);
        navigation.navigate('profile');
      },
      (error) => {
        console.error('Error publishing:', error);
      }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Title>Nouvelle publication</Title>

      {/* Image Selection */}
      <TouchableOpacity onPress={selectImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.img} />
        ) : (
          <Button
            style={{ backgroundColor: colors.whitesmoke }}
            textStyle={{ color: colors.darkGreyBg }}
            value="Choisir une image"
            onPress={selectImage}
          />
        )}
      </TouchableOpacity>

      {/* Text Inputs */}
      <Input
        placeholder="Titre"
        placeholderTextColor={colors.disabledFg}
        onTextChanged={(value) => setName(value)}
        value={name}
      />
      <Input
        placeholder="Description"
        placeholderTextColor={colors.disabledFg}
        onTextChanged={(value) => setDescription(value)}
        value={description}
      />
      <Input
        placeholder="Prix (€)"
        placeholderTextColor={colors.disabledFg}
        onTextChanged={(value) => setPrice(value)}
        value={price}
      />
      <Input
        placeholder="Localisation"
        placeholderTextColor={colors.disabledFg}
        onTextChanged={(value) => setLocation(value)}
        value={location}
      />
      <Input
        placeholder="Dimensions"
        placeholderTextColor={colors.disabledFg}
        onTextChanged={(value) => setDimension(value)}
        value={dimension}
      />

      {/* Publish Button */}
      <Button
        value="Publier"
        onPress={publish}
        secondary
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.bg },
  img: {
    height: 300,
    borderRadius: 20,
    backgroundColor: colors.placeholder,
    marginVertical: 12,
  },
});

export default AddPublication;