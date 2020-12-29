import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from 'src/components/button';
import { FormError } from 'src/components/form-error';
import {
  createRestaurant,
  createRestaurantVariables,
} from 'src/__generated__/createRestaurant';

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
  file: FileList;
}

export const AddRestaurant = () => {
  const [uploading, setUploading] = useState(false);
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, error },
    } = data;
    if (ok) {
      setUploading(false);
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });
  const {
    register,
    getValues,
    formState,
    errors,
    handleSubmit,
  } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append('file', actualFile);
      const { url: coverImg } = await (
        await fetch('http://localhost:4000/uploads/', {
          method: 'POST',
          body: formBody,
        })
      ).json();
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h1>Add Restaurant</h1>
      <form
        className="grid gap-3 mt-5 mx-2 w-full mb-3"
        onSubmit={handleSubmit(onSubmit)}
      >
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
        <div>
          <input
            ref={register({ required: 'File is required' })}
            name="file"
            type="file"
            placeholder="File"
            accept="image/*"
          />
        </div>
        <Button
          loading={uploading}
          canClick={formState.isValid}
          actionText="Create Resturant"
        />
        {data?.createRestaurant?.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
