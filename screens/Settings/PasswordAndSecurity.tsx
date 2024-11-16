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
import Input from '../../components/textInput/Input';
import { bgColor, bgGrey, bgRed, cText, cTextDark, flex1, flexRow, mbAuto, mh0, mh24, mh8, mlAuto, mt8, mtAuto, mv24, ph8 } from '../../constants/styles';
import CheckBox from '@react-native-community/checkbox';

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
    <SafeAreaView style={[bgColor, ph8, flex1]}>
      <StatusBar backgroundColor={colors.white} />

      {/* Go back button */}
      <TouchableOpacity
        onPress={() => handleBackButtonClick()}
        style={[flexRow, mv24, mh8]}
      >
        <Ionicons
          name="chevron-back-outline"
          color={colors.black}
          size={32}
        />

        <Title style={styles.mainTitle}>
          Mot de passe et sécurité
        </Title>
      </TouchableOpacity>


      { showPasswordChangeFields ? (
        <View>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Mot de passe actuel..."
              onTextChanged={handleOldPasswordChange}
              secureTextEntry={!showPassword}
              style={[bgGrey, mh0, flex1]}
              value={oldPassword}
            />
          </View>

          <View style={styles.inputContainer}>
            <Input
              placeholder="Nouveau mot de passe..."
              onTextChanged={handleNewPassword1Change}
              secureTextEntry={!showPassword}
              style={[bgGrey, flex1, mh0]}
              value={newPassword1}
            />
          </View>

          <View style={styles.inputContainer}>
            <Input
              placeholder="Confirmez le mot de passe..."
              onTextChanged={handleNewPassword2Change}
              secureTextEntry={!showPassword}
              style={[bgGrey, flex1, mh0]}
              value={newPassword2}
            />
          </View>

          <TouchableOpacity
            style={[flexRow, mh24, mt8]}
            onPress={() => setShowPassword(curr => !curr)}
            activeOpacity={0.9}
          >
            <Text style={cTextDark}>
              Afficher les mots de passe
            </Text>

            <CheckBox
              value={showPassword}
              onValueChange={setShowPassword}
              tintColors={{ true: colors.primary, false: colors.textDark }}
              tintColor={colors.textDark}
              style={[mtAuto, mbAuto, mlAuto]}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.infoBlock}>
          <Title style={styles.infoTitle}>Mot de passe</Title>
          <Text style={styles.infoValue}>************</Text>
        </View>
      ) }

      <Button
        value="Changer le mot de passe"
        style={[mtAuto]}
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
    fontSize: 25,
    marginLeft: 16
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
