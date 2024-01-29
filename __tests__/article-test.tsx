import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Article from '../screens/Article';

describe('Article', () => {
  const mockNavigate = jest.fn();
  const mockArticle = {
    title: 'Test Article Title',
    content: 'Test Article Content',
  };

  const mockRoute = {
    params: {
      article: mockArticle,
    },
  };

  const setup = () => {
    return render(
      <Article
        navigation={{ navigate: mockNavigate }}
        route={mockRoute}
      />
    );
  };

  it('renders the article title and content', () => {
    const { getByText } = setup();

    expect(getByText(mockArticle.title)).toBeTruthy();
    expect(getByText(mockArticle.content)).toBeTruthy();
  });

  it('navigates back when the retour button is pressed', () => {
    const { getByText } = setup();
    const backButton = getByText('Retour');

    fireEvent.press(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('homemain');
  });
});
