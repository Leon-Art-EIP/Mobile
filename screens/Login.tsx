import React, { useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import { get } from '../constants/fetch';
import Button, { ButtonProps } from '../components/Button';
import Input, { InputProps } from '../components/Input';
import Title, { TitleProps } from '../components/Title';

const Login = () => {
  const handleLogin = () => {
    // Logique de connexion ici
  };

  const handleGoogleLogin = () => {
    // Logique de connexion avec Google ici
  };

  const handleRegister = () => {
    // Logique d'inscription ici
  };

  const handleEmailChange = (email: string) => {
    // Logique pour gérer le changement d'e-mail
  };

  const handlePasswordChange = (password: string) => {
    // Logique pour gérer le changement de mot de passe
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>LeonArt</Title>

      <Title style={styles.loginTitle}>Login</Title>

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

      <Button
        onPress={handleGoogleLogin}
        value="Login with Google"
        style={styles.googleButton}
        textStyle={styles.googleButtonText}
      />

      <Button
        onPress={handleRegister}
        value="Register"
        style={styles.registerButton}
        textStyle={styles.registerButtonText}
      />
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
});

export default Login;