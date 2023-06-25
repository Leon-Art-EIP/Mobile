import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import { get } from '../constants/fetch';
import Button, { ButtonProps } from '../components/Button';
import Input, { InputProps } from '../components/Input';
import Title, { TitleProps } from '../components/Title';
import colors from "../constants/colors";

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

  const handleForgotPassword = () => {
    // Logique pour gérer le clic sur "Mot de passe oublié ?"
  };

  const handleRememberMeChange = (checked: boolean) => {
    // Logique pour gérer le changement de la case "Se souvenir de moi"
    setRememberMe(checked);
  };

  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Title style={{color: colors.primary, fontSize: 70 }}>Leon</Title>
        <Title style={{fontSize: 70}}>'Art</Title>
      </View>
      <Title style={styles.loginTitle}>Log In</Title>

      <Input
        placeholder="Email"
        onTextChanged={handleEmailChange}
        style={[styles.input, {marginHorizontal: 10}]}
      />

      <Input
        placeholder="Mot de passe"
        onTextChanged={handlePasswordChange}
        style={[styles.input, {marginHorizontal: 10}]}
        // secureTextEntry
      />

      <View style={styles.rememberForgotContainer}>
        <View style={styles.rememberMeContainer}>
          {/* <CheckBox
            value={rememberMe}
            onValueChange={handleRememberMeChange}
          /> */}
          <Text style={styles.rememberMeText}>Se souvenir de moi</Text>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        onPress={handleLogin}
        value="Login"
        style={[styles.loginButton, { backgroundColor: colors.primary }]}
        textStyle={styles.loginButtonText}
      />

      <Text style={styles.orText}>sOr</Text>

      <Button
        onPress={handleGoogleLogin}
        value="Login with Google"
        style={[styles.googleButton, { backgroundColor: colors.tertiary }]}
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
    alignItems: 'center',
    padding: 16,
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
    width: '100%',
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
    color: 'black',
    marginLeft: 'auto'
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 10,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: 8,
  },
});

export default Login;
