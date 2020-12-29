import { ApolloProvider } from '@apollo/client';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, RenderResult, waitFor } from '../../test-utils';
import React from 'react';
import { Login, LOGIN_MUTATION } from '../login';
import userEvent from '@testing-library/user-event';

describe('<Login />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();

      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      );
    });
  });

  it('should renders OK', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Login | Nuber Eats');
    });
  });

  it('displays email validation errors', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    await waitFor(() => {
      userEvent.type(email, 'test@test');
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });

  it('displays password validation errors', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole('button');
    await waitFor(() => {
      userEvent.type(email, 'test@test.com');
      userEvent.click(submitBtn);
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it('submit form and calls mutation', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole('button');
    const formData = {
      email: 'test@test.com',
      password: '121212',
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: 'XXX',
          error: null,
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });

    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        ...formData,
      },
    });
  });

  it('submit form and calls mutation error', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole('button');
    const formData = {
      email: 'test@test.com',
      password: '121212',
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: false,
          token: 'XXX',
          error: 'error',
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    // expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        ...formData,
      },
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/error/i);
  });
});
