import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Local imports
import { post } from '../../constants/fetch';
import Title from '../../components/text/Title';
import colors from '../../constants/colors';
import Button from '../../components/buttons/Button';
import { MainContext } from '../../context/MainContext';
import Ionicons from "react-native-vector-icons/Ionicons";
import { aiCenter, flexRow, mh8, mtAuto, mv24 } from "../../constants/styles";
import { Linking } from 'react-native';

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
          onPress={() => navigation.goBack()}
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

      <Button
        value="Informations personnelles"
        secondary
        textStyle={{ fontSize: 16 }}
        onPress={() => navigation.navigate("personal_informations")}
      />
      <Button
        value="Mot de passe et sécurité"
        secondary
        textStyle={{ fontSize: 16, textAlign: 'left' }}
        onPress={() => navigation.navigate("password_and_security")}
      />
      <Button
        value="Conditions générales de vente"
        secondary
        textStyle={{ fontSize: 16 }}
        onPress={() => navigation.navigate("general_conditions")}
      />
      <Button
        secondary
        value="Lier mon compte Stripe"
        onPress={linkStripeAccount}
      />
      <Button
        secondary
        style={[mtAuto]}
        value="Tutoriel"
        onPress={() => navigation.navigate("tutorial")}
      />

      {/* Log out button */}
      <Button
        value="Se déconnecter"
        onPress={handleDisconnectClick}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    flex: 1
  },
  logo: {
    flexDirection: 'row',
    height: 100,
    paddingLeft: 20,
    padding: 20,
    borderRadius: 5,
  },
  mainTitle: {
    marginTop: 10,
    marginHorizontal: 12,
    marginVertical: 32
  }
});

export default Settings;
