import { useState, useEffect } from "react";
// import ErrorPage from "../pages/Error";
// import { retrieveKeywordQuotes } from "../api/FetchKeywordQuotes";
import PaginatedList from "../components/PaginatedList";
import { useOutletContext } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { GET_QUOTES_BY_KEYWORD } from "../graphql/queries";
import { useLocation } from "react-router-dom";
import { SAVE_QUOTE } from "../graphql/mutations";
import Auth from "../utils/auth"
import { useMutation } from "@apollo/client";
import { Quote } from "../models/Quote";

const SearchResults = () => {
    const [quotes, setQuotes] = useState<any[]>([]);
    // const [error, setError] = useState<any>("");
    // const [loading, setLoading] = useState(true);
    const value: string = useOutletContext();
    const [getQuotesByKeyword, { loading, error, data }] = useLazyQuery(GET_QUOTES_BY_KEYWORD);
    const {search} = useLocation();
    console.log(search.split("=")[1])

    useEffect(() => {
        console.log(value)
        const fetchSearchResults = async () => {
            // setLoading(true);
            // setError(false);
            // use lazy query to hit zen quotes
            try {
                const{data}  = await getQuotesByKeyword({variables:{keyword:value || search.split("=")[1]}});
                setQuotes(data.zenQuoteByKeyword);
            } catch (err) {
                console.error('Failed to retrieve quotes:', err);
                // setError(err);
            // } finally {
            //     setLoading(false);
            }
            if (loading) return <p>Loading ...</p>;
            if (error) return `Error! ${error}`;
        };

        fetchSearchResults();
    }, [value]);

    // if (error) {
    //     console.error(error)
    //     return <ErrorPage />;
    // }

    // if (loading) {
    //     return <div>Searching for "{value}"...</div>;
    // }


    const [saveQuote] = useMutation(SAVE_QUOTE);
    // create function to handle saving a book to our database
    const handleSaveQuote = async (quoteIdArg: string) => {
      // find the book in `searchedBooks` state by the matching id
      const quoteToSave: Quote = quotes.find((quote) => quote._id === quoteIdArg)!;
  
      // get token
      const token = Auth.loggedIn() ? Auth.getToken() : null;
  
      if (!token) {
        return false;
      }
  
      try {
        // const response = await saveBook(bookToSave, token);
            const {data} = await saveQuote({
              variables: { quoteToSave }
            })
        if (!data.ok) {
          throw new Error('something went wrong!');
        }
  
        // if book successfully saves to user's account, save book id to state
        // setSavedBookIds([...savedBookIds, bookToSave.bookId]);
      } catch (err) {
        console.error(err);
      }
    };



    return (
      <div className="search">
        <h2 className="old-standard-tt-regular-italic result-title">
          Results for "{value || search.split("=")[1]}"
        </h2>
        <PaginatedList items={quotes} />
      </div>
    );
};

export default SearchResults;