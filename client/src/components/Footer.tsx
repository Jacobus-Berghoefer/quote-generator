import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <button onClick={() => window.open("/about", "_blank")}>About Us</button>

      <p>Copyright by Quotes for Days 2025</p>

      <button
        onClick={() =>
          window.open(
            "https://github.com/Jacobus-Berghoefer/quote-generator",
            "_blank"
          )
        }
      >
        Github
      </button>
    </footer>
  );
};

export default Footer;
