import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="footer">
      <button onClick={() => navigate("/about")}>About Us</button>

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