import gage from '../../src/assets/gage.JPG';
import bust from '../../src/assets/bust.JPG';

function About() {
 
    return (
            <section>
                <h2>Meet our Team!</h2>
                <div className='eats-container'>
                    <div className='team-img'> 
                    <h2>GraphQL Logic</h2>
                        <img src={bust}></img>
                        <h2>Blade</h2>
                        <p>Suh dudes! My name is Blake. I am a student and soon to be junior developer. My interests are video games and writing illegible code!</p>
                    </div>
                    <div  className='team-img'>
                    <h2>Backend Development</h2>
                        <img src={bust}></img>
                        <h2>Jack</h2>
                        <p>HI.</p>
                    </div>
                    <div  className='team-img'>
                    <h2>Front End and Styling</h2>
                        <img src={gage}></img>
                        <h2>Gabe</h2>
                        <p>Hello! I’m a (future) junior developer from hailing from rural Minnesota.
                            I enjoy working on the front end as well as styling. I have experience in using React, SQL, JS, NPM, and CSS.<br></br>
                            Fitness is a significant part of my life, and I am a regular gym-goer at Los Campeones. 
                            The discipline and focus I gain from working out help me tackle challenges in my professional life. 
                            Additionally, I’m a horror movie enthusiast, and some of my favorites include the Babadook and Hereditary.</p>
                    </div>
                    </div>
            </section>
    );
  }
  
  export default About;