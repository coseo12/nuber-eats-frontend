import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import nuberLogo from '../images/eats-logo.svg';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation';

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ILoginForm>({
    mode: 'onChange',
  });
  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };
  const [loginMutation, { data: loginMutationresult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28 px-5">
      <div className="w-full max-w-screen-sm flex flex-col items-center">
        <img src={nuberLogo} alt="logo" className="w-52 mb-10" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 mx-2 w-full mb-3"
        >
          <input
            ref={register({ required: 'Email is required' })}
            name="email"
            type="email"
            required
            placeholder="Eamil"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            ref={register({ required: 'Password is required', minLength: 10 })}
            name="password"
            type="password"
            required
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === 'minLength' && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Log In"
          />
          {loginMutationresult?.login.error && (
            <FormError errorMessage={loginMutationresult.login.error} />
          )}
        </form>
        <div>
          New to Nuber?{' '}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
