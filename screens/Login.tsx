import React, { useEffect } from 'react';
import { Text } from 'react-native'
import { get } from '../constants/fetch';

const Login = () => {
  const onPageRendered = () => {
    get('/api/auth/login', (response: any) => {
      console.log('Response: ', response);
    });
  }


  useEffect(onPageRendered, []);


  return (
    <Text>Login</Text>
  );
}

export default Login;
