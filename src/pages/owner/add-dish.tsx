import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from 'src/components/button';
import { createDish, createDishVariables } from 'src/__generated__/createDish';
import { MY_RESTAURANT_QUERY } from './my-restaurant';

export const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

export const AddDish = () => {
  const history = useHistory();
  const { restaurantId } = useParams<IParams>();
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });
  const {
    register,
    formState,
    handleSubmit,
    getValues,
    setValue,
  } = useForm<IForm>({
    mode: 'onChange',
  });
  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    const optionObj = optionsNumber.map(theId => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: optionObj,
        },
      },
    });
    setTimeout(() => {
      history.goBack();
    }, 500);
  };
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddoptionClick = () => {
    setOptionsNumber(current => [Date.now(), ...current]);
  };
  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber(current => current.filter(id => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, '');
    setValue(`${idToDelete}-optionExtra`, '');
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h1 className="font-medium text-2xl mb-3">Add Dish</h1>
      <form
        className="grid max-w-screen-sm gap-3 mt-5 mx-2 w-full mb-3"
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
          ref={register({ required: 'Price is required' })}
          name="price"
          type="number"
          min={0}
          defaultValue={0}
          placeholder="Price"
        />
        <input
          className="input"
          ref={register({ required: 'Description Name is required' })}
          name="description"
          type="text"
          placeholder="Description"
        />
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span
            onClick={onAddoptionClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
          >
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map(id => (
              <div key={id} className="mt-5">
                <input
                  ref={register}
                  name={`${id}-optionName`}
                  className="py-2 px-4 focus:outline-none mr-3 focus:border-grea-600 border-2"
                  type="text"
                  placeholder="Option Name"
                />
                <input
                  ref={register}
                  name={`${id}-optionExtra`}
                  className="py-2 px-4 focus:outline-none focus:border-grea-600 border-2"
                  type="number"
                  min={0}
                  defaultValue={0}
                  placeholder="Option Extra"
                />
                <span
                  className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5"
                  onClick={() => onDeleteClick(id)}
                >
                  Delete Option
                </span>
              </div>
            ))}
        </div>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Create Dish"
        />
      </form>
    </div>
  );
};
