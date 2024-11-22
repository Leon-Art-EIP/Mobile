import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizzArtist from '../../screens/ProfilingQuizzArtist1'; 

describe('ProfilingQuizzArtist Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist />);
    expect(getByText('1/3 - Que comptez-vous vendre ?')).toBeTruthy();
    expect(getByText('Suivant')).toBeTruthy();
  });

  it('handles purpose selection correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist />);
    const peintureButton = getByText('Peinture');
    fireEvent.press(peintureButton);
    
    expect(getByText('Peinture')).toBeTruthy();
  });

  it('handles "Suivant" button click correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist />);
    
    const suivantButton = getByText('Suivant');
    fireEvent.press(suivantButton);
  });
});
