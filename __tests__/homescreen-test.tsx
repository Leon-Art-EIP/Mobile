import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

// Mockez les dépendances externes si nécessaire
jest.mock('@react-native-community/checkbox');

describe('HomeScreen Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    // Vérifiez si certains éléments sont rendus correctement
    expect(getByText("Leon")).toBeTruthy();
    expect(getByText("'Art")).toBeTruthy();
    expect(getByText("Actualités")).toBeTruthy();
    expect(getByText("Artistes")).toBeTruthy();
    expect(getByText("Pour vous")).toBeTruthy();
  });

  // it('handles navigation to artist profile correctly', () => {
  //   const { getByText } = render(<HomeScreen />);

  //   // Utilisez fireEvent pour simuler un clic sur un artiste
  //   fireEvent.press(getByText("Nom de l'artiste")); // Remplacez par le nom de l'artiste approprié

  //   // Vérifiez si la navigation vers le profil de l'artiste est déclenchée
  //   // Assurez-vous que votre composant ArtistCard déclenche la navigation correctement
  //   // Vous pouvez également vérifier si le composant "other_profile" est rendu
  //   expect(/* Vérifiez ici si la navigation vers le profil de l'artiste est déclenchée */).toBeTruthy();
  // });

  // Ajoutez d'autres tests pour les autres fonctionnalités de votre composant
});
