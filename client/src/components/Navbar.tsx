import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router";
import auth from '../utils/auth';
// import bust from '../assets/roman_bust.png';
import roman_bust from '../assets/roman_bust.png'

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
    console.log(e.target)
    return props.setSearchTerm(value);
  };

  return (
    <div className='custom-navbar'>
      <div className='logo-title'>
        <Link to='/'>
          <img className='logo' src={roman_bust} alt="greek bust" />
          </Link>
          <Link className="text-decoration-none"to='/'>
        <h1>QUOTES FOR DAYS</h1>
        </Link>
      </div>
      {/* <div className='search'>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="What's on your mind?" onChange={handleChange}></input>
          <button type="submit"><img className='search-button' src={roman_bust} alt="greek bust" /></button>
        </form>
      </div> */}
      <div className='avatar-container'>
        <div className='top-row'>
          {!loginCheck ? (
            <> 

{/* className="margin-right btn" */}
            <button onClick={() => {navigate("/login")}}>Login</button>
            </>
          ) : (
            <>
            <div className='bottom-row'>
            <button onClick={() => {navigate("/saved")}}>My Quotes</button>
              <button
                className='login-btn'
                type='button'
                onClick={() => {
                  auth.logout();
                }}>Logout
              </button>
              </div>
            </>
          )}
        </div>
        {/* <div className='bottom-row'>
          <Link to='/saved' >My Quotes</Link>
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;