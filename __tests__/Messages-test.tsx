import React from 'react';
import 'react-native';
import App from '../App';
import {expect, jest, test} from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';


jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');


it('navigates to inbox', () => {
  const { getByText } = render(<App />);
  fireEvent.press(getByText('messages'));
  const title = getByText('Messagerie');
  expect(title).toBeDefined();
});


it('navigates to conversation', () => {
  const { getByText } = render(<App />);

  // navigates to inbox
  fireEvent.press(getByText('messages'));
  fireEvent.press(getByText('Marine Weber'));

  const question = getByText('Bonjour, je serais intéressé par cette oeuvre, mais je recherche une ambiance plus chaude. Serait-ce possible ? Merci !');
  const answer = getByText('Yes of course !');
  const offer = getByText('Vous avez reçu une offre à');
  const refuseBtn = getByText('Refuser');
  const acceptBtn = getByText('Accepter');

  expect(refuseBtn).toBeTruthy();
  expect(acceptBtn).toBeTruthy();
  expect(question).toBeTruthy();
  expect(answer).toBeTruthy();
  expect(offer).toBeTruthy();
});


it('writes something in the input when we type something', () => {
  // render app
  const { getByPlaceholderText, getByText } = render(<App />);

  // navigates to conversation screen
  fireEvent.press(getByText('messages'));
  fireEvent.press(getByText('Marine Weber'));

  // test the input
  const msgInput = getByPlaceholderText('Message ...');
  fireEvent.changeText(msgInput, "Hello World!");
  expect(msgInput.props.value).toBe("Hello World!");
});


it('displays timestamp when bubble is pressed', () => {
  const { getByText, queryByText } = render(<App />);

  // navigates to conversation screen
  fireEvent.press(getByText('messages'));
  fireEvent.press(getByText('Marine Weber'));

  // verifies timestamps are not here by default
  const timestamp1 = queryByText('2:34 PM');
  expect(timestamp1).toBeNull();

  // presses on a bubble
  const answer = getByText('Yes of course !');
  fireEvent.press(answer);

  // verifies timestamp appears
  const timestamp2 = queryByText('2:34 PM');
  expect(timestamp2).toBeDefined();
});
