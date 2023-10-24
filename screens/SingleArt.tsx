import React, { useState, useEffect } from 'react';
import { Alert, View, StyleSheet, Text, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import env from '../env';

const nextPage = () => {
};

const selectTag = () => {
};


const SingleArt = () => {
  const { API_URL } = env;
  // const [followTargetID, setfollowTargetID] = useState<string | undefined>(undefined);
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    // Appelez checkIsFollowing lors du chargement de la page
    checkIsLiked();
  }, []);
  const handleLikeButtonClick = async () => {
    //TODO : rendre dynamique
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(`${API_URL}api/art-publication/like/65377fcbbfacccdbe11c44ce`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }
    }
    catch (error) {
      console.error('Erreur de follow :', error);
      Alert.alert('Erreur de follow', 'Une erreur s\'est produite.');
    }
    checkIsLiked();
  };
  const checkIsLiked = async () => {
    try {
      // Récupérez le jeton JWT depuis le stockage local (AsyncStorage ou autre)
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        const response = await axios.get(`${API_URL}api/art-publication/users-who-liked/65377fcbbfacccdbe11c44ce`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = response.data;
        const usersWhoLiked = responseData.users;
  
        // Vérifie si l'utilisateur actuellement connecté est dans la liste des utilisateurs qui ont aimé la publication
        //TODO: rendre dynamique
        const currentUserUsername = "VivantGarrigues"; // Remplacez par le nom d'utilisateur de l'utilisateur connecté
        const isArtLiked = usersWhoLiked.some((user) => user.username === currentUserUsername);
  
        setIsLiked(isArtLiked);
      } else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du suivi :', error);
      Alert.alert('Erreur de suivi', 'Une erreur s\'est produite.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <View style={{ flexDirection: 'row', paddingRight: 20, paddingLeft: 20 }}>
        <TagButton
          value="<"
          onPress={selectTag}
        />
        <Text style={styles.artTitle}>Les voix du Néant</Text>
      </View>
      <View>
        <Image style={styles.img} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 20, paddingLeft: 20 }}>
        <Text style={{ marginLeft: 140, fontSize: 20 }}/>
        {/* <TagButton value="Save" /> */}
        <Button
          value={isLiked ? "Liké" : "Like"}
          secondary= {isLiked ? true : false}
          style={{
            width: 80,
            height: 38,
            borderRadius: 50,
            justifyContent: 'center',
          }}
          textStyle={{fontSize: 14, textAlign: 'center', paddingTop: -100}}
          onPress={() => handleLikeButtonClick()}
          />
        <TagButton
          value="Save"
          />
      </View>
      <View>
      <Text style={{ marginLeft: 20, fontSize: 20 }}>
          200€
        </Text>
      <Text style={{ marginLeft: 20, fontSize: 15 }}>
        Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
      </Text>
      </View>
      <View style={{ marginTop: 20 }}>

        <Button
          value="Acheter"
          onPress={nextPage}
        />
        <Button
          style={{ backgroundColor: colors.secondary }}
          textStyle={{ color: colors.black }}
          value="Retour"
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
    }
});


export default SingleArt;