import { SafeAreaView, StyleSheet, StatusBar, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';

// Local imports
import Title from '../../components/Title';
import colors from '../../constants/colors';
import BackArrow from '../../assets/images/back_arrow_black.png';
import { MainContext } from '../../context/MainContext';
import { get, post } from '../../constants/fetch';

const GeneralConditions = () => {
  const navigation = useNavigation();
  const [conditions, setConditions] = useState<string | null>(null);
  const context = useContext(MainContext);
  const token = context?.token;

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const fetchGeneralCondition = async () => {
    try {
      if (token) {
        const url = `/api/conditions/`;
        const callback = (response) => {
          setConditions(response.data.conditions);
        };
        const onErrorCallback = (error) => {
          console.error('Error fetching general conditions:', error);
          Alert.alert('Error', 'Les conditions générales de vente n\'ont pas pu être récupérées.');
        };
        get(url, token, callback, onErrorCallback);
      } else {
        console.error('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
        Alert.alert('Token JWT non trouvé. Assurez-vous que l\'utilisateur est connecté.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des œuvres de l\'utilisateur :', error);
      Alert.alert('Erreur de récupération des œuvres', 'Une erreur s\'est produite.');
    }
  };

  useEffect(() => {
    fetchGeneralCondition();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, paddingHorizontal: 12, paddingBottom: 80, flex: 1 }}>
      <StatusBar backgroundColor={colors.white} />
      <TouchableOpacity
          onPress={() => handleBackButtonClick()}
          style={styles.backButton}
          >
          <Image source={BackArrow} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      <Title style={styles.mainTitle}>Conditions générales de vente</Title>
      <Text style={styles.textContent}>{conditions}</Text>

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
    fontSize: 25,
  },
  textContent: {
    marginTop: 5,
    marginHorizontal: 12,
    marginVertical: 32,
    fontSize: 15,
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

export default GeneralConditions;
