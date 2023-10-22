import React, { useEffect, useState } from 'react';
import { Alert, Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import { get, post } from '../constants/fetch';
import Button, { ButtonProps } from '../components/Button';
import Input, { InputProps } from '../components/Input';
import Title, { TitleProps } from '../components/Title';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:5000/api/follow/652bc1fb1753a08d6c7d3f5d', {
        
      });
  
      // Si la requête réussit, le backend devrait renvoyer un JWT dans la réponse.
      const token = response.data.token;
  
      // Stocker le token dans AsyncStorage pour une utilisation ultérieure.
      await AsyncStorage.setItem('jwt', token);
  
      // Rediriger l'utilisateur vers la page d'accueil.
      navigation.navigate('main'); // Remplacez 'HomeScreen' par le nom de votre écran d'accueil.
  
    } catch (error) {
      console.error('Erreur de connexion :', error);
      Alert.alert('Erreur de connexion', 'Vérifiez vos identifiants et réessayez.');
    }
  };

  const handleGoogleLogin = () => {
    // Logique de connexion avec Google ici
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

  const handleRecover = () => navigation.navigate('recover');

  return (
    <View style={styles.container}>
      <Title style={styles.title}>LeonArt</Title>

      <Input
        placeholder="Enter your email"
        onTextChanged={handleEmailChange}
        style={styles.input}
      />

      <Input
        placeholder="Enter your password"
        onTextChanged={handlePasswordChange}
        style={styles.input}
        // secureTextEntry
      />

      <Button
        onPress={handleLogin}
        value="Login"
        style={styles.loginButton}
        textStyle={styles.loginButtonText}
      />

      <Text style={styles.orText}>Or</Text>
      { error && (
        <Text style={styles.errorText}>{ error }</Text>
      ) }

      <Button
        onPress={handleGoogleLogin}
        value="Login with Google"
        style={styles.googleButton}
        textStyle={styles.googleButtonText}
      />

      <View style={{ flexDirection: "row" }}>
        <Button
          onPress={handleRegister}
          value="Register"
          secondary
        />

        <Button
          onPress={handleRecover}
          value="Forgot password"
          tertiary
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginVertical: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  orText: {
    fontSize: 16,
    marginBottom: 16,
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
  errorText: {
    fontSize: 14,
    color: colors.error
  }
});

export default Login;
