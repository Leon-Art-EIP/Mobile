import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import Button from '../../components/Button';
import Title from '../../components/Title';
import CheckBox from '@react-native-community/checkbox';
import colors from '../../constants/colors';
import eyeIcon from '../../assets/eye_icon.png';
import mailIcon from '../../assets/mail_icon.png';
import passwordIcon from '../../assets/password_icon.png';

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const requestData = { email, password };
    axios.post('http://10.0.2.2:5001/api/auth/login', requestData)
      .then(response => {
        if (response && response.data && response.data.token) {
          const tokenFromDB = response.data.token;
          console.log('Token from DB:', tokenFromDB);
          // Handle token storage here, for example using AsyncStorage or any other storage solution
        } else {
          console.error('Invalid response format: ', response);
          Alert.alert('Login Failed', 'Invalid response format');
        }
      })
      .catch(error => {
        console.error('Error fetching token:', error);
        Alert.alert('Login Failed', 'Error fetching token');
      });
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

  const handleForgotPassword = () => {
    navigation.navigate('recover');
  };

  const [rememberMe, setRememberMe] = useState(false);

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Title style={{ color: colors.primary, fontSize: 70 }}>Leon</Title>
        <Title style={{ fontSize: 70 }}>'Art</Title>
      </View>
      <Title style={styles.loginTitle}>Connexion</Title>
      <View style={styles.passwordContainer}>
        <View style={styles.inputContainer}>
          <Image source={mailIcon} style={styles.icon} />
          <TextInput
            placeholder="Email"
            onChangeText={handleEmailChange}
            style={styles.passwordInput}
          />
        </View>
      </View>
      <View style={styles.passwordContainer}>
        <View style={styles.inputContainer}>
          <Image source={passwordIcon} style={styles.icon} />
          <TextInput
            placeholder="Mot de passe"
            onChangeText={handlePasswordChange}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
          />
          {password ? (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              activeOpacity={0.7}
            >
              <Image source={eyeIcon} style={styles.eyeIconImage} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <TouchableOpacity onPress={handleRememberMeChange}>
        <View style={styles.checkboxContainer}>
          <CheckBox value={rememberMe} onValueChange={handleRememberMeChange} />
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
    backgroundColor: '#fff',
    borderRadius: 100,
    paddingHorizontal: 10,
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
    color: colors.tertiary,
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
    color: colors.tertiary
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
  passwordContainer: {
    marginBottom: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 100,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  passwordInput: {
    marginLeft: 0,
    marginRight: 0,
    flex: 1,
  },
  eyeIcon: {
    padding: 10,
  },
  eyeIconImage: {
    width: 20,
    height: 20,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },  
});

export default Login;
