import express from "express";
import quoteRoutes from "./api/quote-routes.js";

const router = express.Router();

router.use("/quotes", quoteRoutes);

export default router;
