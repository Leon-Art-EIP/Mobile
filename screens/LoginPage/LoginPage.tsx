import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { get } from '../../constants/fetch';
import Button, { ButtonProps } from '../../components/Button';
import Input, { InputProps } from '../../components/Input';
import Title, { TitleProps } from '../../components/Title';
import CheckBox from '@react-native-community/checkbox';
import colors from '../../constants/colors';

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

  const handleRememberMeChange = () => {
    // Logique pour gérer le changement de la case "Se souvenir de moi"
    setRememberMe(!rememberMe);
  };

  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Title style={{ color: colors.primary, fontSize: 70 }}>Leon</Title>
        <Title style={{ fontSize: 70 }}>'Art</Title>
      </View>
      <Title style={styles.loginTitle}>Connexion</Title>

      <Input
        placeholder="Email"
        onTextChanged={handleEmailChange}
        style={[styles.input]}
      />

      <Input
        placeholder="Mot de passe"
        onTextChanged={handlePasswordChange}
        style={styles.input}
        // secureTextEntry
      />

      <TouchableOpacity onPress={handleRememberMeChange}>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={handleRememberMeChange}
          />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 10,
    marginRight: 10,
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
    color: 'black',
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
});

export default Login;
