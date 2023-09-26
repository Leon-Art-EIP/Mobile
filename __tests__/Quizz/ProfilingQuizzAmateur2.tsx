import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizzAmateur2 from '../../screens/ProfilingQuizzAmateur2'; // Adjust the import path as needed

describe('ProfilingQuizzAmateur2 Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzAmateur2 />);

    // Test if the component renders without errors
    expect(getByText('2/3 - Quel est votre budget ?')).toBeTruthy();
    expect(getByText('Suivant')).toBeTruthy();
  });

  it('handles budget selection correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzAmateur2 />);
    
    // Example: Select the "0 - 100€" budget
    const budgetButton = getByText('0 - 100€');
    fireEvent.press(budgetButton);
    
    // Test if the selected budget has the correct text
    expect(getByText('0 - 100€')).toBeTruthy();

    // TODO: Add similar tests for other budget selections
  });

  it('handles "Suivant" button click correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzAmateur2 />);
    
    // Example: Click the "Suivant" button
    const suivantButton = getByText('Suivant');
    fireEvent.press(suivantButton);
    
    // TODO: Add assertions to test the behavior after clicking the button
  });

  // it('handles "Retour" button click correctly', () => {
  //   const { getByText, getByTestId } = render(<ProfilingQuizzAmateur2 />);
    
  //   // Example: Click the "Retour" button
  //   const retourButton = getByText('Retour');
  //   fireEvent.press(retourButton);
    
  //   // TODO: Add assertions to test the behavior after clicking the button
  // });
});



// import React from 'react';
// import { render, fireEvent } from '@testing-library/react-native';
// import ProfilingQuizzAmateur2 from '../../screens/ProfilingQuizzAmateur2';

// describe('ProfilingQuizzAmateur2 Component', () => {
//   it('renders correctly', () => {
//     const { getByText, getByTestId } = render(<ProfilingQuizzAmateur2 />);
    
//     // Ensure that the component renders without errors
//     expect(getByText('2/3 - Quel est votre budget ?')).toBeTruthy();
//     expect(getByTestId('0-100€-tag')).toBeTruthy();
//     expect(getByTestId('100-1 000€-tag')).toBeTruthy();
//     // Add similar expectations for other tags
//   });

//   it('handles tag selection', () => {
//     const { getByTestId } = render(<ProfilingQuizzAmateur2 />);
//     const zeroTo100EuroTag = getByTestId('0-100€-tag');
//     const hundredTo1000EuroTag = getByTestId('100-1 000€-tag');
    
//     // Simulate tag presses
//     fireEvent.press(zeroTo100EuroTag);
//     fireEvent.press(hundredTo1000EuroTag);
    
//     // Add assertions for the expected behavior after tag selection
//   });

//   it('handles "Suivant" button click', () => {
//     const { getByText } = render(<ProfilingQuizzAmateur2 />);
//     const suivantButton = getByText('Suivant');
    
//     // Simulate button click
//     fireEvent.press(suivantButton);
    
//     // Add assertions for the expected behavior after button click
//   });

//   it('handles "Retour" button click', () => {
//     const { getByText } = render(<ProfilingQuizzAmateur2 />);
//     const retourButton = getByText('Retour');
    
//     // Simulate button click
//     fireEvent.press(retourButton);
    
//     // Add assertions for the expected behavior after button click
//   });

//   // Add more test cases as needed
// });
