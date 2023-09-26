import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizzFinal from '../../screens/ProfilingQuizzFinal'; // Adjust the import path as needed

describe('ProfilingQuizzFinal Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzFinal />);

    // Test if the component renders without errors
    expect(getByText('3/3 - Comment avez-vous découvert Leon\'Art ?')).toBeTruthy();
    expect(getByText('Terminé')).toBeTruthy();
  });

  it('handles tag selection correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzFinal />);
    
    // Example: Select the "Réseaux sociaux" tag
    const reseauxSociauxButton = getByText('Réseaux sociaux');
    fireEvent.press(reseauxSociauxButton);
    
    // Test if the selected tag has the correct text
    expect(getByText('Réseaux sociaux')).toBeTruthy();

    // TODO: Add similar tests for other tag selections
  });

  it('handles "Terminé" button click correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzFinal />);
    
    // Example: Click the "Terminé" button
    const termineButton = getByText('Terminé');
    fireEvent.press(termineButton);
    
    // TODO: Add assertions to test the behavior after clicking the button
  });
});



// import React from 'react';
// import { render, fireEvent } from '@testing-library/react-native';
// import ProfilingQuizzFinal from './ProfilingQuizzFinal';

// describe('ProfilingQuizzFinal Component', () => {
//   it('renders correctly', () => {
//     const { getByText, getByTestId } = render(<ProfilingQuizzFinal />);
    
//     // Ensure that the component renders without errors
//     expect(getByText('3/3 - Comment avez-vous découvert Leon\'Art ?')).toBeTruthy();
//     expect(getByTestId('Réseaux sociaux-tag')).toBeTruthy();
//     expect(getByTestId('Salon Professionnel-tag')).toBeTruthy();
//     // Add similar expectations for other tags
//   });

//   it('handles tag selection', () => {
//     const { getByTestId } = render(<ProfilingQuizzFinal />);
//     const réseauxSociauxTag = getByTestId('Réseaux sociaux-tag');
//     const salonProfessionnelTag = getByTestId('Salon Professionnel-tag');
    
//     // Simulate tag presses
//     fireEvent.press(réseauxSociauxTag);
//     fireEvent.press(salonProfessionnelTag);
    
//     // Add assertions for the expected behavior after tag selection
//   });

//   it('handles "Terminé" button click', () => {
//     const { getByText } = render(<ProfilingQuizzFinal />);
//     const terminéButton = getByText('Terminé');
    
//     // Simulate button click
//     fireEvent.press(terminéButton);
    
//     // Add assertions for the expected behavior after button click
//   });

//   // Add more test cases as needed
// });
