import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Local imports
import Title from '../../components/Title';
import colors from '../../constants/colors';
import Button from '../../components/Button';
import { MainContext } from '../../context/MainContext';
import Ionicons from "react-native-vector-icons/Ionicons";
import { aiCenter, flexRow, mh8, mv24 } from "../../constants/styles";

const Settings = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);


  const handleDisconnectClick = () => {
    navigation.navigate('login');
    return context?.logOut();
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} />

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
          textStyle={{ fontSize: 17 }}
          onPress={() => navigation.navigate("personal_informations")}
        />
        <Button
          value="Mot de passe et sécurité"
          secondary
          style={styles.settingsButton}
          textStyle={{ fontSize: 17 }}
          onPress={() => navigation.navigate("password_and_security")}
        />
        <Button
          value="Conditions générales de vente"
          secondary
          style={styles.settingsButton}
          textStyle={{ fontSize: 17 }}
          onPress={() => navigation.navigate("general_conditions")}
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
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingBottom: 80,
    flex: 1
  },
  settingsButton: {
    width: '95%', // Utilise '80%' pour que le bouton occupe 80% de la largeur de l'écran
    borderRadius: 10,
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
