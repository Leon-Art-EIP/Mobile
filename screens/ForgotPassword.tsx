import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import Title from '../components/Title';
import colors from "../constants/colors";

const ForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleResetPassword = () => {
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
      <Title style={styles.forgotPasswordTitle}>Mot de passe oublié</Title>

      <Input
        placeholder="Email"
        onTextChanged={setEmail}
        style={styles.input}
      />

      <Button
        onPress={handleResetPassword}
        value="Soumettre"
        style={[styles.submitButton, { backgroundColor: colors.primary }]}
        textStyle={styles.submitButtonText}
      />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Retour à la </Text>
        <TouchableOpacity onPress={handleLoginNavigation}>
          <Text style={styles.loginLinkText}>connexion</Text>
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
  forgotPasswordTitle: {
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
  submitButton: {
    marginVertical: 16,
  },
  submitButtonText: {
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
  loginContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    marginRight: 3,
  },
  loginLinkText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: 'blue',
  },
});

export default ForgotPassword;
