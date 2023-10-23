import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizzFinal from '../../screens/ProfilingQuizzFinal'; 

describe('ProfilingQuizzFinal Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzFinal />);

    expect(getByText('3/3 - Comment avez-vous découvert Leon\'Art ?')).toBeTruthy();
    expect(getByText('Terminé')).toBeTruthy();
  });

  it('handles tag selection correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzFinal />);
     
    const reseauxSociauxButton = getByText('Réseaux sociaux');
    fireEvent.press(reseauxSociauxButton);
    
    expect(getByText('Réseaux sociaux')).toBeTruthy();
  });

  it('handles "Terminé" button click correctly', () => {
    const { getByText, getByTestId } = render(<ProfilingQuizzFinal />);
    
    const termineButton = getByText('Terminé');
    fireEvent.press(termineButton);
  });
});