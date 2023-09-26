import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ForgotPassword from '../screens/ForgotPassword';

// Mockez les dépendances externes si nécessaire
jest.mock('@react-native-community/checkbox');

describe('ForgotPassword Component', () => {
  it('renders correctly', () => {
    // Utilisez "render" pour rendre le composant
    const { getByText, getByPlaceholderText } = render(<ForgotPassword />);

    // Vérifiez si certains éléments sont rendus correctement
    expect(getByText("Mot de passe oublié")).toBeTruthy();
    expect(getByText("Soumettre")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByText("Retourner à la")).toBeTruthy();
    expect(getByText("connexion")).toBeTruthy();
  });

  it('handles input change correctly', () => {
    const { getByPlaceholderText } = render(<ForgotPassword />);

    // Simulez la saisie d'une adresse e-mail
    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");

    // Vérifiez si la valeur de l'input a été mise à jour
    expect(getByPlaceholderText("Email").props.value).toBe("test@example.com");
  });

  // Ajoutez d'autres tests en fonction des fonctionnalités de votre composant
});
