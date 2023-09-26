import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizz from '../../screens/ProfilingQuizz'; // Update the path

describe('ProfilingQuizz Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizz />);
    
    // Check if specific text elements are present
    expect(getByText('Bienvenue !')).toBeTruthy();
    expect(getByText("Avec Leon'Art vous souhaitez...")).toBeTruthy();

    // Check if buttons are present and test data-testid
    expect(getByTestId('discover')).toBeTruthy();
    expect(getByTestId('sell')).toBeTruthy();
    expect(getByTestId('both')).toBeTruthy();
  });

  it('handles button clicks correctly', () => {
    const { getByTestId } = render(<ProfilingQuizz />);
    
    // Simulate button clicks
    fireEvent.press(getByTestId('discover'));
    fireEvent.press(getByTestId('sell'));
    fireEvent.press(getByTestId('both'));

    // Add assertions here to test the expected behavior after button clicks
  });
});
