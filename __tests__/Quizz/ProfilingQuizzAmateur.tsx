import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizzAmateur from '../../screens/ProfilingQuizzAmateur1';

// describe('ProfilingQuizzAmateur Component', () => {
//   it('renders correctly', () => {
//     const { getByText, getByTestId } = render(<ProfilingQuizzAmateur />);
    
//     // Ensure that the component renders without errors
//     expect(getByText('1/3 - Quel type d\'art vous intéresse ?')).toBeTruthy();
//     expect(getByTestId('peinture-tag')).toBeTruthy();
//     expect(getByTestId('calligraphie-tag')).toBeTruthy();
//     // Add similar expectations for other tags
//   });

//   it('handles tag selection', () => {
//     const { getByTestId } = render(<ProfilingQuizzAmateur />);
//     const peintureTag = getByTestId('peinture-tag');
//     const calligraphieTag = getByTestId('calligraphie-tag');
    
//     // Simulate tag presses
//     fireEvent.press(peintureTag);
//     fireEvent.press(calligraphieTag);
    
//     // Add assertions for the expected behavior after tag selection
//   });

//   it('handles "Oui" toggle', () => {
//     const { getByTestId } = render(<ProfilingQuizzAmateur />);
//     const ouiToggle = getByTestId('oui-toggle');
    
//     // Simulate toggle press
//     fireEvent.press(ouiToggle);
    
//     // Add assertions for the expected behavior after toggle press
//   });

//   it('handles "Suivant" button click', () => {
//     const { getByText } = render(<ProfilingQuizzAmateur />);
//     const suivantButton = getByText('Suivant');
    
//     // Simulate button click
//     fireEvent.press(suivantButton);
    
//     // Add assertions for the expected behavior after button click
//   });

//   it('handles "Retour" button click', () => {
//     const { getByText } = render(<ProfilingQuizzAmateur />);
//     const retourButton = getByText('Retour');
    
//     // Simulate button click
//     fireEvent.press(retourButton);
    
//     // Add assertions for the expected behavior after button click
//   });

  // Add more test cases as needed
// });
