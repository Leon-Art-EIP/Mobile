import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Alert, RefreshControl, ActivityIndicator, ToastAndroid } from 'react-native';
import Button from '../components/buttons/Button';
import Input from '../components/textInput/Input';
import Title from '../components/text/Title';
import colors from "../constants/colors";
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgGrey, br12, br20, cError, flex1, flexRow, mbAuto, mh24, mtAuto, ph24, ph8 } from '../constants/styles';
import { post } from '../constants/fetch';

const ForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailOkay, setIsEmailOkay] = useState<boolean>(false);


  const isEmailFormatOkay = (text: string = ""): boolean => {
    if (!text) {
      setIsEmailOkay(false);
      return false
    }

    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    const resp: boolean = !!emailRegex.test(text);
    setIsEmailOkay(resp);
    return resp;
  }


  const handleResetPassword = () => {
    if (!isEmailFormatOkay(email)) {
      return setError("Votre email est invalide");
    }

    setIsLoading(true);
    post(
      '/api/auth/request-reset',
      { email: email?.toLowerCase() },
      undefined,
      (res: any) => {
        navigation.navigate('login');
        ToastAndroid.show(
          "Vous allez recevoir un email sous peu",
          ToastAndroid.SHORT
        );
        return setIsLoading(false);
      },
      (err: any) => {
        setIsLoading(false);
        if (err.response.status === 404) {
          return setError("L'adresse email n'a pas été trouvée");
        }
        return setError("Une errreur est survenue. Veuillez réessayer plus tard");
      }
    );
  };


  useEffect(() => {
    isEmailFormatOkay(email);
  }, [email]);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.bg} />

      <View style={[mtAuto, mbAuto, bgGrey, ph8, br20]}>
        <Title style={styles.forgotPasswordTitle}>Mot de passe oublié</Title>

        <Input
          placeholder="Email"
          onTextChanged={setEmail}
          style={[
            styles.input,
            { borderWidth: isEmailOkay ? 0 : 2}
          ]}
        />

        { isLoading && (
          <ActivityIndicator
            size={32}
            color={colors.primary}
          />
        ) }

        { !!error && (
          <Text style={[cError, mh24]}>
            { error }
          </Text>
        ) }

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
            disabled={!(isEmailOkay && !isLoading)}
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
    borderColor: colors.primary,
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
