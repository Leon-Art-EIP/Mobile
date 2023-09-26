import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import EditProfile from '../screens/EditProfile';

// Mockez les dépendances externes si nécessaire
jest.mock('@react-native-community/checkbox');

describe('EditProfile Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<EditProfile />);

    // Vérifiez si le texte "Personnalisation de la page profile" est rendu à l'écran
    expect(getByText("Personnalisation de la page profile")).toBeTruthy();
  });

  // Ajoutez d'autres tests en fonction des fonctionnalités de votre composant
});
