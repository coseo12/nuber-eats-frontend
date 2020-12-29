import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from 'src/components/button';
import {
  createRestaurant,
  createRestaurantVariables,
} from 'src/__generated__/createRestaurant';
import { CREATE_ACCOUNT_MUTATION } from '../create-account';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

export const AddRestaurant = () => {
  const [createRestaurantMutation, { loading, data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_ACCOUNT_MUTATION);
  const {
    register,
    getValues,
    formState,
    errors,
    handleSubmit,
  } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h1>Add Restaurant</h1>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input"
          ref={register({ required: 'Name is required' })}
          name="name"
          type="text"
          placeholder="Name"
        />
        <input
          className="input"
          ref={register({ required: 'Address is required' })}
          name="address"
          type="text"
          placeholder="Address"
        />
        <input
          className="input"
          ref={register({ required: 'Category Name is required' })}
          name="categoryName"
          type="text"
          placeholder="Category Name"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Create Resturant"
        />
      </form>
    </div>
  );
};
