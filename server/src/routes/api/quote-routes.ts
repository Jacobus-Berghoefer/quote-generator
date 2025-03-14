import express from "express";
import { fetchQuotes, saveQuote, getSavedQuotes } from "../../controllers/quote-controller";

const router = express.Router();

router.get("/fetch", fetchQuotes); // Fetch from ZenQuotes API
router.post("/save", saveQuote); // Save to MongoDB
router.get("/saved", getSavedQuotes); // Get saved quotes

export default router;
