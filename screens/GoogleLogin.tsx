import React, { useState, useEffect, useContext } from 'react';
import {Alert, Text, StyleSheet, View, TextInput, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Button from '../components/buttons/Button';
import Title from '../components/text/Title';
import CheckBox from '@react-native-community/checkbox';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';


const API_URL = process.env.REACT_APP_API_URL;


const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const context = useContext(MainContext);


  const handleLogin = () => {
    const requestData = { email, password };

    axios.post(`${API_URL}/api/auth/login`, requestData)
      .then(async response => {
        if (response && response.data && response.data.token) {
          const tokenFromDB = response.data.token;

          try {
            await AsyncStorage.setItem('jwt', tokenFromDB);
            context?.setToken(tokenFromDB);
            return navigation.navigate('main');
          } catch (error) {
            console.error('Error storing token:', error);
            Alert.alert('Login Failed', 'Error storing token');
          }
        } else {
          console.error('Invalid response format: ', response);
          Alert.alert('Login Failed', 'Invalid response format');
        }
      })
      .catch(error => {
        if (error.response) {
          console.error('Server responded with an error:', error.response.data);
          if (error.response.status === 422) {
            console.error('Validation error. Please check your input data.');
            Alert.alert('Signup Failed', 'Validation error. Please check your input data.');
          } else {
            console.error('Other server error:', error.response.status);
            Alert.alert('Signup Failed', 'Other server error');
          }
        } else if (error.request) {
          console.error('Request was made but no response was received:', error.request);
          Alert.alert('Signup Failed', 'Request was made but no response was received');
        } else {
          console.error('Error setting up the request:', error.message);
          Alert.alert('Signup Failed', 'Error setting up the request');
        }
        console.error('Error config:', error.config);
      });
  };


  const handleGoogleLogin = () => {};


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
      <StatusBar backgroundColor="#F2F2F2" />

      <SafeAreaView style={styles.safeView}>
        <View style={styles.titleView}>
          <Title style={{ color: colors.primary, fontSize: 70 }}>Leon</Title>
          <Title style={{ fontSize: 70 }}>'Art</Title>
        </View>
        <Title style={styles.loginTitle}>Se connecter avec Google</Title>
        <View style={styles.passwordContainer}>
          <View style={styles.inputContainer}>
            <Image source={require('../assets/mail_icon.png')} style={styles.icon} />
            <TextInput
              placeholder="Email"
              onChangeText={handleEmailChange}
              style={styles.passwordInput}
            />
          </View>
        </View>
        <View style={styles.passwordContainer}>
          <View style={styles.inputContainer}>
            <Image source={require('../assets/password_icon.png')} style={styles.icon} />
            <TextInput
              placeholder="Mot de passe"
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
            <CheckBox value={rememberMe} onValueChange={handleRememberMeChange} />
            <Text style={styles.rememberMeText}>Se souvenir de moi</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <Button
          onPress={handleLogin}
          value="Se connecter"
          style={[styles.loginButton, { backgroundColor: colors.primary }]}
          textStyle={styles.loginButtonText}
        />

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Ou</Text>
          <View style={styles.line} />
        </View>

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
    marginLeft: 8,
    color: colors.tertiary
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  orText: {
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
