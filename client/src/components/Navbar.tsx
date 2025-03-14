import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router";
import auth from '../utils/auth';
import userIcon from '../../assets/images/user-icon.png';
import './../App.less';

const Navbar = (props: any) => {
  const [loginCheck, setLoginCheck] = useState(false);
  //const [searchTerm, setSearchTerm] = useState("");
  let navigate = useNavigate();

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    console.log(loginCheck);
    checkLogin();
  }, [loginCheck]);

  const handleSubmit = async (e: FormEvent) => {
    // grabs state passes to navigate. input needs to be state.
    e.preventDefault();
    navigate("/search/?q=" + props.searchTerm)
    //
  }

  const handleChange = ( // updated from login example
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    return props.setSearchTerm(value);
  };

  return (
    <div className='custom-navbar'>
      <div className='logo-title'>
        <Link to='/'>
          <img className='logo' src={sampleLogo} alt="Epic Eats Logo" />
        </Link>
        <h1>Epic Eats</h1>
      </div>
      <div className='search'>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="What's on your mind?" onChange={handleChange}></input>
          <button type="submit">Go</button>
        </form>
      </div>
      <div className='avatar-container'>
        <div className='top-row'>
          {!loginCheck ? (
            <>
              <Link to='/login' className='login-btn' >Login</Link>
            </>
          ) : (
            <>
              <button
                className='login-btn'
                type='button'
                onClick={() => {
                  auth.logout();
                }}>Logout
              </button>
            </>
          )}
          <img className='avatar' src={userIcon}></img>
        </div>
        <div className='bottom-row'>
          <Link to='/saved' className='eats-button' >My Quotes</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;