import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import EditProfile from '../screens/EditProfile';


jest.mock('@react-native-community/checkbox');

describe('EditProfile Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<EditProfile />);
    expect(getByText("Personnalisation de la page profile")).toBeTruthy();
  });
});
