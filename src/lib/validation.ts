// src/lib/validation.ts

import { z } from "zod";

/**
 * Validation schema for service submission form.
 * Uses Zod to enforce rules on each field.
 */
export const formSchema = z.object({
  /**
   * Basic service information
   *
   * Service title: required, 3–100 characters
   */
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  // Short description: required, 20–500 characters
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be less than 500 characters"),

  // Category: required, must be one of the predefined options
  category: z.enum(
    [
      "accommodation",
      "surfing",
      "tours",
      "food",
      "transport",
      "home",
      "beauty",
      "events",
      "other",
    ],
    { message: "Please select a valid category" }
  ),

  // Optional image URL: must be a valid URL and point to an image
  // Performs HEAD request to check content type
  link: z
    .string()
    .url("Please enter a valid URL")
    .refine(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");
        return contentType?.startsWith("image/");
      } catch {
        return false;
      }
    }, "URL must be a valid image")
    .optional()
    .or(z.literal("")), // Allow empty string

  // Detailed service pitch: required, at least 10 characters
  pitch: z.string().min(10, "Service details must be at least 10 characters"),

  /**
   * Pricing and contact
   *
   * Price range: optional, must be one of the predefined options
   */
  priceRange: z
    .enum(["free", "budget", "moderate", "premium", "luxury", "quote"])
    .optional(),

  // Preferred contact method: optional, must be one of the allowed methods
  contactMethod: z.enum(["phone", "whatsapp", "email", "person"]).optional(),

  // Contact details: optional string (phone/email etc.)
  contactDetails: z.string().optional(),

  /**
   * Service radius
   *
   * Service radius in km: optional string input transformed into number
   * Ensures a default of 5 km if invalid, NaN, or out of 1–50 range
   */
  serviceRadius: z
    .string()
    .transform((val) => {
      const num = parseInt(val);
      if (isNaN(num) || num < 1 || num > 50) {
        return 5; // Default radius
      }
      return num;
    })
    .optional(),
});
