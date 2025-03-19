import { useMutation } from "@apollo/client";
import { REMOVE_QUOTE } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";
import { useState } from "react";

interface RemoveQuoteButtonProps {
  quoteId: string;
}

const RemoveQuoteButton: React.FC<RemoveQuoteButtonProps> = ({ quoteId }) => {
  const [removeQuote, { loading }] = useMutation(REMOVE_QUOTE, {
    refetchQueries: [{ query: GET_ME }], // Refetch user data after removing
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error("Detailed error:", error);
    }
  });
  
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleRemoveQuote = async () => {
    setIsRemoving(true);
    try {
      console.log("Attempting to remove quote with ID:", quoteId);
      
      const { data } = await removeQuote({
        variables: { _id: quoteId }
      });
      
      console.log("Remove quote response:", data);
    } catch (err) {
      console.error("Error removing quote:", err);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <button 
      className="remove-quote-btn" 
      onClick={handleRemoveQuote} 
      disabled={loading || isRemoving}
    >
      {isRemoving ? "Removing..." : "Remove Quote"}
    </button>
  );
};

export default RemoveQuoteButton;