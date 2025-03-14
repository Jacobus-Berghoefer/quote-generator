import { Quote } from "../models/Quote";

export const resolvers = {
  Query: {
    getSavedQuotes: async () => await Quote.find(),
  },
  Mutation: {
    saveQuote: async (_: any, { text, author, category }: { text: string; author: string; category?: string }) => {
      const newQuote = new Quote({ text, author, category });
      return await newQuote.save();
    },
  },
};
