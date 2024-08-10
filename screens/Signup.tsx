import React, { useState, useContext, useEffect } from 'react';
import { Alert, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MainContext } from '../context/MainContext';

import Button from '../components/buttons/Button';
import Input from '../components/textInput/Input';
import Title from '../components/text/Title';
import colors from '../constants/colors';


const API_URL: string | undefined = process.env.REACT_APP_API_URL;


const Signup = ({ navigation }: any) => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [password2, setPassword2] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const context = useContext(MainContext);

  const handleSignup = () => {
    const requestData = { username, email, password };

    if (password !== password2) {
      return setError("Les mots de passe ne matchent pas");
    }

    axios.post(`${API_URL}/api/auth/signup`, requestData)
      .then(async response => {
        if (response && response.data && response.data.token) {
          const tokenFromDB = response.data.token;
          console.log('Server response', response.data);
          console.log('Token from DB:', tokenFromDB);

          try {
            await AsyncStorage.setItem('jwt', tokenFromDB);
            navigation.navigate('profilingquizz');
          } catch (error) {
            console.error('Error storing token:', error);
            Alert.alert('Signup Failed');
          }
        } else {
          console.error('Invalid response format: ', response);
          Alert.alert('Signup Failed', 'Invalid response format');
        }
      })
      .catch(error => {
        if (error.response) {
          console.error('Server responded with an error:', error.response.data);
          if (error.response.status === 422) {
            console.error('Validation error. Please check your input data.');
            Alert.alert('Signup Failed', 'Validation error. Please check your input data.');
          } else if (error.response.status === 409) {
            console.error("Email address already in use: ", email);
            return Alert.alert("Erreur", "Cette adresse est déjà utilisée");
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


  const handleLoginNavigation = () => {
    navigation.navigate('login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Title style={{color: colors.primary, fontSize: 70 }}>Leon</Title>
        <Title style={{fontSize: 70}}>'Art</Title>
      </View>
      <Title style={styles.signupTitle}>Inscription</Title>

      <Input
        placeholder="Nom d'utilisateur"
        onTextChanged={setUsername}
        style={styles.input}
      />

      <Input
        placeholder="Email"
        onTextChanged={setEmail}
        style={styles.input}
      />

      <Input
        placeholder="Mot de passe"
        secureTextEntry
        onTextChanged={setPassword}
        style={styles.input}
      />

      <Input
        placeholder="Retapez votre mot de passe"
        secureTextEntry
        onTextChanged={setPassword2}
        style={styles.input}
      />

      { error && (
        <Text style={{
          color: colors.error,
          marginHorizontal: 24
        }}>{ error }</Text>
      )}

      <Button
        onPress={handleSignup}
        value="Continuer"
        style={[styles.signupButton, { backgroundColor: colors.primary }]}
        textStyle={styles.signupButtonText}
      />

      <View style={styles.existingUserContainer}>
        <Text style={styles.existingUserText}>Déjà inscrit ?</Text>
        <TouchableOpacity onPress={handleLoginNavigation}>
          <Text style={styles.loginText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    marginLeft: 10,
    marginRight: 10,
  },
  signupButton: {
    marginVertical: 16,
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
    marginBottom: 24,
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
  },
});

export default Signup;
