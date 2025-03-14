import { Request, Response } from "express";
import axios from "axios";

const ZEN_QUOTES_API = "https://zenquotes.io/api"; // Base URL

// Fetch quotes based on a keyword search
export const fetchQuotesByKeyword = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const response = await axios.get(`${ZEN_QUOTES_API}/quotes`);

    // Ensure response data is an array
    if (!Array.isArray(response.data)) {
      return res.status(500).json({ message: "Unexpected API response format" });
    }

    const quotes = response.data;

    if (!quotes || quotes.length === 0) {
      return res.status(404).json({ message: "No quotes found" });
    }

    // Filter quotes that contain the keyword
    const filteredQuotes = quotes.filter((quote: any) =>
      typeof quote.q === "string" &&
      quote.q.toLowerCase().includes((keyword as string).toLowerCase())
    );

    return res.json(filteredQuotes);
  } catch (error) {
    console.error("Error fetching quotes by keyword:", error);
    return res.status(500).json({ message: "Failed to fetch quotes" });
  }
};

// Fetch a random quote
export const fetchRandomQuote = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(`${ZEN_QUOTES_API}/random`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch random quote" });
  }
};

// Fetch today's quote
export const fetchTodaysQuote = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(`${ZEN_QUOTES_API}/today`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch today's quote" });
  }
};

// Fetch quotes by author
export const fetchQuotesByAuthor = async (req: Request, res: Response) => {
  try {
    const { author } = req.query;
    if (!author) {
      return res.status(400).json({ message: "Author is required" });
    }

    const response = await axios.get(`${ZEN_QUOTES_API}/quotes`);

    // Ensure response data is an array
    if (!Array.isArray(response.data)) {
      return res.status(500).json({ message: "Unexpected API response format" });
    }

    const quotes = response.data;

    if (!quotes || quotes.length === 0) {
      return res.status(404).json({ message: "No quotes found" });
    }

    // Filter quotes by author name
    const filteredQuotes = quotes.filter(
      (quote: any) =>
        typeof quote.a === "string" &&
        quote.a.toLowerCase() === (author as string).toLowerCase()
    );

    if (filteredQuotes.length === 0) {
      return res.status(404).json({ message: `No quotes found for author: ${author}` });
    }

    return res.json(filteredQuotes);
  } catch (error) {
    console.error("Error fetching quotes by author:", error);
    return res.status(500).json({ message: "Failed to fetch quotes by author" });
  }
};
