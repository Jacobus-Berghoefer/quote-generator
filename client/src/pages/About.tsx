import tree from '../assets/baobabTree.png';
import bust from '../assets/roman_bust.png'
import hairyBust from '../assets/hairy-bust.png'
import unfinished from '../assets/unfinished.png'

function About() {
 
    return (
        <>
        <h2 className="old-standard-tt-regular-italic result-title about-title">
        Meet Our Team
      </h2>
      <section className='about'>
        <div className="about-container">
          <div className="about-card">
            <img src={unfinished}></img>
            <h2 className='old-standard-tt-regular'>Blade</h2>
            <h3>Front-End, Back-End and Authentication</h3>
            <p>
              Suh dudes! My name is Blake. I am a student and soon to be junior
              developer. My interests are video games and writing illegible
              code!
            </p>
            <p>"If you ever start taking things too seriously, just remember that we are talking monkeys on an organic spaceship flying through the universe."</p>
            <p>- Joe Rogan</p>
          </div>
          <div className="about-card">
            <img src={hairyBust}></img>
            <h2 className='old-standard-tt-regular'>Jack</h2>
            <h3>Back-End, API Integration and Deployment</h3>
            <p>
              Yo! I'm a wannabe full stack web developer from MN. I specialize
              in JavaScript, React, TypeScript, Node.js, PostGres, and MongoDB.
              I enjoy cooking up new recipes, competing in cornhole tournaments,
              and exploring new locations with a drink to celebrate.
            </p>
            <p>"What you do today can improve all your tomorrows."</p>
            <p>- Ralph Marston</p>
          </div>
          <div className="about-card">
            <img src={bust}></img>
            <h2 className='old-standard-tt-regular'>Gabe</h2>
            <h3>Front-End, API Integration and Styling</h3>
            <p>
              Hello! I’m a (future) junior developer from hailing from rural
              Minnesota. I enjoy working on the front end as well as styling. I
              have experience in using React, SQL, JS, NPM, and CSS.
              Fitness is a significant part of my life, and I am a regular
              gym-goer at Los Campeones. Additionally, I’m a horror movie
              enthusiast, and a couple of my favorites include the Babadook and
              Hereditary.
            </p>
            <p>"The world is the great gymnasium where we come to make ourselves strong."</p>
            <p>- Swami Vivekananda</p>
          </div>
        </div>
      </section>
      </>
    );
  }
  
  export default About;