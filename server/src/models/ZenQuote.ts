import mongoose, { Schema, Document } from "mongoose";

// Define interface for ZenQuote document
export interface IZenQuote extends Document {
  text: string;
  author: string;
  characterCount: number;
  htmlFormatted: string;
  imageUrl?: string;
  createdAt: Date;
}

// Create the ZenQuote schema
const ZenQuoteSchema = new Schema<IZenQuote>({
  text: { type: String, required: true },
  author: { type: String, required: true },
  characterCount: { type: Number, default: 0 }, // Added field
  htmlFormatted: { type: String, default: "" }, // Added field
  imageUrl: { type: String, default: null }, // Added field
  createdAt: { type: Date, default: Date.now },
});

// Create and export the ZenQuote model
export const ZenQuote = mongoose.model<IZenQuote>("ZenQuote", ZenQuoteSchema);

