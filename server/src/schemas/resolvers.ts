import { User, Quote } from '../models/index.js';
import { AuthenticationError } from '../services/auth.js';
import { signToken } from '../services/auth.js';

export const resolvers = {
  Query: {
    // Get the logged in user with their saved quotes
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedQuotes');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Get all quotes (could be limited to admin in the future)
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
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      // Check password
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      // Sign token and return
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    // Save a quote to user's collection
    saveQuote: async (_parent: any, { text, author }: { text: string; author?: string }, context: any) => {
      if (context.user) {
        // Create the quote
        const quote = await Quote.create({
          text,
          author,
          createdAt: new Date().toISOString(),
        });

        // Add to user's saved quotes
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
    removeQuote: async (_parent: any, { quoteId }: { quoteId: string }, context: any) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedQuotes: quoteId } },
          { new: true }
        ).populate('savedQuotes');

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};
