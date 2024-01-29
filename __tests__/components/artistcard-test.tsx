import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ArticleCard from '../../components/ArticleCard';

describe('ArticleCard', () => {
  const mockOnPress = jest.fn();
  const mockItem = {
    title: 'Test Article Title',
    mainImage: 'test-image-url',
  };

  const setup = (item = mockItem, onPress = mockOnPress) => {
    return render(<ArticleCard item={item} path="article" onPress={onPress} />);
  };

  it('renders the article title and image', () => {
    const { getByText, getByTestId } = setup();

    expect(getByText(mockItem.title)).toBeTruthy();
    const image = getByTestId('article-image');
    expect(image.props.source).toEqual({ uri: mockItem.mainImage });
  });

  it('calls onPress with the correct item when pressed', () => {
    const { getByTestId } = setup();
    const touchable = getByTestId('article-touchable');

    fireEvent.press(touchable);

    expect(mockOnPress).toHaveBeenCalledWith(mockItem);
  });
});
