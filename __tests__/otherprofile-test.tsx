import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OtherProfile from '../screens/OtherProfile';

// Mockez les dépendances externes si nécessaire
jest.mock('@react-native-community/checkbox');

describe('OtherProfile Component', () => {
  it('renders correctly', () => {
    // Utilisez "render" pour rendre le composant
    const { getByText, getByPlaceholderText } = render(<OtherProfile />);

    // Vérifiez si certains éléments sont rendus correctement
    expect(getByText("Suivre")).toBeTruthy();
    expect(getByText("Ecrire")).toBeTruthy();
  });

  it('handles tab navigation correctly', () => {
    const { getByText } = render(<OtherProfile />);

    // Vérifiez si les boutons d'onglet "Artwork", "Collection" et "A propos" sont présents
    expect(getByText("Artwork")).toBeTruthy();
    expect(getByText("Collection")).toBeTruthy();
    expect(getByText("A propos")).toBeTruthy();

    // Cliquez sur le bouton "Collection" pour vérifier s'il devient actif
    // fireEvent.press(getByText("Collection"));
    // expect(getByText("Collection")).toHaveStyle({ backgroundColor: 'lightgray' });
    // expect(getByText("Collection")).to

    // // Cliquez sur le bouton "Artwork" pour vérifier s'il devient actif
    // fireEvent.press(getByText("Artwork"));
    // expect(getByText("Artwork")).toHaveStyle({ backgroundColor: 'lightgray' });
  });

  // Ajoutez d'autres tests en fonction des fonctionnalités de votre composant
});
