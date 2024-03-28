// Login.txt

import React, { useState, useContext } from 'react';
import { Alert, Text, StyleSheet, View, TextInput, TouchableOpacity, Image, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../components/Button';
import Title from '../components/Title';
import CheckBox from '@react-native-community/checkbox';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';

const Login = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MainContext);

  // Define a hardcoded token
  const hardcodedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVhMjc3Y2M0NDg2YzVlMGZiMjA4OTkzIn0sImlhdCI6MTcxMTU5MzIzNiwiZXhwIjoxNzExOTUzMjM2fQ.WdpnG59t_DpBGQIIlbXOiWUr0KqDvpwehVxiwbfXM4c';

  // Modified onLogin function to use hardcoded token
  const onLogin = async () => {
    try {
      await AsyncStorage.setItem('jwt', hardcodedToken);
      context?.setToken(hardcodedToken);
      // If you have user ID or other user details, set them here as well
      // context?.setUserId('your_user_id');
      navigation.navigate('main');
    } catch (error) {
      console.error('Error storing token:', error);
      Alert.alert('Login Failed', 'Error storing token');
    }
  };

  // Replace the handleLogin function
  const handleLogin = () => {
    setIsLoading(true);
    onLogin(); // Directly call onLogin with hardcoded token
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F2F2F2" />
      <SafeAreaView style={styles.safeView}>
        <View style={styles.titleView}>
          <Title style={{ color: colors.primary, fontSize: 70 }}>Leon</Title>
          <Title style={{ fontSize: 70 }}>'Art</Title>
        </View>
        <Title style={styles.loginTitle}>Connexion</Title>
        
        {isLoading && <ActivityIndicator color={colors.primary} />}

        <Button
          onPress={handleLogin}
          value="Se connecter"
          disabled={isLoading}
          style={[
            styles.loginButton,
            { backgroundColor: isLoading ? "#CA847A" : colors.primary }
          ]}
          textStyle={styles.loginButtonText}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    paddingHorizontal: 16,
    flex: 1
  },
  safeView: {
    backgroundColor: '#F2F2F2',
    width:  '100%',
    height: Dimensions.get('window').height
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
  }
});


export default Login;