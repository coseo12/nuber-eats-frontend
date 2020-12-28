import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

interface IFormProps {
  searchTerm: string;
}

export const SearchContainer = () => {
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history?.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    });
  };
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  return (
    <form
      onSubmit={handleSubmit(onSearchSubmit)}
      className="bg-gray-800 w-full py-40 flex items-center justify-center"
    >
      <input
        ref={register({ required: true, min: 3 })}
        name="searchTerm"
        className="input rounded-md border-0 w-3/4 md:w-3/12"
        type="search"
        placeholder="Search restauratnts..."
      />
    </form>
  );
};
