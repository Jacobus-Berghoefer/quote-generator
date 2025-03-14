import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
        <div>
        <button onClick={() => window.open('/About', '_blank')}>
          About Us
        </button>
      </div>
      <div>
        <p>Copyright by Quotes for Days 2025</p>
      </div>
      <div>
        <button onClick={() => window.open('https://github.com/Jacobus-Berghoefer/quote-generator', '_blank')}>
          Github
        </button>
      </div>
    </footer>
  );
};

export default Footer;
