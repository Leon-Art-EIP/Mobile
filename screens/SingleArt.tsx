import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, StyleSheet, Text, Image, Dimensions, ScrollView, ToastAndroid } from 'react-native';
import { post, get } from '../constants/fetch';

import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import { MainContext } from '../context/MainContext';
import { useStripe } from '@stripe/stripe-react-native';
import { Linking } from 'react-native';
import { getImageUrl } from '../helpers/ImageHelper';
import ArtistCard from '../components/ArtistCard';
import { ArtistType } from '../constants/homeValues';
import axios from 'axios';


const SingleArt = ({ navigation, route } : any) => {

  const context = useContext(MainContext);
  const [artist, setArtist] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [publication, setPublication] = useState(false);
  const [author, setAuthor] = useState(false);
  const [artists, setArtists] = useState<ArtistType[]>([]);
  const { id } = route.params;


  useEffect(() => {
    getPublications();
  }, [id]);
  
  useEffect(() => {
    if (publication && publication.userId) {
      fetchArtistDetails();
    }
  }, [publication]);

  const fetchArtistDetails = async () => {
    try {
      const response = await get(`/api/user/profile/${publication.userId}`, context?.token);
      setArtist(response.data);
    } catch (error) {
      console.error("Error fetching artist details:", error);
    }
  };

  const handleToArtistProfile = (artist: ArtistType) => {
    console.log('artist id: ', artist._id);
    navigation.navigate('other_profile', { id: artist._id });
  };

  const getAuthorName = (userId) => {
    get(
      `/api/user/profile/${userId}`,
      context?.token,
      (response) => {
        setAuthor(response.data);
      },
      (error) => {
        console.error("Error fetching Artist Name:", error);
      }
    );
  };


  const fetchPaymentSheetParams = () => {
    console.log('In fetchPaymentSheetParams, sending id:', id);

    const requestData = {
      artPublicationId: id,
    };

    post(
      '/api/order/create',
      requestData,
      context?.token,
      (response) => {
        console.log('Payment Sheet Params:', response);

        if (response && response.data && response.data.url) {
          const paymentUrl = response.data.url;
          Linking.openURL(paymentUrl)
            .catch(err => {
              console.error('Failed to open URL:', err);
              Alert.alert('Error', 'Failed to open the payment page.');
            });
        } else {
          console.error('No URL found in the response');
          Alert.alert('Error', 'Payment URL not found.');
        }
      },
      (error) => {
        console.error('Error fetching payment sheet parameters:', error);
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach(err => {
            console.error(`API error - ${err.param}: ${err.msg}`);
          });
        }
      }
    );
  };


  const openPaymentSheet = async () => {
    fetchPaymentSheetParams();
  };


  const handleArtistButtonClick = async () => {
    navigation.navigate('other_profile');
  }


  const previous = async () => {
    navigation.navigate('homemain');
  }


  const showAlert = (message) => {
    Alert.alert(
      "Art Publication",
      message,
    );
  };


  const getPublications = () => {
    console.log(route.params?.id);
    if (!route.params?.id) {
      ToastAndroid.show("Une erreur est survenue. Veuillez réessayer plus tard", ToastAndroid.LONG);
      return navigation.goBack();
    }

    get(
      `/api/art-publication/${id}`,
      context?.token,
      (response) => {
        console.log('🎨 Publications:', response.data)
        setPublication(response?.data || []);
        getAuthorName(response?.data.userId);
      },
      (error) => {
        console.error("Error fetching publications:", error);
      }
      );
    };
    
    const savePublication = () => {};

    const likePublication = async () => {
      try {
        const updatedLikeStatus = !isLiked;
        
        const response = await axios.post(`/api/art-publication/like/${id}`, {
          isLiked: updatedLikeStatus
        }, {
          headers: {
            Authorization: `Bearer ${context?.token}`,
          },
        });
    
        if (response.status === 200) {
          setIsLiked(response.data.isLiked);
          console.log("Like status updated successfully");
          showAlert(response.data.isLiked ? 'Liked' : 'Unliked');
        } else {
          console.error("Failed to update like status");
          showAlert('Failed to update like status');
        }
      } catch (error) {
        console.error("Error in liking publication:", error);
        console.error(error.response || error)
      }
    } catch (error) {
      console.error("Error in liking publication:", error);
      console.error(error.response || error)
    }
  };


  return (
    <ScrollView>
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
        source={{ uri: getImageUrl(publication.image) }}
        onError={() => console.log("Image loading error")}
      />
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 20, paddingLeft: 20 }}>
      <TagButton
        onPress={handleArtistButtonClick}
      />
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
        onPress={() => savePublication()}
      />
      <Button
        value={isLiked ? "Liked" : "Like"}
        secondary={isLiked ? true : false}
        style={styles.button}
        textStyle={{fontSize: 14, textAlign: 'center'}}
        onPress={likePublication}
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
        onPress={openPaymentSheet}
        />
      <Button
        style={{ backgroundColor: colors.secondary }}
        textStyle={{ color: colors.black }}
        value="Retour"
        onPress={previous}
        />
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.white,
    },
    logo: {
        flexDirection: 'row',
        height: 100,
        paddingLeft: 20,
        padding: 20,
        borderRadius: 5,
    },
    artistCardStyle: {
      borderRadius: 30,
      container: { width: 45, height: 45, borderRadius: 30, marginTop: 0, color: 'white'},
      image: { width: 45, height: 45, borderRadius: 30, marginTop: 25 },
    },
    img: {
      backgroundColor: colors.disabledBg,
      alignSelf: 'center',
      resizeMode: 'contain',
      marginLeft: 15,
      marginRight: 15,
      marginTop: 20,
      height: 330,
      width: 330,
      borderRadius: 5,
    },
    artTitle: {
      alignSelf: 'center',
      marginTop: 15,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 25,
      color: '#000',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      justifyContent: 'space-between',
    },
    actionButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 30,
      justifyContent: 'center',
      marginLeft: 'auto',
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
    buttonText: {
      fontSize: 14,
      textAlign: 'center',
      color: colors.black,
    },
    userIdText: {
      marginLeft: 6,
      fontSize: 15,
      flex: 1,
      color: 'black',
    },
    saveButton: {
      backgroundColor: colors.secondary,
      width: 75,
      height: 38,
      borderRadius: 30,
      justifyContent: 'center',
      flex: 1,
    },
    likeButton: {
      color: 'white',
      flex: 1,
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
        backgroundColor: '#F4F4F4'
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
    button:
    {
      width: 70,
      height: 38,
      borderRadius: 30,
      marginLeft: 0,
      justifyContent: 'center',
      backgroundColor: colors.black
    }
});


export default SingleArt;
