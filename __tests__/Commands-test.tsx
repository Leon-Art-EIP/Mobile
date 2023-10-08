import React from 'react';
import 'react-native';
import App from '../App';
import {expect, jest, test} from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import colors from '../constants/colors';


jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');


it('navigates to commands', () => {
  const { getByText, queryByText } = render(<App />);

  // navigates to command screen
  fireEvent.press(getByText('messages'));
  fireEvent.press(getByText('Commandes'));

  const command = queryByText("Mer de nuages");
  expect(command).toBeDefined();
});
