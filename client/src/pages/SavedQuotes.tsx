import { useQuery } from '@apollo/client';
import auth from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { GET_ME } from '../graphql/queries';
import RemoveQuoteButton from '../components/RemoveQuoteButton';


const SavedQuotes = () => {
  const { loading, data } = useQuery(GET_ME, {
    fetchPolicy: "network-only" // This ensures a fresh network request each time
  });
  const navigate = useNavigate();
  
    // Check if user is logged in, redirect to login if not
    useEffect(() => {
      if (!auth.loggedIn()) {
        navigate('/login');
      }
    }, [navigate]);
  
    if (loading) return <p>Loading...</p>;
  
    const userData = data?.me;
  
    return (
      <section className="saved-quotes">
        <h2>Your Saved Quotes</h2>
        {userData && userData.savedQuotes && userData.savedQuotes.length > 0 ? (
          <div className="saved-quotes-container">
            {userData.savedQuotes.map((quote: any) => (
              <div className="quote-result" key={quote._id}>
                <blockquote>{quote.text}</blockquote>
                <p>{quote.author}</p>
                <RemoveQuoteButton quoteId={quote._id} />
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't saved any quotes yet!</p>
        )}
      </section>
    );
};
  
export default SavedQuotes;