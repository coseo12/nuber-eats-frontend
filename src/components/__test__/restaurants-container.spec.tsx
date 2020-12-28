import { render } from '@testing-library/react';
import React from 'react';
import { RestaurantsContainer } from '../restaurants-container';

describe('<RestaurantContainer />', () => {
  it('should render OK with props', () => {
    const { getByText } = render(
      <RestaurantsContainer>test</RestaurantsContainer>
    );
    getByText('test');
  });
});
