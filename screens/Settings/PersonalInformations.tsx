import { SafeAreaView, StyleSheet, StatusBar, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';

// Local imports
import Title from '../../components/text/Title';
import colors from '../../constants/colors';
import BackArrow from '../../assets/images/back_arrow_black.png'
import { MainContext } from '../../context/MainContext';
import Button from '../../components/buttons/Button';
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from 'react-native-vector-icons/AntDesign';

const PersonalInformations = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const userEmail = context?.userEmail;
  const accountType = context?.isArtist ? "Artiste" : "Amateur";

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handleQuizzClick = () => {
    navigation.navigate('profiling');
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, paddingHorizontal: 12, paddingBottom: 80, flex: 1 }}>
      <StatusBar backgroundColor={colors.white} />

      {/* Go back button */}
      <TouchableOpacity
        onPress={() => handleBackButtonClick()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back-outline" color={colors.black} size={32} />
      </TouchableOpacity>

      <Title style={styles.mainTitle}>Informations personnelles</Title>

      {/* Bloc 1 - Email */}
      <View style={styles.infoBlock}>
        <Title style={styles.infoTitle}>Adresse email</Title>
        <Text style={styles.infoValue}>{userEmail}</Text>
      </View>
      {/* Bloc 2 - Account type */}
      <View style={styles.infoBlock}>
        <Title style={styles.infoTitle}>Type de compte</Title>
        <Text style={styles.infoValue}>{accountType}</Text>
      </View>

      <Button
          value="(Re)faire le quizz"
          style={styles.quizzButton}
          textStyle={{ fontSize: 18, fontWeight: 'bold' }}
          onPress={() => handleQuizzClick()}
          />
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
  quizzButton: {
    width: '95%', // Utilise '80%' pour que le bouton occupe 80% de la largeur de l'écran
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignSelf: 'center', // Centre le bouton horizontalement
    marginHorizontal: '10%', // Ajoute des marges de 10% de chaque côté
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    color: colors.tertiary,
  },
  infoBlock: {
    marginLeft: 12,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    color: colors.black,
  },
  infoValue: {
    fontSize: 16,
    color: 'grey',
  },
});

export default PersonalInformations;
