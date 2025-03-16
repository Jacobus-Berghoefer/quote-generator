import { useState, useEffect } from "react";
import {retrieveRandomQuote} from "../api/FetchRandomQuote";
import { retrieveDailyQuote } from "../api/FetchDailyQuote";
import { retrieveKeywordQuotes } from "../api/FetchKeywordQuote";
import {Quote} from '../models/Quote'

const Home = () => {
    const [randomQuote, setRandomQuote] = useState<Quote>({
        "q": "",
        "a": ""
    })

    const [dailyQuote, setDailyQuote] = useState<Quote>({
        "q": "",
        "a": ''
    })
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchRandomQuote()
    }, [randomQuote])

    useEffect(()=> {
        fetchDailyQuote()
    }, [])

    // onclick call fetch random recipe

    const fetchRandomQuote = async () => {
        try {
            const data = await retrieveRandomQuote()
            setRandomQuote(data)
        } catch (err) {
            console.error('Failed to retrieve Random Quote', err);
            setError(true);
        }
    }

    const fetchDailyQuote = async () => {
        try {
            const data = await retrieveDailyQuote()
            setRandomQuote(data)
        } catch (err) {
            console.error('Failed to retrieve Random Quote', err);
            setError(true);
        }
    }

    const fetchKeywordQuotes = async () => {
        try {
            const data = await retrieveKeywordQuotes(input)
            setRandomQuote(data)
        } catch (err) {
            console.error('Failed to retrieve Random Quote', err);
            setError(true);
        }
    }

    return (
        <>
            <div className="el"></div>






                    {/* <h1>{randomRecipe.title}</h1>
                        {randomRecipe.extendedIngredients.map(item => (
                            <li key={item.id}>{item.original}</li>
                        ))}
                <button className='meal-button' onClick={() => fetchRandomRecipe()}>Snack</button> */}
        </>
    );
}

export default Home;