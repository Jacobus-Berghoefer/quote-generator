import { User, Quote, ZenQuote } from '../models/index.js';
import { IZenQuote } from "../models/ZenQuote.js";
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

      return await fetchZenQuotes("keyword", keyword);
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


// Utility function to fetch ZenQuotes API and store results in MongoDB
const fetchZenQuotes = async (mode: string, author?: string, keyword?: string): Promise<IZenQuote[]> => {
  try {
    let url = `https://zenquotes.io/api/${mode}`;

    if (mode === "author" && author) {
      url = `https://zenquotes.io/api/author/${encodeURIComponent(author.trim())}`;
    } else if (mode === "keyword" && keyword) {
      url = `https://zenquotes.io/api/quotes/&keyword=${encodeURIComponent(keyword.trim())}`;
    }

    console.log(`🔍 Fetching ZenQuotes from: ${url}`);

    let storedQuotes: IZenQuote[] = [];

    if (mode === "quotes") {
      storedQuotes = await ZenQuote.find().lean();
    } else if (mode === "random" || mode === "today") {
      const singleQuote = await ZenQuote.findOne().sort({ createdAt: -1 }).lean();
      storedQuotes = singleQuote ? [singleQuote] : [];
    } else if (mode === "author" && author) {
      storedQuotes = await ZenQuote.find({ author: new RegExp(`^${author}$`, "i") }).lean();
    } else if (mode === "keyword" && keyword) {
      storedQuotes = await ZenQuote.find({ text: new RegExp(keyword, "i") }).lean();
    }

    if (storedQuotes.length > 0) {
      console.log(`✅ Returning cached quotes from MongoDB (mode: ${mode}, keyword: ${keyword || "N/A"})`);
      return storedQuotes;
    }

    const response = await axios.get<ZenQuoteAPIResponse[]>(url);

    if (!response.data || response.data.length === 0) {
      console.warn(`⚠️ No quotes found for mode: ${mode} (keyword: ${keyword || "N/A"})`);
      return [];
    }

    const processedQuotes = await Promise.all(
      response.data.map(async (quoteData): Promise<IZenQuote | null> => {
        try {
          const text = quoteData.q;
          const author = quoteData.a;
          const characterCount = quoteData.c ? parseInt(quoteData.c, 10) : 0;
          const htmlFormatted = quoteData.h || null;

          let existingQuote = await ZenQuote.findOne({ text }).lean();

          if (!existingQuote) {
            console.log("➕ Adding new quote:", text);
            const newQuote = await ZenQuote.create({
              text,
              author,
              characterCount,
              htmlFormatted,
              createdAt: new Date(),
            });

            return newQuote.toObject() as IZenQuote;
          } else {
            console.log("✅ Skipping duplicate quote:", text);
            return existingQuote;
          }
        } catch (innerError) {
          console.error("❌ Error processing individual quote:", innerError);
          return null;
        }
      })
    );

    return processedQuotes.filter((quote): quote is IZenQuote => quote !== null);
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