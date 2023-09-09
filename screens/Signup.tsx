import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { get, post } from '../constants/fetch';
import Button from '../components/Button';
import Input from '../components/Input';
import Title from '../components/Title';
import colors from "../constants/colors";

const Signup = ({ navigation }: any) => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSignup = () => {
    post(
      '/api/auth/signup',
      { email, username, phone },
      () => navigation.navigate('main'),
      (error: any) => {
        console.log('réponse reçue : ', error.response.status);
        switch (error.response.status) {
          case 409: setError('Email déjà utilisé'); break;
          case 422: {
            const errorMessages = error.response.data.errors.map((e: any) => e.msg).join('\n');
            setError(errorMessages);
            break;
          }
          default: setError('Erreur serveur inattendue. Veuillez réessayer plus tard.');
        }
      }
    );
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
        placeholder="Email"
        onTextChanged={setEmail}
        style={styles.input}
      />

      <Input
        placeholder="Nom d'utilisateur"
        onTextChanged={setUsername}
        style={styles.input}
      />

      <Input
        placeholder="Téléphone"
        onTextChanged={setPhone}
        style={styles.input}
      />

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
    marginTop: 70,
    marginBottom: 40,
  },
  existingUserContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  existingUserText: {
    marginRight: 8,
  },
  loginText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: 'blue',
  },
});

export default Signup;
