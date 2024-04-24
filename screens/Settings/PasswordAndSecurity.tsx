import React, { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';

// Local imports
import Title from '../../components/text/Title';
import colors from '../../constants/colors';
import BackArrow from '../../assets/images/back_arrow_black.png'
import Button from '../../components/buttons/Button';
import InfoModal from '../../components/infos/InfoModal';
import { post } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import Ionicons from "react-native-vector-icons/Ionicons";

const PasswordAndSecurity = () => {
  const navigation = useNavigation();
  const [showPasswordChangeFields, setShowPasswordChangeFields] = useState(false);
  const [oldPassword, setoldPassword] = useState<string>('');
  const [newPassword1, setnewPassword1] = useState<string>('');
  const [newPassword2, setnewPassword2] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error');
  const context = useContext(MainContext);
  const token = context?.token;

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const handlePasswordChangeClick = () => {
    if (showPasswordChangeFields) {
      if (newPassword1 === newPassword2) {
        // Appeler la méthode que tu rempliras plus tard
        changePassword(oldPassword, newPassword1);
      } else {
        // Afficher une alerte si les nouveaux mots de passe ne correspondent pas
        Alert.alert('Erreur', 'La confirmation du nouveau mot de passe ne correspond pas.');
      }
    }

    setShowPasswordChangeFields(!showPasswordChangeFields);
  };

  const changePassword = (currentPassword: string, newPassword: string) => {
    const requestData = { currentPassword, newPassword };

    post(
      `/api/auth/change-password`,
      requestData,
      token,
      onSuccess,
      onError
    )
  };

  const onSuccess = async (response: any) => {
    setModalMessage("Votre mot de passe a bien été mis à jour.");
    setModalType('success');
    setModalVisible(true);
    return;  }

  const onError = async (response: any) => {
    setModalMessage("Erreur lors de la mise à jour du mot de passe.");
    setModalType('error');
    setModalVisible(true);
    return;
  }

  const handleOldPasswordChange = (value: string) => {
    setoldPassword(value);
  };

  const handleNewPassword1Change = (value: string) => {
    setnewPassword1(value);
  };

  const handleNewPassword2Change = (value: string) => {
    setnewPassword2(value);
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

      <Title style={styles.mainTitle}>Mot de passe et sécurité</Title>

      {showPasswordChangeFields && (
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Mot de passe actuel ..."
              onChangeText={handleOldPasswordChange}
              style={[styles.passwordInput, { backgroundColor: '#F0F0F0', paddingLeft: 15 }]}
              secureTextEntry={!showPassword}
              value={oldPassword}
            />
            {oldPassword ? (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                activeOpacity={0.7}
              >
                <Image source={require('../../assets/eye_icon.png')} style={styles.eyeIconImage} />
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nouveau mot de passe ..."
              onChangeText={handleNewPassword1Change}
              style={[styles.passwordInput, { backgroundColor: '#F0F0F0', paddingLeft: 15 }]}
              secureTextEntry={!showPassword}
              value={newPassword1}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirmation ..."
              onChangeText={handleNewPassword2Change}
              style={[styles.passwordInput, { backgroundColor: '#F0F0F0', paddingLeft: 15 }]}
              secureTextEntry={!showPassword}
              value={newPassword2}
            />
          </View>
        </View>
      )}

      {!showPasswordChangeFields && (
        <View style={styles.infoBlock}>
          <Title style={styles.infoTitle}>Mot de passe</Title>
            <Text style={styles.infoValue}>************</Text>
        </View>
      )}
      <Button
        value="Changer le mot de passe"
        style={styles.changePasswordButton}
        textStyle={{ fontSize: 18, fontWeight: 'bold' }}
        onPress={() => handlePasswordChangeClick()}
      />
      <InfoModal 
        isVisible={isModalVisible}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
        messageType={modalType}
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
  changePasswordButton: {
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
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 18,
    color: colors.black,
  },
  infoValue: {
    fontSize: 17,
    color: 'grey',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 100,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  passwordInput: {
    marginLeft: 0,
    marginRight: 0,
    flex: 1,
    borderRadius: 50
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  eyeIconImage: {
    width: 20,
    height: 20,
  },
});

export default PasswordAndSecurity;
