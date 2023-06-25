import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import Button from '../components/Button';
import Input from '../components/Input';
import Title from '../components/Title';
import colors from '../constants/colors';

const Signup = ({ navigation }: any) => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [fullName, setFullName] = useState<string | undefined>(undefined);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSignup = () => {
    // handle signup logic here
  };

  const handleLoginNavigation = () => {
    navigation.navigate('login');
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleFullNameChange = (value: string) => {
    setFullName(value);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>LeonArt</Title>
      <Title style={styles.signupTitle}>Sign Up</Title>

      <Input
        placeholder="E-mail"
        onTextChanged={handleEmailChange}
        style={styles.input}
      />

      <Input
        placeholder="Full Name"
        onTextChanged={handleFullNameChange}
        style={styles.input}
      />

      <Input
        placeholder="Phone"
        onTextChanged={handlePhoneChange}
        style={styles.input}
      />

      <Button
        onPress={handleSignup}
        value="Continue"
        style={styles.signupButton}
        textStyle={styles.signupButtonText}
      />

      { error && (
        <Text style={styles.errorText}>{ error }</Text>
      ) }

      <View style={{ flexDirection: "row" }}>
        <Text style={styles.alreadyJoinedText}>Joined us before ?</Text>
        <TouchableOpacity onPress={handleLoginNavigation}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
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
  signupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  signupButton: {
    marginVertical: 16,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alreadyJoinedText: {
    fontSize: 14,
    marginRight: 8,
  },
  loginText: {
    fontSize: 14,
    color: 'blue',
  },
  errorText: {
    fontSize: 14,
    color: colors.error
  }
});

export default Signup;
