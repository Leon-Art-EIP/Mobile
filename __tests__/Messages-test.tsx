import React from 'react';
import 'react-native';
import App from '../App';
import {expect, jest, test} from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { dateToHour } from '../helpers/DateHelper';
import HomeScreen from '../screens/HomeScreen';
import InboxScreen from '../screens/InboxScreen';
import { NavigationContainer } from '@react-navigation/native';
import MessageNavigator from '../navigators/MessageNavigator';


/* it('navigates to inbox', () => { */
/*   const { getByText } = render(<HomeScreen />); */
/*   fireEvent.press(getByText('messages')); */
/*   const title = getByText('Messagerie'); */
/*   expect(title).toBeDefined(); */
/* }); */

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

it('navigates to conversation', () => {
  const { getByText, getByTestId } = render(
    <App noLogin />
  );

  fireEvent.press(getByTestId('MessagesNavBtn'));


  /* fireEvent.press(getByText('messages')); */
  fireEvent.press(getByText('Cedric'));

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


/* it('writes something in the input when we type something', () => { */
/**/
/*   const { getByPlaceholderText, getByText } = render(<HomeScreen />); */
/**/
/**/
/*   fireEvent.press(getByText('messages')); */
/*   fireEvent.press(getByText('Marine Weber')); */
/**/
/**/
/*   const msgInput = getByPlaceholderText('Message ...'); */
/*   fireEvent.changeText(msgInput, "Hello World!"); */
/*   expect(msgInput.props.value).toBe("Hello World!"); */
/* }); */
/**/
/**/
/* it('displays timestamp when bubble is pressed', () => { */
/*   const { getByText, queryByText } = render(<HomeScreen />); */
/**/
/**/
/*   fireEvent.press(getByText('messages')); */
/*   fireEvent.press(getByText('Marine Weber')); */
/**/
/**/
/*   const timestamp1 = queryByText(dateToHour((new Date).getTime())); */
/*   expect(timestamp1).toBeNull(); */
/**/
/**/
/*   const answer = getByText('Yes of course !'); */
/*   fireEvent.press(answer); */
/**/
/**/
/*   const timestamp2 = queryByText(dateToHour((new Date).getTime())); */
/*   expect(timestamp2).toBeDefined(); */
/* }); */
