import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizzArtist2 from '../../screens/ProfilingQuizzArtist2'; 

describe('ProfilingQuizzArtist2 Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist2 />);

    expect(getByText('2/3 - Souhaitez-vous proposer des créations personnalisées ?')).toBeTruthy();
    expect(getByText('Suivant')).toBeTruthy();
  });

  it('handles customCommands selection correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist2 />);
    const ouiButton = getByText('Oui');
    fireEvent.press(ouiButton);
    expect(getByText('Oui')).toBeTruthy();

  });
  it('handles "Suivant" button click correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist2 />);
    
    const suivantButton = getByText('Suivant');
    fireEvent.press(suivantButton);
  });
});
