import React, { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, View, TouchableOpacity, Image,  } from 'react-native';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';

// Local imports
import { post } from '../../constants/fetch';
import Title from '../../components/Title';
import colors from '../../constants/colors';
import Button from '../../components/Button';
import BackArrow from '../../assets/images/back_arrow_black.png'
import { MainContext } from '../../context/MainContext';

const Settings = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handlePersonalInformationsClick = () => {
    navigation.navigate('personal_informations');
  };
  
  const handlePasswordAndSecurityClick = () => {
    navigation.navigate('password_and_security');

  };
  
  const handleGeneralConditionsClick = () => {
    navigation.navigate('general_conditions');
  };

  const handleDisconnectClick = () => {
    navigation.navigate('login');
    context?.setToken("");
  };

  const linkStripeAccount = () => {
    post(
      '/api/stripe/account-link',
      undefined,
      context?.token,
      (response) => {
        if (response && response.data && response.data.url) {
          const url = response.data.url;
          Linking.openURL(url)
            .then(() => console.log('Link opened successfully'))
            .catch((err) => console.error('Error opening link:', err));
        } else {
          console.error('Error: Unable to retrieve URL');
        }
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          console.error('User already linked stripe account');
          // Handle specific error for 400 status code, if needed
        } else {
          console.error('Error linking Stripe account:', error);
        }
        // console.error('Error linking Stripe account:', error);
      }
    );
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
      <Title style={styles.mainTitle}>Paramètres</Title>
      <View>
        <Button style={styles.stripebutton}
        value="Stripe Account"
        onPress={linkStripeAccount}
        />
        <Button
          value="Informations personnelles"
          secondary
          style={styles.settingsButton}
          textStyle={{fontSize: 17}}
          onPress={() => handlePersonalInformationsClick()}
          />
        <Button
          value="Mot de passe et sécurité"
          secondary
          style={styles.settingsButton}
          textStyle={{fontSize: 17}}
          onPress={() => handlePasswordAndSecurityClick()}
          />
        <Button
          value="Conditions générales de vente"
          secondary
          style={styles.settingsButton}
          textStyle={{fontSize: 17}}
          onPress={() => handleGeneralConditionsClick()}
          />
      </View>
      <Button
          value="Se déconnecter"
          style={styles.disconnectButton}
          textStyle={{ fontSize: 18, fontWeight: 'bold' }}
          onPress={() => handleDisconnectClick()}
          />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1
  },
  stripebutton: {
    backgroundColor: colors.stripe,
  },
  mainTitle: {
    marginTop: 50,
    marginHorizontal: 12,
    marginVertical: 32
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
  disconnectButton: {
    width: '60%', // Utilise '80%' pour que le bouton occupe 80% de la largeur de l'écran
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignSelf: 'center', // Centre le bouton horizontalement
    marginHorizontal: '10%', // Ajoute des marges de 10% de chaque côté
  },
});

export default Settings;
