import { SafeAreaView, StyleSheet, StatusBar, Text, View, TouchableOpacity, Image, Modal, Pressable, Alert } from 'react-native';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';

// Local imports
import Title from '../components/Title';
import colors from '../constants/colors';
import BackArrow from '../assets/images/back_arrow_black.png'
import { MainContext } from '../context/MainContext';
import Button from '../components/Button';
import DeleteButtonImage from '../assets/icons/delete_red.png'
import { get, post, del } from '../constants/fetch';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

const Collection = ({ navigation, route }: any) => {
  const context = useContext(MainContext);
  const token = context?.token;
  const collection = route?.params?.collection;
  const collectionName = collection.name;
  const collectionId = collection._id;
  const artworks = collection.artPublications;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handleDeleteButtonClick = () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirmed = () => {
    try {
      if (token) {
        const url = `/api/collection/${collectionId}`;
        const body = {
          collectionId: collectionId,
        };
        const callback = (response) => {
          console.log('Collection : \"' + collectionName + '\" deleted.');
          navigation.goBack();
          Alert.alert('Collection supprimée', 'collectionName');
        };
        const onErrorCallback = (error) => {
          console.error('Une erreur s\'est produite lors de la supprésion de la collection.:', error);
          Alert.alert('Erreur', 'Une erreur s\'est produite lors de la supprésion de la collection.');
        };
        del(url, token, callback, onErrorCallback);
      } else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token JWT :', error);
      Alert.alert('Erreur lors de la récupération du token JWT', 'Une erreur s\'est produite.');
    }
    // Ferme la modal après la suppression
    setDeleteModalVisible(false);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const handleArtworkClick = (id: string, userId: string) => {
    navigation.navigate('singleart', { id: id, userId: userId });
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, paddingHorizontal: 12, paddingBottom: 80, flex: 1 }}>
      <StatusBar backgroundColor={colors.white} />
      <View style={{ flexDirection: 'row', marginRight: 20 }}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => handleBackButtonClick()}
          style={styles.backButton}
        >
          <Image source={BackArrow} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        {/* Delete button */}
        <TouchableOpacity
          onPress={() => handleDeleteButtonClick()}
          style={styles.deleteButton}
        >
          <Image source={DeleteButtonImage} style={{ width: 28, height: 30 }} />
        </TouchableOpacity>
      </View>


      <Title style={styles.mainTitle}>{collectionName}</Title>

      <View style={styles.squareContainer}>
        {artworks.map((artwork, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.squareFrame, { marginRight: (index + 1) % 3 !== 0 ? 5 : 0 }]}
            onPress={() => handleArtworkClick(artwork._id, "")}
          >
            <Image
              source={{ uri: `${API_URL}api/${artwork.image}` }}
              style={{ flex: 1, borderRadius: 10 }}
              resizeMode="cover"
              onError={(error) => console.log(`Error loading image ${index}:`, error.nativeEvent)}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal pour la confirmation de suppression */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Êtes-vous sûr de vouloir supprimer cette collection ?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => handleCancelDelete()}
              >
                <Text style={{ color: 'white' }}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalDeleteButton]}
                onPress={() => handleDeleteConfirmed()}
              >
                <Text style={{ color: 'white' }}>Supprimer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1
  },
  mainTitle: {
    marginTop: 70,
    marginHorizontal: 12,
    marginVertical: 32,
    fontSize: 25
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    color: colors.tertiary,
  },
  squareFrame: {
    width: 115,
    height: 115,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    margin: 5,
  },  
  squareContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 0,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  // Delete collection modal
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: 'gray',
  },
  modalDeleteButton: {
    backgroundColor: 'red',
  },
});

export default Collection;
