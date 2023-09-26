import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Profile from '../screens/Profile';
import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-community/checkbox');

describe('Profile Component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Profile />);
    expect(getByText("Suivre")).toBeTruthy();
    expect(getByText("Ecrire")).toBeTruthy();
  });

  it('handles tab navigation correctly', () => {
    const { getByText } = render(<Profile />);
    expect(getByText("Artwork")).toBeTruthy();
    expect(getByText("Collection")).toBeTruthy();
    expect(getByText("A propos")).toBeTruthy();

    fireEvent.press(getByText("Collection"));
    const collectionTab = getByText("Collection");
    expect(collectionTab.props.style[0].backgroundColor).toBe('lightgray');

    fireEvent.press(getByText("Artwork"));
    const artworkTab = getByText("Artwork");
    expect(artworkTab.props.style[0].backgroundColor).toBe('lightgray');
  });

  // Nouveaux tests
  it('handles back button click correctly', () => {
    const { getByImage } = render(<Profile />);
    const backButton = getByImage({ source: BackArrow });
    fireEvent.press(backButton);

    // TODO : Vérifier que la navigation s'est correctement effectuée
  });

  it('handles edit button click correctly', () => {
    const { getByImage } = render(<Profile />);
    const editButton = getByImage({ source: EditButtonImage });
    fireEvent.press(editButton);

    // TODO : Vérifier que la navigation s'est correctement effectuée
  });

  it('handles settings button click correctly', () => {
    const { getByImage } = render(<Profile />);
    const settingsButton = getByImage({ source: SettingsButtonImage });
    fireEvent.press(settingsButton);

    // TODO : Vérifier que la navigation s'est correctement effectuée
  });
});
