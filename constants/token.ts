// Ici on retrouve plusieurs fonction utiles pour l'utilisation des
// JWT token. Ces fonctions ne sont pas utilisées pour l'instant

import AsyncStorage from '@react-native-async-storage/async-storage';

// Pour stocker le token JWT :
const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('jwt', token);
  } catch (error) {
    console.error('Erreur lors du stockage du token :', error);
  }
};

// Pour récupérer le token JWT :
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt');
    return token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token :', error);
    return null;
  }
};

// Pour supprimer le token JWT :
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('jwt');
  } catch (error) {
    console.error('Erreur lors de la suppression du token :', error);
  }
};