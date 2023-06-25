/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// We're replacing the react-test-renderer with the react-native testing library
import { render } from '@testing-library/react-native';


jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');


it('renders correctly', () => {
  // Use the `render` function from the react-native testing library
  const { getByTestId } = render(<App />);

});
