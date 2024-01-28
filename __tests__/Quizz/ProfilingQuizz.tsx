import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfilingQuizz from '../../screens/ProfilingQuizz';

describe('ProfilingQuizz', () => {
  const mockNavigate = jest.fn();

  const setup = () => {
    return render(<ProfilingQuizz navigation={{ navigate: mockNavigate }} />);
  };

  it('renders welcome texts and buttons', () => {
    const { getByText } = setup();

    expect(getByText('Bienvenue !')).toBeTruthy();
    expect(getByText("Avec Leon'Art vous souhaitez...")).toBeTruthy();
    expect(getByText('Vendre mes œuvres d’art')).toBeTruthy();
    expect(getByText('Découvrir des œuvres d’art')).toBeTruthy();
    expect(getByText('Suivant')).toBeTruthy();
    expect(getByText('Retour')).toBeTruthy();
  });

  it('updates state and handles navigation on button press', () => {
    const { getByText } = setup();

    fireEvent.press(getByText('Vendre mes œuvres d’art'));
    fireEvent.press(getByText('Suivant'));

    expect(mockNavigate).toHaveBeenCalledWith('profilingArtist', { objective: 'sell' });

    fireEvent.press(getByText('Découvrir des œuvres d’art'));
    fireEvent.press(getByText('Suivant'));

    expect(mockNavigate).toHaveBeenCalledWith('profilingAmateur', { objective: 'discover' });
  });

  it('handles previous button press', () => {
    const { getByText } = setup();

    fireEvent.press(getByText('Retour'));

    expect(mockNavigate).toHaveBeenCalledWith('homemain');
  });
});
