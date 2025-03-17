import { User, Quote, ZenQuote } from '../models/index.js';
import { AuthenticationError } from '../services/auth.js';
import { signToken } from '../services/auth.js';
import axios from 'axios';  // Import axios for API requests

interface ZenQuoteAPIResponse {
  q: string; // Quote text
  a: string; // Author
  c?: string; // Character count
  h?: string; // Pre-formatted HTML quote
  i?: string; // Author image URL
}

console.log("📌 Checking Imports in Resolvers.ts...");
console.log("🔍 User Model:", User);
console.log("🔍 Quote Model:", Quote);
console.log("🔍 ZenQuote Model:", ZenQuote);
console.log("🔍 Auth Function:", typeof signToken);

export const resolvers = {
  Query: {
    // Get the logged-in user with their saved quotes
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate("savedQuotes");
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // Get all saved quotes from MongoDB
    quotes: async () => {
      return await Quote.find();
    },

    // Fetch quotes from ZenQuotes API and store in MongoDB
    zenQuotes: async () => {
      try {
        console.log("🔍 Fetching quotes from ZenQuotes API...");
        const response = await axios.get<ZenQuoteAPIResponse[]>("https://zenquotes.io/api/quotes");

        // Process and store quotes in MongoDB while preventing duplicates
        const storedQuotes = await Promise.all(
          response.data.map(async (quoteData) => {
            try {
              // Safely extract fields from API response
              const text = quoteData.q;
              const author = quoteData.a;
              const characterCount = parseInt(quoteData.c || "0", 10); // Ensure number
              const htmlFormatted = quoteData.h || ""; // Default to empty string
              const imageUrl = quoteData.i || null; // Default to null if missing

              // Check if the quote already exists in MongoDB
              let existingQuote = await ZenQuote.findOne({ text });

              if (!existingQuote) {
                console.log("➕ Adding new quote:", text);

                // Create a new quote in the database
                existingQuote = await ZenQuote.create({
                  text,
                  author,
                  characterCount,
                  htmlFormatted,
                  imageUrl,
                  createdAt: new Date(),
                });
              } else {
                console.log("✅ Skipping duplicate quote:", text);
              }

              return existingQuote;
            } catch (innerError) {
              console.error("❌ Error processing individual quote:", innerError);
              return null; // Skip failed entries
            }
          })
        );

        // Filter out null values in case of processing errors
        return storedQuotes.filter((quote) => quote !== null);
      } catch (error) {
        console.error("❌ Error fetching ZenQuotes:", error);
        throw new Error("Failed to fetch quotes from ZenQuotes API");
      }
    }
  },

  Mutation: {
    // Create a new user
    addUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(username, email, user._id);
      return { token, user };
    },

    // Login existing user
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Save a quote to user's collection
    saveQuote: async (_parent: any, { text, author }: { text: string; author?: string }, context: any) => {
      if (context.user) {
        const quote = await Quote.create({
          text,
          author,
          createdAt: new Date().toISOString(),
        });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedQuotes: quote._id } },
          { new: true }
        );

        return quote;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    // Remove a quote from user's collection
    removeQuote: async (_parent: any, { _id }: { _id: string }, context: any) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedQuotes: _id } },
          { new: true }
        ).populate('savedQuotes');

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

console.log("📌 Resolvers before export:", JSON.stringify(resolvers, null, 2));

if (Object.keys(resolvers.Query).length === 0) {
  console.error("❌ ERROR: No resolvers loaded. Check import paths.");
  process.exit(1);
}