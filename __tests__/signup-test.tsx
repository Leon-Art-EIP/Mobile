import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Signup from '../screens/Signup';

jest.mock('@react-native-community/checkbox');
describe('Signup Component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Signup />);
    expect(getByText("Continuer")).toBeTruthy();
    expect(getByText("Déjà inscrit ?")).toBeTruthy();
    expect(getByText("Se connecter")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Nom d'utilisateur")).toBeTruthy();
    expect(getByPlaceholderText("Téléphone")).toBeTruthy();
  });

  it('handles signup correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Signup />);
    const emailInput = getByPlaceholderText("Email");
    const usernameInput = getByPlaceholderText("Nom d'utilisateur");
    const phoneInput = getByPlaceholderText("Téléphone");
    const continueButton = getByText("Continuer");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(usernameInput, "testuser");
    fireEvent.changeText(phoneInput, "1234567890");
    expect(emailInput.props.value).toBe("test@example.com");
    expect(usernameInput.props.value).toBe("testuser");
    expect(phoneInput.props.value).toBe("1234567890");
    fireEvent.press(continueButton);
  });
});
