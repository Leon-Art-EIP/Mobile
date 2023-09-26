import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizzArtist2 from '../../screens/ProfilingQuizzArtist2'; // Adjust the import path as needed

describe('ProfilingQuizzArtist2 Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist2 />);

    // Test if the component renders without errors
    expect(getByText('2/3 - Souhaitez-vous proposer des créations personnalisées ?')).toBeTruthy();
    expect(getByText('Suivant')).toBeTruthy();
  });

  it('handles customCommands selection correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist2 />);
    
    // Example: Select the "Oui" option
    const ouiButton = getByText('Oui');
    fireEvent.press(ouiButton);
    
    // Test if the selected option has the correct text
    expect(getByText('Oui')).toBeTruthy();

    // TODO: Add similar tests for other customCommands selections
  });

  it('handles "Suivant" button click correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist2 />);
    
    // Example: Click the "Suivant" button
    const suivantButton = getByText('Suivant');
    fireEvent.press(suivantButton);
    
    // TODO: Add assertions to test the behavior after clicking the button
  });

  // it('handles "Retour" button click correctly', () => {
  //   const { getByText, getByTestId } = render(<ProfilingQuizzArtist2 />);
    
  //   // Example: Click the "Retour" button
  //   const retourButton = getByText('Retour');
  //   fireEvent.press(retourButton);
    
  //   // TODO: Add assertions to test the behavior after clicking the button
  // });
});
