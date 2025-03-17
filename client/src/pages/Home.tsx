import { useState, useEffect } from "react";
import {retrieveRandomQuote} from "../api/FetchRandomQuote";
import { retrieveDailyQuote } from "../api/FetchDailyQuote";
// import { retrieveKeywordQuotes } from "../api/FetchKeywordQuotes";
import {Quote} from '../models/Quote'
import { useNavigate } from "react-router";

const Home = (props:any) => {
    let navigate = useNavigate();
    const [randomQuote, setRandomQuote] = useState<Quote>({
        "q": "",
        "a": ""
    })

    const [dailyQuote, setDailyQuote] = useState<Quote>({
        "q": "",
        "a": ''
    })
    const [_error, setError] = useState(false);

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
            setDailyQuote(data)
        } catch (err) {
            console.error('Failed to retrieve Random Quote', err);
            setError(true);
        }
    }

    // const fetchKeywordQuotes = async () => {
    //     try {
    //         const data = await retrieveKeywordQuotes(input)
    //         setRandomQuote(data)
    //     } catch (err) {
    //         console.error('Failed to retrieve Random Quote', err);
    //         setError(true);
    //     }
    // }

    return (
      <>
        <section className="flicker">
          <div className="el">
            {/* <blockquote>{dailyQuote.q}</blockquote>
                <p>{dailyQuote.a}</p> */}
          </div>

        </section>

        {/* <div className="infinity">
                <blockquote>{randomQuote.q}</blockquote>
                <p>{dailyQuote.a}</p>
                <button className="random-quote-button" onClick={() => fetchRandomQuote()}>Get Another</button>
            </div> */}

        <section className="falling-lines">
          <div className="lines">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
          <div className="text-div">
            <p>WHAT</p>
            <p>INSPIRES</p>
            <p>YOU</p>
            <p>?</p>
          </div>
        </section>

        <section className="category-btns">
            <button onClick={() => navigate("search/?=" + props.searchTerm)}>Family</button>
            <button>Health</button>
            <button>Love</button>
            <button>Work</button>
            <button>Success</button>
            <button>Wisdom</button>
            <button>Friendship</button>
            <button>Money</button>
        </section>

        {/* <h1>{randomRecipe.title}</h1>
                        {randomRecipe.extendedIngredients.map(item => (
                            <li key={item.id}>{item.original}</li>
                        ))}
                <button className='meal-button' onClick={() => fetchRandomRecipe()}>Snack</button> */}
      </>
    );
}

export default Home;