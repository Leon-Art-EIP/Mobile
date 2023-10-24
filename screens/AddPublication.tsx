import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
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

const nextPage = () => {
};

const selectTag = () => {
};
// const YourComponent = () => {
//   const [image, setImage] = useState<ImagePickerResponse | null>(null);

//   const handleChoosePhoto = () => {
//     const options = {
//       noData: true,
//     };
//     ImagePicker.launchCamera(options, response => {
//       if (response.uri) {
//         setImage(response);
//         uploadImage(response);
//       }
//     });
//   };
// }

// const uploadImage = async image => {
//   const data = new FormData();
//   data.append('image', {
//     uri: image.uri,
//     type: 'image/jpeg',
//     name: 'image.jpg',
//   });

//   try {
//     const response = await axios.post('YOUR_API_ENDPOINT', data, {
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     console.log('Image uploaded successfully', response.data);
//     // Add any handling of the API response here
//   } catch (error) {
//     console.error('Error uploading image', error);
//     // Handle the error here
//   }
// };


const SingleArt = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <View style={{ flexDirection: 'row', paddingRight: 20, paddingLeft: 20 }}>
        <Text style={styles.artTitle}>Add Publication Page</Text>
      </View>
      {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 200, height: 200, marginBottom: 10 }}
        />
      )}
      <Button title="Take a Photo" onPress={handleChoosePhoto} />
      </View> */}
      <View>
      <TextInput
          placeholder="Titre"
          // onChangeText={handleEmailChange}
          style={styles.textInput}
          />
        <TextInput
          placeholder="Description"
          // onChangeText={handleEmailChange}
          style={styles.textInput}
          />
        <TextInput
          placeholder="Prix"
          // onChangeText={handleEmailChange}
          style={styles.textInput}
          />          
        <TextInput
        placeholder="Genre"
        // onChangeText={handleEmailChange}
        style={styles.textInput}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          value="Ajouter"
          onPress={nextPage}
        />
        <Button
          style={{ backgroundColor: colors.secondary }}
          textStyle={{ color: colors.black }}
          value="Annuler"
          onPress={nextPage}
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


export default SingleArt;
