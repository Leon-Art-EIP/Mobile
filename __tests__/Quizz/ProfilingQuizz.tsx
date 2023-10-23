import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizz from '../../screens/ProfilingQuizz'; 

describe('ProfilingQuizz Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizz />);
    expect(getByText('Bienvenue !')).toBeTruthy();
    expect(getByText("Avec Leon'Art vous souhaitez...")).toBeTruthy();

    expect(getByTestId('discover')).toBeTruthy();
    expect(getByTestId('sell')).toBeTruthy();
    expect(getByTestId('both')).toBeTruthy();
  });

  it('handles button clicks correctly', () => {
    const { getByTestId } = render(<ProfilingQuizz />);
    fireEvent.press(getByTestId('discover'));
    fireEvent.press(getByTestId('sell'));
    fireEvent.press(getByTestId('both'))
  });
});
