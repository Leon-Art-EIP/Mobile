import React, { useState, useContext } from 'react';
import { Alert, Text, View, StyleSheet, StatusBar } from 'react-native';
import axios from 'axios';
import { MainContext } from '../context/MainContext';

import Button from '../components/buttons/Button';
import Input from '../components/textInput/Input';
import Title from '../components/text/Title';
import colors from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cCheck, cError, cPrimary, cTextDark, flex1, flexRow, mb24, mh24, mh4, mh8, mt8, mtAuto, mv8 } from '../constants/styles';
import { betwStr, hasNumbers, hasUppercase, isAlphaNumeric } from '../helpers/NamesHelper';
import { useNavigation } from '@react-navigation/native';
import { post } from '../constants/fetch';


const Signup = () => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [password2, setPassword2] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isArtist, setIsArtist] = useState <boolean>(true);
  const context = useContext(MainContext);
  const navigation = useNavigation();


  const areAllFieldsComplete = (): boolean => {
    return !!password2 && !!password && !!username && !!email;
  }


  // Returns true if the passwords are fine, false else
  const checkPassword = (
    ps1: string | undefined = undefined,
    ps2: string | undefined = undefined
  ): boolean => {
    if (!ps1 || !ps2 || ps1 !== ps2) {
      return false;
    }

    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    return !!regex.test(ps1);
  }


  // Returns true if the username is okay, false else
  const checkUsername = (username: string | undefined = undefined): boolean => {
    if (!username) {
      return false;
    }

    const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
    return !!usernameRegex.test(username);
  }


  // Returns true if the email is okay, false else
  const checkEmail = (email: string | undefined = undefined): boolean => {
    if (!email) {
      return false;
    }

    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    return !!emailRegex.test(email);
  }


  const handleSignup = () => {
    const requestData = { username, email, password, is_artist: isArtist };

    if (!checkUsername(username)) {
      return setError("Il y a un problème avec votre email ou votre identifiant");
    }

    if (!checkEmail(email)) {
      return setError("Veuillez vérifier que votre adresse email est valide");
    }

    if (!checkPassword(password, password2)) {
      return setError("Le mot de passe ne respecte pas les règles !");
    }

    post(
      '/api/auth/signup',
      requestData,
      undefined,
      (response: any) => {
        if (!response || !response.data || !response.data.token) {
          console.error('Invalid response format: ', response);
          return Alert.alert(
            'Inscription échouée',
            'Réponse du serveur erronée'
          );
        }

        context?.setUserEmail(response?.data?.user?.email);
        context?.setToken(response?.data?.token);
        context?.setUserId(response?.data?.user?.id);
        context?.setUsername(response?.data?.user?.username);
        context?.setisArtist(isArtist);
        context?.saveContextToJwt();
        return navigation.navigate('profilingquizz');
      },
      (error: any) => {
        if (!error.response) {
          return Alert.alert(
            "Une erreur s'est produite",
            "Ce n'est pas de votre faute. Réessayez plus tard !"
          );
        }

        switch (error?.response?.status) {
          case (422): Alert.alert('Erreur', 'Vérifiez vos informations'); break;
          case (409): Alert.alert('Erreur', 'Cette adresse email est déja utilisée'); break;
          default: Alert.alert('Erreur', "C'est de notre côté, pas de panique ! Veuillez réessayer plus tard");
        }
      }
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.bg} barStyle='dark-content' />

      {/* Title */}
      <View style={styles.titleView}>
        <Title
          style={cPrimary}
          size={70}
        >
          Leon
        </Title>
        <Title size={70}>'Art</Title>
      </View>

      <Title style={styles.signupTitle}>
        Inscription
      </Title>

      {/* Email input */}
      <Input
        placeholder="Email"
        onTextChanged={setEmail}
        style={[
          styles.input,
          !!checkEmail(email) ? cCheck : cError
        ]}
      />

      {/* Username input */}
      <Input
        placeholder="Nom d'utilisateur"
        onTextChanged={setUsername}
        style={styles.input}
      />

      <View style={[mh24, mt8, mb24]}>
        <Text style={[cTextDark]}>
          Votre identifiant doit contenir au moins :
        </Text>
        <Text style={betwStr(3, username, 20) ? cCheck : cError}>
          - Entre 3 et 20 caractères
        </Text>
        <Text style={isAlphaNumeric(username) ? cCheck : cError}>
          - Seulement des lettres, chiffres et underscores (_)
        </Text>
      </View>

      {/* Password input */}
      <Input
        placeholder="Mot de passe"
        secureTextEntry
        onTextChanged={setPassword}
        style={styles.input}
      />

      {/* Password confirmation input */}
      <Input
        placeholder="Retapez votre mot de passe"
        secureTextEntry
        onTextChanged={setPassword2}
        style={styles.input}
      />

      <View style={[mh24, mt8, mb24]}>
        <Text style={[cTextDark]}>
          Votre mot de passe doit :
        </Text>

        <Text style={password && password?.length >= 8 ? cCheck : cError}>
          - Contenir au moins 8 caractères
        </Text>

        <Text style={hasUppercase(password) ? cCheck : cError}>
          - Contenir au moins une majuscule
        </Text>

        <Text style={hasNumbers(password) ? cCheck : cError}>
          - Contenir au moins un chiffre
        </Text>
      </View>

      { !!error && (
        <Text style={[mh24, mv8, cError]}>
          { error }
        </Text>
      )}

      <View style={[flexRow, mh8, mtAuto]}>
        <Button
          onPress={() => navigation.goBack()}
          value="Retour"
          style={[flex1, mh4]}
          secondary
        />
        <Button
          onPress={handleSignup}
          value="Continuer"
          style={[flex1, mh4]}
          textStyle={styles.signupButtonText}
          disabled={!areAllFieldsComplete()}
        />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.bg
  },
  signupTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
    marginRight: 'auto',
    marginLeft: 15,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.disabledBg,
    marginLeft: 10,
    marginRight: 10,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 24
  },
  existingUserContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  existingUserText: {
    color: colors.textDark,
    marginRight: 8,
  },
  loginText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: 'blue',
  }
});

export default Signup;
