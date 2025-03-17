const retrieveKeywordQuotes = async (searchTerm:string) => {
    try {
      const response = await fetch(
        `/api/quotes/keyword${searchTerm}`,
      );

      const result = await response.json();
  
      if(!response.ok) {
        throw new Error('invalid API response, check network tab!');
      }
  
      return result;
    } catch (err) {
      console.log('Error from data retrieval: ', err);
      return Promise.reject('Could not relay random request to server');
    }
  };

  export {retrieveKeywordQuotes};