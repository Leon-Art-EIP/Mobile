import React, { useState, useContext } from 'react';
import {Alert, Text, StyleSheet, View, TextInput, TouchableOpacity, Image, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Button from '../components/Button';
import Title from '../components/Title';
import CheckBox from '@react-native-community/checkbox';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import { post } from '../constants/fetch';


const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const context = useContext(MainContext);

  const onLogin = async (response: any) => {
    if (response && response.data && response.data.token) {
      const tokenFromDB = response.data.token;

      try {
        await AsyncStorage.setItem('jwt', tokenFromDB);
        context?.setToken(tokenFromDB);
        context?.setUserEmail(response.data.user.email);
        context?.setUserId(response.data.user.id);
        context?.setisArtist(response.data.user.is_artist);
        navigation.navigate('main');
      } catch (error) {
        console.error('Error storing token:', error);
        Alert.alert('Login Failed', 'Error storing token');
      }
    } else {
      console.error('Invalid response format: ', response);
      Alert.alert('Login Failed', 'Invalid response format');
    }
    setIsLoading(false);
  }


  const onLoginError = async (error: any) => {
    if (error.response) {
      console.error('Server responded with an error:', { ...error.response.data });
      if (error.response.status === 422) {
        console.error('Validation error. Please check your input data.');
        Alert.alert('Signup Failed', 'Validation error. Please check your input data.');
      } else {
        console.error('Other server error:', { ...error.response.status });
        Alert.alert('Signup Failed', 'Other server error');
      }
    } else if (error.request) {
      console.error('Request was made but no response was received:', { ...error.request });
      Alert.alert('Signup Failed', 'Request was made but no response was received');
    } else {
      console.error('Error setting up the request:', { ...error.message });
      Alert.alert('Signup Failed', 'Error setting up the request');
    }
    console.error('Error config:', { ...error.config });
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


  const handleGoogleLogin = () => {
    navigation.navigate('google');
  };


  const handleRegister = () => {
    navigation.navigate('signup');
  };


  const handleEmailChange = (value: string) => {
    setEmail(value);
  };


  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };


  const handleForgotPassword = () => {
    navigation.navigate('recover');
  };


  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
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
              onChangeText={handleEmailChange}
              placeholderTextColor={colors.disabledFg}
              style={styles.passwordInput}
            />
          </View>
        </View>
        <View style={styles.passwordContainer}>
          <View style={styles.inputContainer}>
            <Image source={require('../assets/password_icon.png')} style={styles.icon} />
            <TextInput
              placeholder="Mot de passe"
              placeholderTextColor={colors.disabledFg}
              onChangeText={handlePasswordChange}
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

        <TouchableOpacity onPress={handleRememberMeChange}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              tintColor={{ true: colors.primary, false: colors.black }}
              value={rememberMe}
              onValueChange={handleRememberMeChange}
            />
            <Text style={styles.rememberMeText}>Se souvenir de moi</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
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

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Ou</Text>
          <View style={styles.line} />
        </View>

        <Button
          onPress={handleGoogleLogin}
          value="Se connecter avec Google"
          style={[styles.googleButton, { backgroundColor: colors.tertiary }]}
          textStyle={styles.googleButtonText}
        />

        <Button
          onPress={handleRegister}
          value="S'inscrire"
          style={styles.registerButton}
          textStyle={styles.registerButtonText}
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
    color: 'white',
  },
  registerButton: {
    backgroundColor: 'gray',
  },
  registerButtonText: {
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
    color: colors.black,
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
