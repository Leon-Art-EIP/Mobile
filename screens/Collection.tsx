import { SafeAreaView, StyleSheet, StatusBar, Text, View, TouchableOpacity, Image, Modal, Pressable, Alert, FlatList } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';

// Local imports
import Title from '../components/Title';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import DeleteButtonImage from '../assets/icons/delete_red.png'
import { del, get } from '../constants/fetch';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { cTextDark, flex1, mbAuto, mlAuto, mrAuto, mtAuto } from '../constants/styles';
import { CollectionType } from '../constants/artTypes';
import { getImageFromPostId, getImageUrl } from '../helpers/ImageHelper';
import Button from '../components/Button';


const Collection = ({ navigation, route }: any) => {
  const context = useContext(MainContext);
  const token = context?.token;
  const collection: CollectionType = route?.params?.collection;
  const arts: string[] = collection?.artPublications;
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [artworks, setArtworks] = useState<any[]>([]);


  const handleBackButtonClick = () => {
    navigation.goBack();
  };


  const handleDeleteButtonClick = () => {
    setDeleteModalVisible(true);
  };


  const handleDeleteConfirmed = () => {
    if (!token) {
      return navigation.navigate('login');
    }

    const url = `/api/collection/${collection._id}`;

    const callback = () => {
      console.log('Collection : \"' + collection.name + '\" deleted.');
      navigation.goBack();
      setDeleteModalVisible(false);
      Alert.alert('Collection supprimée', 'collectionName');
    };

    const onErrorCallback = (error: any) => {
      console.error('Error del collection: ', error);
    };

    del(url, token, callback, onErrorCallback);
  };


  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };


  const handleArtworkClick = (id: string) => {
    navigation.navigate('singleart', { id: id });
  };


  const getArtworks = () => {
    console.log(collection);

    if (arts?.length === 0) {
      return;
    }

    arts?.forEach((art: string) => {
      get(
        `/api/art-publication/${art}`,
        context?.token,
        (res: any) => {
          setArtworks((current: any[]) => [ ...current, res.data ]);
        },
        (err: any) => console.error(err)
      );
    });
  }


  useEffect(getArtworks, []);


  return (
    <SafeAreaView style={{ backgroundColor: colors.white, paddingHorizontal: 12, paddingBottom: 80, flex: 1 }}>
      <StatusBar backgroundColor={colors.bg} />
      <View style={{ flexDirection: 'row', marginRight: 20 }}>

        {/* Back button */}
        <TouchableOpacity
          onPress={() => handleBackButtonClick()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            color={colors.black}
            size={24}
            style={[ mlAuto, mrAuto, mbAuto, mtAuto ]}
          />
        </TouchableOpacity>
        {/* Delete button */}
        <TouchableOpacity
          onPress={() => handleDeleteButtonClick()}
          style={styles.deleteButton}
        >
          <Image source={DeleteButtonImage} style={{ width: 28, height: 30 }} />
        </TouchableOpacity>
      </View>


      <Title style={styles.mainTitle}>{ collection?.name }</Title>

      <View style={styles.squareContainer}>
      <FlatList
       numColumns={3}
       data={artworks}
       renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index.toString()}
            style={styles.squareFrame}
            onPress={() => handleArtworkClick(item)}
          >
            <Image
              source={{ uri: getImageUrl(item?.image) }}
              style={{ flex: 1, borderRadius: 10 }}
              resizeMode="cover"
              onError={(error) => console.log(`Error loading image ${index}:`, error.nativeEvent)}
            />
          </TouchableOpacity>
        )}
        />
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
            <Text style={cTextDark}>Êtes-vous sûr de vouloir supprimer cette collection ?</Text>
            <View style={styles.modalButtons}>
              <Button
                onPress={handleCancelDelete}
                value="Annuler"
                secondary
              />
              <Button
                onPress={handleDeleteConfirmed}
                value="Supprimer"
              />
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
