import React, { useState, useContext } from 'react';
import {Alert, Text, StyleSheet, View, TextInput, TouchableOpacity, Image, Dimensions, StatusBar, ActivityIndicator, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../components/buttons/Button';
import Title from '../components/text/Title';
import CheckBox from '@react-native-community/checkbox';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import { post } from '../constants/fetch';
import { TokenObjectType } from '../constants/artTypes';
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import { acCenter, aiCenter, bgGrey, br20, cTextDark, flex1, flexRow, mb24, mh24, mh8, mlAuto, mrAuto, mv8, pv24, pv8 } from '../constants/styles';


const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const context = useContext(MainContext);


  const onLogin = async (response: any) => {
    if (!response || !response.data || !response.data.token) {
      console.error('Invalid response format: ', response);
      Alert.alert("Connexion échouée", "Veuillez réessayer plus tard");
      return;
    }

    setPassword("");
    setEmail("");
    const tokenObject: TokenObjectType = {
      token: response.data.token,
      email: response.data.user.email,
      id: response.data.user.id,
      isArtist: !!response.data.user.availability,
      username: response.data.user.username,
      userColor: colors.primary
    };

    try {
      await AsyncStorage.setItem('jwt', JSON.stringify(tokenObject));
    } catch (error) {
      console.error('Error storing token:', error);
    }

    context?.setToken(tokenObject.token);
    context?.setUserEmail(tokenObject.email);
    context?.setUserId(tokenObject.id);
    context?.setisArtist(response.data.user.availability);
    context?.setUsername(tokenObject.username);
    context?.setUserColor(tokenObject.userColor);
    setIsLoading(false);
    return navigation.navigate('main');
  };


  const googleOauth = async () => {
    setIsLoading(true);

    try {
      GoogleSignin.configure({
        webClientId: process.env.REACT_APP_GOOGLE_WEBCLIENTID
      });
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const postObject = {
        username: userInfo.user.name,
        email: userInfo.user.email,
        profilePicture: userInfo.user.photo
      };

      post(
        "/api/auth/mobile/google",
        postObject,
        undefined,
        onLogin,
        (err: any) => console.error({ ...err })
      );
    } catch (e: any) {
      if (isErrorWithCode(e)) {
        console.log("Google auth error with code: ", e.code);
      } else {
        console.log('Another error: ', { ...e });
      }
    }
  };


  const displayError = (msg: string = ""): void => {
    if (!msg) {
      return;
    }

    Alert.alert("Erreur de connexion", msg);
    return console.log("login error: ", msg);
  }


  const onLoginError = async (error: any) => {
    if (error.response) {
      switch (error.response.status) {
        case (401): displayError("Le mot de passe ou l'adresse mail est incorrecte"); break;
        case (422): displayError("Email invalide"); break;
        case (500): displayError("Veuillez réessayer plus tard"); break;
      }
    }

    console.error('Error config: ', { ...error.config });
    setIsLoading(false);
  };


  const handleLogin = () => {
    const requestData = { email, password };
    setIsLoading(true);

    post(
      `/api/auth/login`,
      requestData,
      undefined,
      onLogin,
      onLoginError
    );
  };


  return (
    <SafeAreaView style={styles.safeView}>
      <StatusBar
        backgroundColor={colors.bg}
        barStyle='dark-content'
      />

      {/* Title */}
      <View style={styles.titleView}>
        <Title style={{ color: colors.primary, fontSize: 70 }}>Leon</Title>
        <Title style={{ fontSize: 70 }}>'Art</Title>
      </View>

      <Title style={styles.loginTitle}>Connexion</Title>

      {/* Title */}
      <View style={styles.passwordContainer}>
        <View style={styles.inputContainer}>
          <Image
            source={require('../assets/mail_icon.png')}
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
            onChangeText={(newEmail: string) => setEmail(newEmail)}
            placeholderTextColor={colors.disabledFg}
            style={styles.passwordInput}
            value={email}
          />
        </View>
      </View>
      <View style={styles.passwordContainer}>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/password_icon.png')} style={styles.icon} />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor={colors.disabledFg}
            onChangeText={(newPsw: string) => setPassword(newPsw)}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
          />
          {password ? (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              activeOpacity={0.7}
            >
              <Image source={require('../assets/eye_icon.png')} style={styles.eyeIconImage} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      { isLoading && (
        <ActivityIndicator color={colors.primary} />
      )}

      <Button
        onPress={handleLogin}
        value="Se connecter"
        disabled={isLoading}
        style={[
          styles.loginButton,
          { backgroundColor: isLoading ? "#CA847A" : colors.primary }
        ]}
        textStyle={styles.loginButtonText}
      />

      {/* Elegant separator */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Ou</Text>
        <View style={styles.line} />
      </View>

      {/* Connect with Google */}
      <View style={[bgGrey, br20, pv24, { marginHorizontal: 16 }]}>
        <Title
          style={[cTextDark, mh24, mb24]}
          size={20}
        >
          Vous préférez Google ?
        </Title>

        <GoogleSigninButton
          onPress={googleOauth}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          style={[mlAuto, mrAuto]}
        />
      </View>

      {/* Forgot password + signup */}
      <View style={[flexRow]}>
        <Button
          onPress={() => navigation.navigate('recover')}
          value="Mot de passe oublié ?"
          textStyle={{ fontSize: 13 }}
          style={[flex1]}
          secondary
        />

        <Button
          onPress={() => navigation.navigate('signup')}
          value="S'inscrire"
          style={[flex1]}
          tertiary
        />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeView: {
    backgroundColor: colors.bg,
    flex: 1,
    paddingHorizontal: 24
  },
  loginTitle: {
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
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 100,
    paddingHorizontal: 10,
  },
  loginButton: {
    marginVertical: 16,
    marginHorizontal: 12
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  googleButton: {
    marginVertical: 16,
    backgroundColor: 'red',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  registerButton: {
    backgroundColor: colors.deepyellow,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.black,
  },
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 70,
    marginBottom: 40,
  },
  forgotPassword: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: colors.tertiary,
    marginLeft: 'auto',
    marginRight: 20,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 10,
    alignItems: 'center',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
  },
  rememberMeText: {
    color: colors.textDark,
    marginLeft: 8
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  orText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
  },
  passwordContainer: {
    marginBottom: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.disabledBg,
    borderRadius: 100,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  passwordInput: {
    color: colors.black,
    backgroundColor: colors.disabledBg,
    marginLeft: 0,
    marginRight: 0,
    flex: 1,
  },
  eyeIcon: {
    padding: 10,
  },
  eyeIconImage: {
    width: 20,
    height: 20,
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 12,
  }
});


export default Login;
