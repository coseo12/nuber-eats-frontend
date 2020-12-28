import { render } from '@testing-library/react';
import React from 'react';
import { CategoryContainer } from '../category-container';

describe('<CategoryContainer />', () => {
  it('should render OK with props', () => {
    const { getByText } = render(<CategoryContainer>test</CategoryContainer>);
    getByText('test');
  });
});
