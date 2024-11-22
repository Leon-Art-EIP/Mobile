import 'react-native';
import React from 'react';
import App from '../App';

import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';


jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');


it('renders correctly', () => {
  const { getByTestId } = render(<App />);
});