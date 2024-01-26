import { SafeAreaView, StyleSheet, StatusBar, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';

// Local imports
import Title from '../components/Title';
import colors from '../constants/colors';
import BackArrow from '../assets/images/back_arrow_black.png'
import { MainContext } from '../context/MainContext';
import Button from '../components/Button';
import DeleteButtonImage from '../assets/icons/delete.png'

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

const Collection = ({ navigation, route }: any) => {
  const context = useContext(MainContext);
  const collection = route?.params?.collection;
  const collectionName = collection.name;
  const artworks = collection.artPublications; // Assurez-vous que la structure de données est correcte ici

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handleDeleteButtonClick = () => {
    navigation.goBack();
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
});

export default Collection;
