import React from 'react';
import 'react-native';
import App from '../App';
import {expect, jest, test} from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';


jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');


// Test if navigation to inbox is working
it('navigates to inbox', () => {
  const { getByText } = render(<App />);
  fireEvent.press(getByText('messages'));
  const title = getByText('Messagerie');
  expect(title).toBeDefined();
});


// Once in inbox, test if navigation to conversation is working
it('navigates to conversation', () => {
  const { getByText } = render(<App />);

  // navigates to inbox
  fireEvent.press(getByText('messages'));

  fireEvent.press(getByText('Marine Weber'));
  const loadMore = getByText('Charger plus de messages');
  expect(loadMore).toBeDefined();
});
