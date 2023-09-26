import 'react-native';
import React from 'react';
import App from '../App';

import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

it('renders correctly', () => {
  const { getByTestId } = render(<App />);
});

/*it('returns an error if the login form is incorrect', () => {
  render(<App />);

  const emailInput = screen.getByPlaceholderText('Enter your email');
  const pswInput = screen.getByPlaceholderText('Enter your password');
  const login = screen.getByText('Login');

  fireEvent.changeText(emailInput, { target: { value: "test" }});
  fireEvent.changeText(pswInput, { target: { value: "test" }});
  fireEvent.press(login);
  waitFor(() => expect(screen.getByText('Invalid password or email')).toBeTruthy());
})*/

// it('has the required components', () => {
//   render(<App />);

//   expect(screen.getByText('primary')).toBeTruthy();
//   expect(screen.getByText('secondary')).toBeTruthy();
//   expect(screen.getByText('tertiary')).toBeTruthy();

//   expect(screen.getByText('Big title')).toBeTruthy();
//   expect(screen.getByText('Bold title')).toBeTruthy();
//   expect(screen.getByText('Medium title')).toBeTruthy();
//   expect(screen.getByText('Small title')).toBeTruthy();
//   expect(screen.getByText('Extra Small title')).toBeTruthy();
// });

// it('navigates to the components show screen when the button is pressed', () => {
//   render(<App />);

//   const button = screen.getByText('Show Components');
//   fireEvent.press(button);

//   expect(screen.getByText('ComponentsShow')).toBeTruthy();
// });
