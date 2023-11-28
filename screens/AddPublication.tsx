import React, { useState } from 'react';
import { Alert, TextInput, View, StyleSheet, Text, Image } from 'react-native';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import env from '../env';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg';


const addPublication = ({ navigation }: any) => {

    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [artType, setType] = useState('');
    const [description, setDescription] = useState('');
    const [isForSale, setSale] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    
    const publish = () => {
      const { API_URL } = env;
      const requestData = {
        image,
        name,
        artType,
        description,
        isForSale,
        price,
        location
      };

      post(
          '/api/art-publication',
          { requestData },
          () => navigation.navigate('main'),
          () => {
      console.log('requestData', requestData)
          }
        )
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
  
  const selectImage = () => {
  };

  const previous = () => {
    navigation.navigate('homemain');      
  }

return (
  <View style={styles.container}>
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
        placeholder="Prix"
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
        style={{ backgroundColor: colors.secondary }}
        textStyle={{ color: colors.black }}
        value="Annuler"
        onPress={previous}
        />
      </View>
    </View>
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
        textAlign: 'center',
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
      marginLeft: 15,
      marginRight: 15,
      backgroundColor: colors.secondary,
      borderRadius: 7,
      marginBottom: 20,
    },
});


export default addPublication;
