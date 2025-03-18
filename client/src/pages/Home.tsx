import { useState, useEffect } from "react";
import {retrieveRandomQuote} from "../api/FetchRandomQuote";
import { retrieveDailyQuote } from "../api/FetchDailyQuote";
// import { retrieveKeywordQuotes } from "../api/FetchKeywordQuotes";
import {Quote} from '../models/Quote'
import { useNavigate } from "react-router";

const Home = (props:any) => {
    let navigate = useNavigate();
    const [randomQuote, setRandomQuote] = useState<Quote>({
        text: "",
        author: ""
    })

    const [dailyQuote, setDailyQuote] = useState<Quote>({
        text: "",
        author: ''
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
        <section className="daily-quote">
            <div>
                <p>{dailyQuote.text}</p>
                <p>{dailyQuote.author}</p>
            </div>
        </section>

        {/* <section className="flicker">
          <div className="el">
            <blockquote>{dailyQuote.q}</blockquote>
                <p>{dailyQuote.a}</p>
          </div>

        </section>

        <div className="infinity">
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
            <button onClick={() => {navigate("search/?q=Anxiety")}}>Anxiety</button>
            <button onClick={() => {navigate("search/?q=Change")}}>Change</button>
            <button onClick={() => {navigate("search/?q=Choice")}}>Choice</button>
            <button onClick={() => {navigate("search/?q=Confidence")}}>Confidence</button>
            <button onClick={() => {navigate("search/?q=Courage")}}>Courage</button>
            <button onClick={() => {navigate("search/?q=Death")}}>Death</button>
            <button onClick={() => {navigate("search/?q=Dreams")}}>Dreams</button>
            <button onClick={() => {navigate("search/?q=Excellence")}}>Excellence</button>
            <button onClick={() => {navigate("search/?q=Failure")}}>Failure</button>
            <button onClick={() => {navigate("search/?q=Fairness")}}>Fairness</button>
            <button onClick={() => {navigate("search/?q=Fear")}}>Fear</button>
            <button onClick={() => {navigate("search/?q=Forgiveness")}}>Forgiveness</button>
            <button onClick={() => {navigate("search/?q=Freedom")}}>Freedom</button>
            <button onClick={() => {navigate("search/?q=Future")}}>Future</button>
            <button onClick={() => {navigate("search/?q=Happiness")}}>Happiness</button>
            <button onClick={() => {navigate("search/?q=Inspiration")}}>Inspiration</button>
            <button onClick={() => {navigate("search/?q=Kindness")}}>Kindness</button>
            <button onClick={() => {navigate("search/?q=Leadership")}}>Leadership</button>
            <button onClick={() => {navigate("search/?q=Life")}}>Life</button>
            <button onClick={() => {navigate("search/?q=Living")}}>Living</button>
            <button onClick={() => {navigate("search/?q=Love")}}>Love</button>
            <button onClick={() => {navigate("search/?q=Pain")}}>Pain</button>
            <button onClick={() => {navigate("search/?q=Past")}}>Past</button>
            <button onClick={() => {navigate("search/?q=Success")}}>Success</button>
            <button onClick={() => {navigate("search/?q=Time")}}>Time</button>
            <button onClick={() => {navigate("search/?q=Today")}}>Today</button>
            <button onClick={() => {navigate("search/?q=Truth")}}>Truth</button>
            <button onClick={() => {navigate("search/?q=Work")}}>Work</button>
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