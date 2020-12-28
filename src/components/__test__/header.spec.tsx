import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import { Header } from '../header';
import { ME_QUERY } from '../../hooks/useMe';

describe('<Header />', () => {
  it('renders virify banner', async () => {
    const mocks = [
      {
        request: {
          query: ME_QUERY,
        },
        result: {
          data: {
            id: 1,
            email: 'test@test.com',
            role: 'Client',
            verified: false,
          },
        },
      },
    ];
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider mocks={mocks}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise(resolve => setTimeout(resolve, 0));
      getByText('Please verify your email.');
    });
  });
  it('renders without verify banner', async () => {
    const mocks = [
      {
        request: {
          query: ME_QUERY,
        },
        result: {
          data: {
            me: {
              id: 1,
              email: 'test@test.com',
              role: 'Client',
              verified: true,
            },
          },
        },
      },
    ];
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider mocks={mocks}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(queryByText('Please verify your email.')).toBeNull();
    });
  });
});
