import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddPublication from '../screens/AddPublication';
import { MainContext } from '../context/MainContext';



// Mock the navigation and context
const mockNavigation = {
    navigate: jest.fn(),
};

const mockContext = {
    token: 'test-token',
};
jest.mock('react-native-image-picker', () => ({
    launchImageLibrary: jest.fn(),
  }));

describe('AddPublication', () => {
  const renderComponent = () => render(
    <MainContext.Provider value={mockContext}>
      <AddPublication navigation={mockNavigation} />
    </MainContext.Provider>
  );

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = renderComponent();
    
    expect(getByPlaceholderText('Titre')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByText('Ajouter')).toBeTruthy();
    // Add checks for other elements as needed
  });

  it('handles input changes', () => {
    const { getByPlaceholderText } = renderComponent();
    
    const titleInput = getByPlaceholderText('Titre');
    fireEvent.changeText(titleInput, 'Test Title');
    expect(titleInput.props.value).toBe('Test Title');

    // Repeat for other TextInput components
  });

  it('handles publish button click', () => {
    const { getByText } = renderComponent();
    
    fireEvent.press(getByText('Ajouter'));
    // Here you would normally check if the post method was called correctly
    // However, that requires mocking the post method and ensuring it's used correctly
  });

  // Add additional tests as needed
});
