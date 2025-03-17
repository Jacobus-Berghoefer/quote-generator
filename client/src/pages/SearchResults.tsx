import { useState, useEffect } from "react";
// import ErrorPage from "../pages/Error";
// import { retrieveKeywordQuotes } from "../api/FetchKeywordQuotes";
import PaginatedList from "../components/PaginatedList";
import { useOutletContext } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { GET_QUOTES_BY_KEYWORD } from "../graphql/queries";

const SearchResults = () => {
    const [quotes, setQuotes] = useState<any[]>([]);
    // const [error, setError] = useState<any>("");
    // const [loading, setLoading] = useState(true);
    const value: string = useOutletContext();
    const [getQuotesByKeyword, { loading, error, data }] = useLazyQuery(GET_QUOTES_BY_KEYWORD);

    useEffect(() => {
        const fetchSearchResults = async () => {
            // setLoading(true);
            // setError(false);
            // use lazy query to hit zen quotes
            try {
                const data = await getQuotesByKeyword({variables:{value}});
                setQuotes(data.zenQuotesbyKeyword);
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

    return (
        <div className="search">
            <div>
            <h2>Search results for "{value}"</h2>
            <div className='eats-container search-results'> 
                <div className='myeats-card'>
                <PaginatedList items={quotes} />
                </div>
            </div>
            </div>
        </div>
    );
};

export default SearchResults;