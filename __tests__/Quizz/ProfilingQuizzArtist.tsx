import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizzArtist from '../../screens/ProfilingQuizzArtist1'; // Adjust the import path as needed

describe('ProfilingQuizzArtist Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist />);

    // Test if the component renders without errors
    expect(getByText('1/3 - Que comptez-vous vendre ?')).toBeTruthy();
    expect(getByText('Suivant')).toBeTruthy();
  });

  it('handles purpose selection correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist />);
    
    // Example: Select the "Peinture" tag
    const peintureButton = getByText('Peinture');
    fireEvent.press(peintureButton);
    
    // Test if the selected tag has the correct text
    expect(getByText('Peinture')).toBeTruthy();

    // TODO: Add similar tests for other tag selections
  });

  it('handles "Suivant" button click correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzArtist />);
    
    // Example: Click the "Suivant" button
    const suivantButton = getByText('Suivant');
    fireEvent.press(suivantButton);
    
    // TODO: Add assertions to test the behavior after clicking the button
  });

//   it('handles "Retour" button click correctly', () => {
//     const { getByText, getByTestId } = render(<ProfilingQuizzArtist />);
    
//     // Example: Click the "Retour" button
//     const retourButton = getByText('Retour');
//     fireEvent.press(retourButton);
    
//     // TODO: Add assertions to test the behavior after clicking the button
//   });
});
