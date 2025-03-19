import '../src/styles/App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useState } from 'react'

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// const body = document.querySelector('body');

// // Add event listener for mouse movement
// document.addEventListener('mousemove', (event) => {
//   // Calculate position relative to the viewport
//   const x = (event.clientX / window.innerWidth) * 100; // Percentage of horizontal position
//   const y = (event.clientY / window.innerHeight) * 100; // Percentage of vertical position

//   // Adjust the background's position based on mouse position
//   body!.style.transform = `translate(${-50 + x / 10}%, ${-50 + y / 10}%)`;
// });

function App() {

    const [searchTerm, setSearchTerm] = useState('')

  return (
    <ApolloProvider client={client}>
    <div className='layout'>
      <header>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </header>
      <main className='content'>
        <Outlet context={searchTerm} />
      </main>
      <footer>
    <Footer />
    </footer>
    </div>
    </ApolloProvider>
  );
}

export default App;