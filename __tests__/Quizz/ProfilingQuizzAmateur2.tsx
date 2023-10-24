import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizzAmateur2 from '../../screens/ProfilingQuizzAmateur2'; 

describe('ProfilingQuizzAmateur2 Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzAmateur2 />);

    expect(getByText('2/3 - Quel est votre budget ?')).toBeTruthy();
    expect(getByText('Suivant')).toBeTruthy();
  });

  it('handles budget selection correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzAmateur2 />);
    const budgetButton = getByText('0 - 100€');
    fireEvent.press(budgetButton);
    expect(getByText('0 - 100€')).toBeTruthy();
  });

  it('handles "Suivant" button click correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzAmateur2 />);
    
    const suivantButton = getByText('Suivant');
    fireEvent.press(suivantButton);
  });
});