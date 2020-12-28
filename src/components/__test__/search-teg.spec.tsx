import { render } from '@testing-library/react';
import React from 'react';
import { SearchTag } from '../search-tag';

describe(`<SearchTag />`, () => {
  it('should render OK with props', () => {
    const { getByText } = render(
      <SearchTag title={`title`} totalResults={1} />
    );
    getByText(`"title"`);
    getByText(`Restaurants: 1`);
  });
});
