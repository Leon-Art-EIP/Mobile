import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, StyleSheet, Text, Image, Dimensions } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { post, get } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainContext } from '../context/MainContext';

import axios from 'axios';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const SingleArt = ({ navigation, route }: any) => {

  const context = useContext(MainContext);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [publication, setPublication] = useState(false);
  const { id } = route.params;

    useEffect(() => {
    getPublications();
  }, [id]);

  
  
  const handleArtistButtonClick = async () => {
    navigation.navigate('other_profile');
    
  }
  
  const previous = async () => {
    navigation.navigate('homemain');
  }
  
  const getPublications = () => {
    get(
      `/api/art-publication/${id}`,
      context?.token,
      (response) => {
        console.log('🎨 Publications:', response.data)
        setPublication(response?.data || []);
      },
      (error) => {
        console.error("Error fetching publications:", error);
      }
      );
      console.log('LOG');
    };
    
    const likePublication = async () => {
      try {
        const newLikeStatus = !isLiked;
        setIsLiked(newLikeStatus); // Update local state
  
        // Send request to backend
        const response = await axios.post(`/api/art-publication/like/${id}`, {
          isLiked: newLikeStatus
        }, {
          headers: {
            Authorization: `Bearer ${context?.token}`, // Replace with your auth token
          },
        });
  
        if (response.status === 200) {
          // Handle successful response
          console.log("Like status updated successfully");
        } else {
          // Handle non-successful responses
          console.error("Failed to update like status");
        }
      } catch (error) {
        console.error("Error in handleLikeButtonClick:", error);
        setIsLiked(!newLikeStatus); // Revert state on error
      }
    };

    const nextPage = () => {
      navigation.navigate('stripe');
    };
    
    const selectTag = () => {
    };

    return (
      <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <Text style={styles.artTitle}>{publication.name}</Text>
      </View>
      <View>
        <Image 
          style={styles.img}
          source={require('../android/android_asset/mystic_odyssey.png')}
          // source={{ uri: publication.image }}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 20, paddingLeft: 20 }}>
        <TagButton
          onPress={handleArtistButtonClick}/>
        <Text style={{ marginLeft: 90, fontSize: 10 }}/>
        <Button
          value={isSaved ? "Saved" : "Save"}
          secondary= {isSaved ? true : false}
          style={{
            backgroundColor: colors.secondary,
            width: 75,
            height: 38,
            borderRadius: 30,
            marginLeft: 55,
            justifyContent: 'center',
          }}
          textStyle={{fontSize: 14, textAlign: 'center', color: colors.black}}
          // onPress={() => handleSavedButtonClick()}
          />
        <Button
          value={isLiked ? "Liké" : "Like"}
          secondary= {isLiked ? true : false}
          style={{
            width: 70,
            height: 38,
            borderRadius: 30,
            marginLeft: 0,
            justifyContent: 'center',
            backgroundColor: colors.artistPlHolder,
          }}
          textStyle={{fontSize: 14, textAlign: 'center', paddingTop: -100}}
          // onPress={() => handleLikeButtonClick()}
          />
      </View>
      <View>
      <Text style={{ marginLeft: 20, fontSize: 20 }}>
        {publication.price} €
       </Text>
      <Text style={{ marginLeft: 20, fontSize: 15 }}>
        {publication.description}
      </Text>
      </View>
      <View style={{ marginTop: 20, marginBottom: 30 }}>

        <Button
          value="Acheter"
          onPress={nextPage}
        />
        <Button
          style={{ backgroundColor: colors.secondary }}
          textStyle={{ color: colors.black }}
          value="Retour"
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
      width: screenWidth - 30 - (2 * 16),
      resizeMode: 'contain',
      marginLeft: 15,
      marginRight: 15,
      marginTop: 20,
      height: 300,
      borderRadius: 5,
    },
    artTitle: {
      marginTop: 15,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 25,
      color: '#000',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    }
});


export default SingleArt;
