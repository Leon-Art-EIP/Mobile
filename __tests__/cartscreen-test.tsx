import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CartScreen from '../screens/CartScreen';

jest.mock('@react-native-community/checkbox');

describe('CartScreen Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<CartScreen />);
    expect(getByText("Cart screen")).toBeTruthy();
  });
});
