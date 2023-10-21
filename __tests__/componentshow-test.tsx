import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ComponentsShow from '../screens/ComponentsShow';

// Mockez les dépendances externes si nécessaire
// jest.mock('@react-native-community/checkbox');

describe('ComponentsShow Component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<ComponentsShow />);

    // Vérifiez si certains éléments sont rendus correctement
    expect(getByText("Buttons")).toBeTruthy();
    expect(getByText("Big title")).toBeTruthy();
    expect(getByText("Bold title")).toBeTruthy();
    expect(getByText("Medium title")).toBeTruthy();
    expect(getByText("Small title")).toBeTruthy();
    expect(getByText("Extra Small title")).toBeTruthy();
    expect(getByText("Inputs")).toBeTruthy();
    expect(getByPlaceholderText("Your text here")).toBeTruthy();
  });

  it('handles button clicks correctly', () => {
    const { getByText } = render(<ComponentsShow />);

    // Utilisez fireEvent pour simuler des clics sur les boutons
    fireEvent.press(getByText("primary"));
    fireEvent.press(getByText("secondary"));
    fireEvent.press(getByText("tertiary"));

    // Ajoutez des assertions pour vérifier le comportement attendu après les clics
    // Par exemple, vérifiez si les actions appropriées sont déclenchées après les clics
    // ou si les styles des boutons changent comme prévu.
  });

  // Ajoutez d'autres tests en fonction des fonctionnalités de votre composant
});
