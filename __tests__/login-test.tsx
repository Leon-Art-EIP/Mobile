import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from '../screens/LoginPage/LoginPage';

// Mockez les dépendances externes si nécessaire
jest.mock('@react-native-community/checkbox');

describe('Login Component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Login />);

    // Vérifiez si certains éléments sont rendus correctement
    expect(getByText('Connexion')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
  });

  it('handles email input correctly', () => {
    const { getByPlaceholderText } = render(<Login />);
    const emailInput = getByPlaceholderText('Email');

    // Utilisez fireEvent pour simuler une saisie d'email
    fireEvent.changeText(emailInput, 'test@example.com');

    // Vérifiez si la valeur de l'input a été mise à jour
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('handles password input correctly', () => {
    const { getByPlaceholderText } = render(<Login />);
    const passwordInput = getByPlaceholderText('Mot de passe');

    // Utilisez fireEvent pour simuler une saisie de mot de passe
    fireEvent.changeText(passwordInput, 'password123');

    // Vérifiez si la valeur de l'input a été mise à jour
    expect(passwordInput.props.value).toBe('password123');
  });

  // Vous pouvez ajouter plus de tests pour les autres fonctionnalités de votre composant
});
