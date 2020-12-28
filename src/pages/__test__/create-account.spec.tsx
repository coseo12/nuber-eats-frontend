import { ApolloProvider } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import {
  CreateAccount,
  CREATE_ACCOUNT_MUTATION,
} from 'src/pages/create-account';
import { UserRole } from 'src/__generated__/globalTypes';
import { render, waitFor, RenderResult } from '../../test-utils';

const mockPush = jest.fn();

jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom');
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe('<CreateAccount />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });

  it('render ok', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Create Account | Nuber eats');
    });
  });

  it('renders validation errors', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole('button');
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
    await waitFor(() => {
      userEvent.type(email, 'test@test.com');
      userEvent.click(button);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it('submit mutation with form values', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole('button');
    const formData = {
      email: 'test@test.com',
      password: '121212',
      role: UserRole.Client,
    };
    const mockedCreateMutaionResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: 'error',
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedCreateMutaionResponse
    );
    jest.spyOn(window, 'alert').mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });
    expect(mockedCreateMutaionResponse).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenLastCalledWith(
      'Account Created! Log in now!'
    );
    const mutationError = getByRole('alert');
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mutationError).toHaveTextContent('error');
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
