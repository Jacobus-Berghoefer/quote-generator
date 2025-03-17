import { useState, type FormEvent, type ChangeEvent } from 'react';

import Auth from '../../src/utils/auth';
import { ADD_USER } from '../graphql/mutations';
import { UserLogin } from '../models/User';
import { useMutation } from '@apollo/client';

const signUp = () => {
  const [signUpData, setSignUpData] = useState<UserLogin>({
    username: '',
    password: '',
    email: '',
  });

  const [signUp, { error }] = useMutation(ADD_USER); // mutation for signing up a user

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await signUp({
        variables: { 
          username: signUpData.username,
          email: signUpData.email, 
          password: signUpData.password 
        }
      });

          // Use the data returned from mutation
    if (data?.addUser?.token) {
      // Log the user in with the returned token
      Auth.login(data.addUser.token);
      // Redirect logic can happen in Auth.login or here
    }
  } catch (err) {
    console.error('Failed to sign up', err);
  }
};

  return (
    <div className='form-container'>
      <form className='form login-form' onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className='form-group'>
          <input
            placeholder='Username'
            className='form-input'
            type='text'
            name='username'
            value={signUpData.username || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            placeholder='Email'
            className='form-input'
            type='email'
            name='email'
            value={signUpData.email || ''}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <input
            placeholder='Password'
            className='form-input'
            type='password'
            name='password'
            value={signUpData.password || ''}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <button className='btn btn-primary' type='submit'>
            Sign Up
          </button>
          <p className='error-message'>{error && error.message}</p>
        </div>
      </form>
    </div>
  );
};

export default signUp;
