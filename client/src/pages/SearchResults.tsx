import { useState, useEffect } from "react";
import ErrorPage from "../pages/Error";
import { retrieveKeywordQuotes } from "../api/FetchKeywordQuotes";
import PaginatedList from "../components/PaginatedList";
import { useOutletContext } from "react-router-dom";

const SearchResults = () => {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const value: string = useOutletContext();

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            setError(false);

            try {
                const data = await retrieveKeywordQuotes(value);
                setQuotes(data);
            } catch (err) {
                console.error('Failed to retrieve recipes:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [value]);

    if (error) {
        return <ErrorPage />;
    }

    if (loading) {
        return <div>Searching for "{value}"...</div>;
    }

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