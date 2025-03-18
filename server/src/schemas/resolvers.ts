import dotenv from "dotenv";
dotenv.config();
console.log("✅ Loaded .env file");
console.log("🔍 API Key from .env:", process.env.ZENQUOTES_API_KEY);
import { User, Quote, ZenQuote } from '../models/index.js';
//import { IZenQuote } from "../models/ZenQuote.js";
import { AuthenticationError } from '../services/auth.js';
import { signToken } from '../services/auth.js';
import axios from 'axios';  // Import axios for API requests


interface ZenQuoteAPIResponse {
  q: string; // Quote text
  a?: string; // Author
  c?: string; // Character count
  h?: string; // Pre-formatted HTML quote
  i?: string; // Author image URL
}

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
      return await fetchZenQuotes("quotes");
    },

  // Fetch today's quote (should be based on the latest quote added today)
  zenQuoteToday: async () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD
    const quotes = await ZenQuote.find({ createdAt: { $gte: new Date(today) } }).sort({ createdAt: -1 });
    return quotes.length > 0 ? quotes[0] : await fetchZenQuotes("today").then((q) => (q.length > 0 ? q[0] : null));
  },

  // Fetch a truly random quote (select a random document)
  zenQuoteRandom: async () => {
    const count = await ZenQuote.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomQuote = await ZenQuote.findOne().skip(randomIndex);
    return randomQuote || (await fetchZenQuotes("random").then((q) => (q.length > 0 ? q[0] : null)));
  },

    // Fetch quotes by a specific author
    zenQuoteByAuthor: async (_parent: any, { author }: { author: string }) => {
      if (!author || author.trim() === "") {
        throw new Error("❌ Author name cannot be empty.");
      }
    
      return await fetchZenQuotes("author", author);
    },
    
    // Fetch quotes by keyword
    zenQuoteByKeyword: async (_parent: any, { keyword }: { keyword: string }) => {
      if (!keyword || keyword.trim() === "") {
        throw new Error("❌ Keyword cannot be empty.");
      }
    
      const quotes = await fetchZenQuotes("keyword", undefined, keyword);
      return quotes; // Now correctly returns IZenQuoteDTO[]
    },    
    
  },

  Mutation: {
    // Create a new user
    addUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(username, email, user._id);
      return { token, user };
    },

    // Login existing user
    login: async (_parent: any, { username, password }: { username: string; password: string }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new AuthenticationError('No user found with this username');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user: { ...user.toObject(), password: undefined } };
    },

    // Save a quote to user's collection
    saveQuote: async (_parent: any, { text, author}: { text: string; author: string }, context: any) => {
      if (context.user) {
        const quote = await Quote.create({
          text,
          author,
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

interface IZenQuoteDTO {
  text: string;
  author: string;
  characterCount: number;
  htmlFormatted: string;
  createdAt: Date;
}

// Utility function to fetch ZenQuotes API and store results in MongoDB
interface IZenQuoteDTO {
  text: string;
  author: string;
  characterCount: number;
  htmlFormatted: string;
  createdAt: Date;
}

const fetchZenQuotes = async (mode: string, author?: string, keyword?: string): Promise<IZenQuoteDTO[]> => {
  try {
    const API_KEY = process.env.ZENQUOTES_API_KEY;
    if (!API_KEY) {
      throw new Error("❌ API Key is missing! Make sure it's set in the .env file.");
    }

    let url = `https://zenquotes.io/api/${mode}?apikey=${API_KEY}`;

    console.log(`🔍 Fetching ZenQuotes from: ${url}`);

    // Handle author-based quote search
    if (mode === "author" && author) {
      url = `https://zenquotes.io/api/author?apikey=${API_KEY}&name=${encodeURIComponent(author.trim())}`;
    }
    // Handle keyword-based quote search
    else if (mode === "keyword" && keyword) {
      url = `https://zenquotes.io/api/quotes/${API_KEY}&keyword=${encodeURIComponent(keyword.trim().toLowerCase())}`;
    }    

    console.log(`🔍 Fetching ZenQuotes from: ${url}`);

    const response = await axios.get<ZenQuoteAPIResponse[]>(url);
    
    console.log(`🔍 Raw API Response:`, JSON.stringify(response.data, null, 2)); // Debugging log

    if (!response.data || response.data.length === 0) {
      console.warn(`⚠️ No quotes found for mode: ${mode} (keyword: ${keyword || "N/A"})`);
      return [];
    }

    // Convert API response into IZenQuoteDTO objects
    const processedQuotes: IZenQuoteDTO[] = response.data.map((quoteData) => ({
      text: quoteData.q,
      author: quoteData.a || "Unknown",
      characterCount: quoteData.c ? parseInt(quoteData.c, 10) : 0,
      htmlFormatted: quoteData.h || "",
      createdAt: new Date(),
    }));

    return processedQuotes;
  } catch (error) {
    console.error(`❌ Error fetching ZenQuotes: ${error}`);
    throw new Error(`Failed to fetch quotes from ZenQuotes API: ${mode}${keyword ? ` (keyword: ${keyword})` : ""}`);
  }
};




console.log("📌 Resolvers before export:", JSON.stringify(resolvers, null, 2));

if (Object.keys(resolvers.Query).length === 0) {
  console.error("❌ ERROR: No resolvers loaded. Check import paths.");
  process.exit(1);
}