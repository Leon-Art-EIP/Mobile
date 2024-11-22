import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import Settings from '../screens/Settings/Settings';
import '@testing-library/jest-native/extend-expect'; // Importez cette ligne pour étendre les capacités de JestMatchers
jest.mock('@react-native-community/checkbox');

describe('Settings Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Settings />);
    expect(getByText("Réglages")).toBeTruthy();
  });
});
