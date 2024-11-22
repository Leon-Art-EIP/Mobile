import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OtherProfile from '../screens/OtherProfile';


jest.mock('@react-native-community/checkbox');

describe('OtherProfile Component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<OtherProfile />);
    expect(getByText("Suivre")).toBeTruthy();
    expect(getByText("Ecrire")).toBeTruthy();
  });

  it('handles tab navigation correctly', () => {
    const { getByText } = render(<OtherProfile />);
    expect(getByText("Artwork")).toBeTruthy();
    expect(getByText("Collection")).toBeTruthy();
    expect(getByText("A propos")).toBeTruthy();
  });
});
