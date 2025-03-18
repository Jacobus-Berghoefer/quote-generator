import { useMutation } from "@apollo/client";
import { SAVE_QUOTE } from "../graphql/mutations";
import auth from "../utils/auth";
import { useState } from "react";

interface SaveQuoteButtonProps {
  _id: string;
  text: string;
  author: string;
}

const SaveQuoteButton: React.FC<SaveQuoteButtonProps> = ({ _id, text, author }) => {
  const [saveQuote, { loading }] = useMutation(SAVE_QUOTE);
  const [saved, setSaved] = useState(false);
  
  const handleSaveQuote = async () => {
    // Check if user is logged in
    if (!auth.loggedIn()) {
      alert("You need to be logged in to save quotes!");
      return;
    }

    try {
      await saveQuote({
        variables: { 
          _id,
          text, 
          author: author || "Unknown",
          
        }
      });
      setSaved(true);
    } catch (err) {
      console.error("Error saving quote:", err);
    }
  };

  return (
    <button 
      className="save-quote-btn" 
      onClick={handleSaveQuote} 
      disabled={loading || saved}
    >
      {saved ? "Saved ✓" : "Save Quote"}
    </button>
  );
};

export default SaveQuoteButton;