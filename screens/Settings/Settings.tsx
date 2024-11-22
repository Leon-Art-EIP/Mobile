import React, { useContext } from 'react';
import {SafeAreaView, StyleSheet, StatusBar, View, TouchableOpacity, Text, ToastAndroid} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Local imports
import { post } from '../../constants/fetch';
import Title from '../../components/text/Title';
import colors from '../../constants/colors';
import { MainContext } from '../../context/MainContext';
import Ionicons from "react-native-vector-icons/Ionicons";
import {aiCenter, cTextDark, flexRow, mh24, mh8, mv24, mv8, ph24, pv8} from "../../constants/styles";
import { Linking } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


type SettingType = {
  name: string;
  icon: string;
  onPress: () => void;
};


const Settings = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);


  const handleDisconnectClick = () => {
    context?.logOut();
    navigation.navigate('login');
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
          ToastAndroid.show("Votre compte est déjà lié !", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Une erreur s'est produite, veuillez réessayer plus tard", ToastAndroid.LONG);
          console.error('Error linking Stripe account:', error);
        }
      }
    );
  };


  const SETTINGS: SettingType[] = [
    { name: 'Informations personnelles', icon: 'account', onPress: () => navigation.navigate('personal_informations') },
    { name: 'Mot de passe et sécurité', icon: 'security', onPress: () => navigation?.navigate('password_and_security') },
    { name: 'Conditions générales de vente', icon: 'text-box-outline', onPress: () => navigation.navigate('general_conditions') },
    { name: 'Lier mon compte de paiement', icon: 'account-cash', onPress: linkStripeAccount },
    { name: 'Tutoriel', icon: 'help', onPress: () => navigation.navigate('tutorial', { comesFromSettings: true }) },
    { name: 'Se déconnecter', icon: 'logout', onPress: handleDisconnectClick }
  ];


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

      <View>
        { SETTINGS.map((setting: SettingType) => (
          <TouchableOpacity
            key={setting.name}
            onPress={setting.onPress}
            style={[ph24, pv8, mv8, flexRow, aiCenter]}
          >
            <MaterialCommunityIcons
              name={setting.icon}
              size={24}
              color={colors.textDark}
            />
            <Text style={[mh24, cTextDark]}>
              { setting.name }
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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