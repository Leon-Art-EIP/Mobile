import React, { useContext } from 'react';
import {SafeAreaView, StyleSheet, StatusBar, View, TouchableOpacity, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Local imports
import { post } from '../../constants/fetch';
import Title from '../../components/text/Title';
import colors from '../../constants/colors';
import { MainContext } from '../../context/MainContext';
import Ionicons from "react-native-vector-icons/Ionicons";
import {aiCenter, cTextDark, flexRow, mh8, ml8, mv24, pv24} from "../../constants/styles";
import { Linking } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type SettingType = {
  id: number;
  name: string;
  onPress: () => void;
  iconName: string;
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
      (response: any) => {
        if (!response || !response?.data || !response?.data.url) {
          console.error('Error: Unable to retrieve URL');
        }

        console.log("Opening url: ", response.data.url);
        return Linking.openURL(response.data.url);
      },
      (error: any) => {
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


  const SETTINGS: SettingType[] = [
    {
      id: 0,
      name: 'Informations personnelles',
      onPress: () => navigation.navigate('personal_informations'),
      iconName: 'information-outline'
    },
    {
      id: 1,
      name: 'Mot de passe et sécurité',
      onPress: () => navigation.navigate('password_and_security'),
      iconName: 'security'
    },
    {
      id: 2,
      name: 'Conditions générales de vente',
      onPress: () => navigation.navigate('general_conditions'),
      iconName: 'text-box-multiple-outline'
    },
    {
      id: 3,
      name: 'Lier mon compte Stripe',
      onPress: linkStripeAccount,
      iconName: 'account-cash'
    },
    {
      id: 4,
      name: 'Tutoriel',
      onPress: () => navigation.navigate('tutorial', { comesFromSettings: true}),
      iconName: 'help'
    },
    {
      id: 5,
      name: 'Se déconnecter',
      onPress: handleDisconnectClick,
      iconName: 'logout'
    }
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

      { SETTINGS.map((setting: SettingType) => (
        <TouchableOpacity
          onPress={setting.onPress}
          key={setting.id}
          style={[ pv24, flexRow, aiCenter, mh8 ]}
        >
          <MaterialCommunityIcons
            name={setting.iconName}
            size={32}
            color={colors.textDark}
            style={[ mh8 ]}
          />
          <Text style={[ cTextDark, ml8 ]}>
            { setting.name }
          </Text>
        </TouchableOpacity>
      )) }
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