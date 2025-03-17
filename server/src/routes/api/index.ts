import express from "express";
import quoteRoutes from "./quote-routes.js";

const router = express.Router();

router.use("/quotes", quoteRoutes);

export default router;

