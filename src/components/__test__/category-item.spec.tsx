import { render } from '@testing-library/react';
import React from 'react';
import { CategoryItem } from '../category-item';

describe('<category-item />', () => {
  it('should render OK with props', () => {
    const { rerender } = render(
      <CategoryItem name={`testName`} coverImg={`testImg`} opacity={100} />
    );
    rerender(<CategoryItem name={`testName`} coverImg={`testImg`} />);
  });
});
