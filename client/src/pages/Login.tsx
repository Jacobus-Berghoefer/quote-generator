import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../src/utils/auth';
import { LOGIN_USER } from '../graphql/mutations.js';
import type { UserLogin } from '../models/User.js';
import { useMutation } from '@apollo/client';


// Define the Login component
const Login = () => {
  const [login, { error }] = useMutation(LOGIN_USER); // login mutation lets us connect to the mongoose database
  const [loginData, setLoginData] = useState<UserLogin>({
    username: '',
    password: '',
    email: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { 
          username: loginData.username, 
          password: loginData.password 
        }
      });
      if (data?.login?.token) {
        Auth.login(data.login.token);
      } else {
        console.error('Login successful but no token received');
      }
    } catch (err) {
      console.error('Failed to login', err);
    }
  };

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit}>
        <p className='old-standard-tt-regular-italic login-register-title'>Login to Begin!</p>
        <div>
          <input
            placeholder="Username"
            className='form-input'
            type='text'
            name='username'
            value={loginData.username || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            placeholder="Password"
            type='password'
            name='password'
            value={loginData.password || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <button className='login-button' type='submit'>
            Login
          </button>
          {error && <p className='error-message'>You must register first before logging in!</p>}
          <div className='register-div'>
          <p>or <Link to='/signup' className='old-standard-tt-bold register'> Register Here</Link></p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;