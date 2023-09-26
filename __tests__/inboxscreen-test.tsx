import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InboxScreen from '../screens/InboxScreen';

// Mockez les dépendances externes si nécessaire
jest.mock('@react-native-community/checkbox');

describe('InboxScreen Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<InboxScreen />);
    expect(getByText("Messagerie")).toBeTruthy();
    expect(getByText("Conversations")).toBeTruthy();
    expect(getByText("Commandes")).toBeTruthy();
    expect(getByText("Panier")).toBeTruthy();
  });

  it('handles tab navigation correctly', () => {
    const { getByText } = render(<InboxScreen />);
    const conversationsTab = getByText("Conversations");
    const commandsTab = getByText("Commandes");
    const cartTab = getByText("Panier");

    // Vérifiez que l'onglet "Conversations" est actif par défaut
    expect(conversationsTab).toHaveStyle({ backgroundColor: 'lightgray' });
    expect(commandsTab).not.toHaveStyle({ backgroundColor: 'lightgray' });
    expect(cartTab).not.toHaveStyle({ backgroundColor: 'lightgray' });

    // Cliquez sur l'onglet "Commandes"
    fireEvent.press(commandsTab);

    // Vérifiez que l'onglet "Commandes" est actif
    expect(conversationsTab).not.toHaveStyle({ backgroundColor: 'lightgray' });
    expect(commandsTab).toHaveStyle({ backgroundColor: 'lightgray' });
    expect(cartTab).not.toHaveStyle({ backgroundColor: 'lightgray' });

    // Cliquez sur l'onglet "Panier"
    fireEvent.press(cartTab);

    // Vérifiez que l'onglet "Panier" est actif
    expect(conversationsTab).not.toHaveStyle({ backgroundColor: 'lightgray' });
    expect(commandsTab).not.toHaveStyle({ backgroundColor: 'lightgray' });
    expect(cartTab).toHaveStyle({ backgroundColor: 'lightgray' });
  });
});
