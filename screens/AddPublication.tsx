import React, { useState } from 'react';
import { Alert, TextInput, View, StyleSheet, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg';

import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import env from '../env';



const addPublication = ({ navigation }: any) => {

    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [artType, setType] = useState('');
    const [description, setDescription] = useState('');
    const [dimension, setDimension] = useState('');
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
        dimension,
        isForSale,
        price,
        location
      };
      // ** If this POST method doesn't work ** 
      // === > Use the ProiflingQuizz POST method temporarely

      axios.post(`${API_URL}/api/art-publication`, requestData)
        .then(async response => {
          console.log('RequestData: ', requestData);
          if (response) {
            console.log('server response:', response);
            Alert.alert('Publication done !');
          }
        })
        .catch(error => {
          if (error.response) {
            console.error('Server error:', error.response.data);
          }
          console.error('Error config:', error.config);
          //Alert.alert('Publication Error');
        });
         navigation.navigate('main');
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
    // Add Image
  };

  const previous = () => {
    // Please try the following code :
    // navigation.navigate('main');      
  }

return (
  <View style={styles.container}>
    <View style={styles.logo}>
      <Title style={{ color: colors.primary }}>Leon</Title>
      <Title>'Art</Title>
    </View>
    <View style={{ flexDirection: 'row', paddingRight: 20, paddingLeft: 20 }}>
      <Text style={styles.artTitle}>Add Publication Page</Text>
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
