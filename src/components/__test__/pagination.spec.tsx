import { render } from '@testing-library/react';
import React from 'react';
import { Pagination } from '../pagination';

describe('<Pagination />', () => {
  it('should render OK with props', () => {
    const paginationProps = {
      page: 1,
      totalPages: 1,
      onPrevPageClick: () => null,
      onNextPageClick: () => null,
    };
    const { getByText } = render(<Pagination {...paginationProps} />);
    getByText(`Page ${paginationProps.page} of ${paginationProps.totalPages}`);
  });
  it('shoud render OK with prev', () => {
    const paginationProps = {
      page: 2,
      totalPages: 1,
      onPrevPageClick: () => null,
      onNextPageClick: () => null,
    };
    const { getByText } = render(<Pagination {...paginationProps} />);
    getByText('←');
  });
});
