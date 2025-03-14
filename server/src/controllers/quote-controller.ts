import { Request, Response } from "express";
import axios from "axios";
import { Quote } from "../models/Quote";

// Fetch quotes from ZenQuotes API
export const fetchQuotes = async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://zenquotes.io/api/quotes");
    const quotes = response.data;
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quotes" });
  }
};

// Save a quote to the database
export const saveQuote = async (req: Request, res: Response) => {
  try {
    const { text, author, category } = req.body;
    const newQuote = new Quote({ text, author, category });
    await newQuote.save();
    res.json(newQuote);
  } catch (error) {
    res.status(500).json({ message: "Error saving quote" });
  }
};

// Get saved quotes from the database
export const getSavedQuotes = async (req: Request, res: Response) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved quotes" });
  }
};
