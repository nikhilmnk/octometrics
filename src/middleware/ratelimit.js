import rateLimit from "express-rate-limit";
import { config } from '../config/config.js';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minute window
  max: config.API_RATE_LIMIT, // Requests per IP per minute from config
  standardHeaders: true,      // Return RateLimit-* headers
  legacyHeaders: false,       // Disable X-RateLimit-* headers
  message: "Too many requests from this IP, please try again later.",
  statusCode: 429
});
