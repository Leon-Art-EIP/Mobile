import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from '../screens/Login';


jest.mock('@react-native-community/checkbox');

describe('Login Component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Login />);

    expect(getByText('Connexion')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
  });

  it('handles email input correctly', () => {
    const { getByPlaceholderText } = render(<Login />);
    const emailInput = getByPlaceholderText('Email');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('handles password input correctly', () => {
    const { getByPlaceholderText } = render(<Login />);
    const passwordInput = getByPlaceholderText('Mot de passe');

    
    fireEvent.changeText(passwordInput, 'password123');

    
    expect(passwordInput.props.value).toBe('password123');
  });
});
