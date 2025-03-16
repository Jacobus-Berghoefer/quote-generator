import express from "express";
import {
  fetchQuotesByKeyword,
  fetchRandomQuote,
  fetchTodaysQuote,
  fetchQuotesByAuthor,
} from "../../controllers/quote-controller";

const router = express.Router();

router.get("/keyword", fetchQuotesByKeyword); // Search quotes by keyword
router.get("/random", fetchRandomQuote); // Get a random quote
router.get("/today", fetchTodaysQuote); // Get today's quote
router.get("/author", fetchQuotesByAuthor); // Search quotes by author

export default router;
