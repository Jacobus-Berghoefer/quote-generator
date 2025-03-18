import { useEffect, useState} from "react";
// import {Quote} from '../models/Quote'
import { useNavigate } from "react-router";
import { GET_TODAY_QUOTE } from "../graphql/queries";
import { GET_RANDOM_QUOTE } from "../graphql/queries";
import { useQuery } from "@apollo/client";
// import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

const Home = (_props:any) => {
    let navigate = useNavigate();
    const [quote, setQuote] = useState({
        text: "",
        author: ""
    })
    const [randomQuote, setRandomQuote] = useState({
        text: "",
        author: ""
    })

    const {data:todayData} = useQuery(GET_TODAY_QUOTE)
    const [getRandomQuote, { data }]  = useLazyQuery(GET_RANDOM_QUOTE, { fetchPolicy: 'network-only'})

   

    useEffect(() => {
        getRandomQuote();
        // setRandomQuote(data)
      }, []);

    useEffect(() => {
        console.log(todayData)
        todayData && setQuote(todayData.zenQuoteToday)
    }, [todayData])

    useEffect(() => {
        console.log(todayData)
        data && setRandomQuote(data.zenQuoteRandom)
    }, [data])

    return (
      <>
     
        <section className="daily-quote">
            <div>
                <p>{quote.text}</p>
                <p>{quote.author}</p>
            </div>
        </section>
{data && (
        <section className="random-quote">
            <div>
                <p>{randomQuote.text}</p>
                <p>{randomQuote.author}</p>
                <button onClick={() => getRandomQuote()}>Randomize</button>
            </div>
        </section>
)}
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