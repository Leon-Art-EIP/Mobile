import React, { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, View, TouchableOpacity, Image, Linking } from 'react-native';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

// Local imports
import { post } from '../../constants/fetch';
import Title from '../../components/text/Title';
import colors from '../../constants/colors';
import Button from '../../components/buttons/Button';
import BackArrow from '../../assets/images/back_arrow_black.png'
import { MainContext } from '../../context/MainContext';
import Ionicons from "react-native-vector-icons/Ionicons";
import {aiCenter, flexRow, mh8, mv24} from "../../constants/styles";

const Settings = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);


  const handleDisconnectClick = () => {
    navigation.navigate('login');
    return context?.logOut();
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
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} />
      <TouchableOpacity
          onPress={() => handleBackButtonClick()}
          style={styles.backButton}
          />
      <View style={[ flexRow, mv24, aiCenter, mh8 ]}>
        {/* Go back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" color={colors.black} size={32} />
        </TouchableOpacity>

        <Title style={{ marginHorizontal: 24 }}>Paramètres</Title>
      </View>

      <View>
        <Button
          value="Informations personnelles"
          secondary
          style={styles.settingsButton}
          textStyle={{ fontSize: 16 }}
          onPress={() => navigation.navigate("personal_informations")}
        />
        <Button
          value="Mot de passe et sécurité"
          secondary
          style={styles.settingsButton}
          textStyle={{ fontSize: 16, textAlign: 'left' }}
          onPress={() => navigation.navigate("password_and_security")}
        />
        <Button
          value="Conditions générales de vente"
          secondary
          style={styles.settingsButton}
          textStyle={{ fontSize: 16 }}
          onPress={() => navigation.navigate("general_conditions")}
        />
        <Button
          style={styles.stripebutton}
          value="Link my Stripe Account"
          onPress={linkStripeAccount}
        />
      </View>

      {/* Log out button */}
      <Button
        value="Se déconnecter"
        style={styles.disconnectButton}
        textStyle={{ marginTop: 'auto' }}
        onPress={() => handleDisconnectClick()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingBottom: 80,
    flex: 1
  },
  stripebutton: {
    width: '85%', // Utilise '80%' pour que le bouton occupe 80% de la largeur de l'écran
    backgroundColor: colors.stripe,
    ifyContent: 'center',
    alignSelf: 'center', // Centre le bouton horizontalement
    marginHorizontal: '10%', // Ajoute des marges de 10% de chaque côté
  },
  mainTitle: {
    marginTop: 50,
    marginHorizontal: 12,
    marginVertical: 32
  },
  settingsButton: {
    width: '85%', // Utilise '80%' pour que le bouton occupe 80% de la largeur de l'écran
    justifyContent: 'center',
    alignSelf: 'center', // Centre le bouton horizontalement
    marginHorizontal: '10%', // Ajoute des marges de 10% de chaque côté
  },
  disconnectButton: {
    width: '60%',
    marginTop: 'auto',
    justifyContent: 'center',
    alignSelf: 'center'
  }
});

export default Settings;
