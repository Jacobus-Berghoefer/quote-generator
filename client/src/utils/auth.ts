// use this to decode a token and get the user's information out of it
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface ExtendedJwt extends JwtPayload {
  data:{
    username:string,
    email:string,
    id:string
  }
};

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return jwtDecode<ExtendedJwt>(this.getToken());
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token: string) {
    try {
      // TODO: What is jwtDecode doing with the token here?
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        return true;
      }
    } catch (err) {
      return false;
    }
  }

  getToken(): string {
    const loggedUser = localStorage.getItem('id_token') || '';
    return loggedUser;
  }

  login(idToken: string) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();