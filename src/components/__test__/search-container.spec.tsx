import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { SearchContainer } from '../search-container';

describe('<SeachContainer />', () => {
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      renderResult = render(<SearchContainer />);
    });
  });
  it('submit form', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const search = getByPlaceholderText(/search/i);
    await waitFor(() => {
      userEvent.type(search, 'restaurant');
      document.querySelector('form')?.submit();
    });
  });
});
