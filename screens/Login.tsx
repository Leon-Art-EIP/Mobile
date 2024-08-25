import React, { useState, useContext } from 'react';
import {Alert, Text, StyleSheet, View, TextInput, TouchableOpacity, Image, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
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
  GoogleOneTapSignIn,
  isErrorWithCode,
  statusCodes
} from '@react-native-google-signin/google-signin';
import { flexRow, mlAuto, mrAuto } from '../constants/styles';
import { stat } from 'react-native-fs';


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
    console.log('response: ', { ...response.data });
    const tokenObject: TokenObjectType = {
      token: response.data.token,
      email: response.data.user.email,
      id: response.data.user.id,
      isArtist: !!response.data.user.availability,
      username: response.data.user.username
    };
    console.log("token object: ", { ...tokenObject });

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
    setIsLoading(false);
    return navigation.navigate('main');
  }


  const googleOauth = async () => {
    try {
      GoogleSignin.configure({
        webClientId: process.env.REACT_APP_GOOGLE_WEBCLIENTID
      });
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      post(
        "/api/mobile/google",
        context?.token,
        { idToken: userInfo.idToken },
        (res: any) => {
          console.log("res.data: ", { ...res.data });
        },
        (err: any) => console.error({ ...err })
      );
    } catch (e: any) {
      if (isErrorWithCode(e)) {
        console.log("Google auth error with code: ", e.code);
      } else {
        console.log('Another error');
      }
    }
  }


  const onLoginError = async (error: any) => {
    if (error.response) {
      console.error('Server responded with an error: ', { ...error.response.data });
      if (error.response.status === 422) {
        console.error('Validation error. Please check your input data.');
        Alert.alert("Informations invalides", "Veuillez vérifier vos informations de connexion");
      } else {
        console.error('Other server error: ', { ...error.response.status });
        Alert.alert("Connexion échouée", "Veuillez réessayer plus tard");
      }
    } else if (error.request) {
      console.error('Request was made but no response was received: ', { ...error.request });
      Alert.alert("Connexion échouée", "Veuillez réessayer plus tard");
    } else {
      console.error('Error setting up the request: ', { ...error.message });
      Alert.alert("Connexion échouée", "Veuillez réessayer plus tard");
    }
    console.error('Error config: ', { ...error.config });
    setIsLoading(false);
  }


  const handleLogin = () => {
    const requestData = { email, password };
    setIsLoading(true);

    post(
      `/api/auth/login`,
      requestData,
      undefined,
      onLogin,
      onLoginError
    )
  };


  return (
    <View style={styles.container}>

      {/* Use this to set the correct color on the status bar */}
      <StatusBar backgroundColor="#F2F2F2" barStyle='dark-content' />

      <SafeAreaView style={styles.safeView}>
        <View style={styles.titleView}>
          <Title style={{ color: colors.primary, fontSize: 70 }}>Leon</Title>
          <Title style={{ fontSize: 70 }}>'Art</Title>
        </View>
        <Title style={styles.loginTitle}>Connexion</Title>
        <View style={styles.passwordContainer}>
          <View style={styles.inputContainer}>
            <Image source={require('../assets/mail_icon.png')} style={styles.icon} />
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

        <TouchableOpacity
          onPress={() => setRememberMe((currentValue: boolean) => !currentValue)}
        >
          <View style={styles.checkboxContainer}>
            <CheckBox
              tintColors={{ true: colors.primary, false: colors.textDark }}
              tintColor={colors.textDark}
              onFillColor={colors.primary}
              value={rememberMe}
              onValueChange={(value: boolean) => setRememberMe(value)}
            />
            <Text style={styles.rememberMeText}>Se souvenir de moi</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('recover')}>
          <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

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

        <View style={flexRow}>
          <GoogleSigninButton
            onPress={googleOauth}
            size={GoogleSigninButton.Size.Icon}
            color={GoogleSigninButton.Color.Light}
            style={[mlAuto, mrAuto]}
          />
        </View>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Ou</Text>
          <View style={styles.line} />
        </View>

        <Button
          onPress={() => navigation.navigate('signup')}
          value="S'inscrire"
          tertiary
        />
      </SafeAreaView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    margin: 0,
    paddingHorizontal: 16,
    flex: 1
  },
  safeView: {
    backgroundColor: '#F2F2F2',
    width:  '100%',
    height: Dimensions.get('window').height
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
    backgroundColor: '#fff',
    borderRadius: 100,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  passwordInput: {
    color: colors.black,
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
    marginRight: 10,
  }
});


export default Login;
