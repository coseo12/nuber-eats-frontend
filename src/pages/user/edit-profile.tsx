import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'src/components/button';
import { FormError } from 'src/components/form-error';
import { useMe } from 'src/hooks/useMe';
import {
  editProfile,
  editProfileVariables,
} from 'src/__generated__/editProfile';

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              email
              verified
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };
  const [editProfile, { loading, data: editMutaionResult }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState,
    errors,
  } = useForm<IFormProps>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      editProfile({
        variables: {
          input: {
            email,
            ...(password !== '' && { password }),
          },
        },
      });
    }
  };

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          ref={register({
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          className="input"
          type="email"
          placeholder="eamil"
          name="email"
          required
        />
        {errors.email?.message && (
          <FormError errorMessage={errors.email?.message} />
        )}
        {errors.email?.type === 'pattern' && (
          <FormError errorMessage={`Please enter a valid email`} />
        )}
        <input
          ref={register}
          className="input"
          type="password"
          placeholder="password"
          name="password"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText={`Update Profile`}
        ></Button>
        {editMutaionResult?.editProfile.error && (
          <FormError errorMessage={editMutaionResult.editProfile.error} />
        )}
      </form>
    </div>
  );
};
