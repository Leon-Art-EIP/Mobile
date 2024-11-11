import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Button from '../components/buttons/Button';
import Input from '../components/textInput/Input';
import Title from '../components/text/Title';
import colors from "../constants/colors";
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgGrey, br12, br20, flex1, flexRow, mbAuto, mtAuto, ph24, ph8 } from '../constants/styles';

const ForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);


  const handleResetPassword = () => {
    //TODO Reset the fucking password wtf is this
    navigation.navigate('login');
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.bg} />

      <View style={[mtAuto, mbAuto, bgGrey, ph8, br20]}>
        <Title style={styles.forgotPasswordTitle}>Mot de passe oublié</Title>

        <Input
          placeholder="Email"
          onTextChanged={setEmail}
          style={styles.input}
        />

        <View style={[flexRow, { marginTop: 24 }]}>
          <Button
            onPress={() => navigation.goBack()}
            value="Retour"
            style={[flex1]}
            tertiary
          />
          <Button
            onPress={handleResetPassword}
            value="Soumettre"
            style={[flex1]}
            textStyle={styles.submitButtonText}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.bg,
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
    color: colors.textDark,
    marginRight: 3,
  },
  loginLinkText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: 'blue',
  },
});

export default ForgotPassword;
