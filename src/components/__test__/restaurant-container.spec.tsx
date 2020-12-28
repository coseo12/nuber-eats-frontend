import { render } from '@testing-library/react';
import React from 'react';
import { RestaurantConatainer } from '../restaurant-container';

describe('<RestaurantContainer />', () => {
  it('should render OK with props', () => {
    const { getByText } = render(
      <RestaurantConatainer>test</RestaurantConatainer>
    );
    getByText('test');
  });
});
