import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ComponentsShow from '../screens/ComponentsShow';




describe('ComponentsShow Component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<ComponentsShow />);

    expect(getByText("Buttons")).toBeTruthy();
    expect(getByText("Big title")).toBeTruthy();
    expect(getByText("Bold title")).toBeTruthy();
    expect(getByText("Medium title")).toBeTruthy();
    expect(getByText("Small title")).toBeTruthy();
    expect(getByText("Extra Small title")).toBeTruthy();
    expect(getByText("Inputs")).toBeTruthy();
    expect(getByPlaceholderText("Your text here")).toBeTruthy();
  });

  it('handles button clicks correctly', () => {
    const { getByText } = render(<ComponentsShow />);

    fireEvent.press(getByText("primary"));
    fireEvent.press(getByText("secondary"));
    fireEvent.press(getByText("tertiary"));
  });
});
