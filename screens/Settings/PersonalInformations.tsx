import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';

// Local imports
import Title from '../../components/Title';
import colors from '../../constants/colors';
import BackArrow from '../../assets/images/back_arrow_black.png'

const PersonalInformations = () => {
  const navigation = useNavigation();

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, paddingHorizontal: 12, paddingBottom: 80, flex: 1 }}>
      <StatusBar backgroundColor={colors.white} />
      <TouchableOpacity
          onPress={() => handleBackButtonClick()}
          style={styles.backButton}
          >
          <Image source={BackArrow} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      <Title style={styles.mainTitle}>Informations personnelles</Title>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1
  },
  mainTitle: {
    marginTop: 50,
    marginHorizontal: 12,
    marginVertical: 32,
    fontSize: 25
  },
  settingsButton: {
    width: '95%', // Utilise '80%' pour que le bouton occupe 80% de la largeur de l'écran
    height: 50,
    borderRadius: 10,
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
});

export default PersonalInformations;
