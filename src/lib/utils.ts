// src/lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple CSS class names into a single string.
 * - Uses `clsx` to handle conditional classes and arrays.
 * - Uses `twMerge` to intelligently merge Tailwind classes,
 *   avoiding duplicates or conflicting classes (e.g., `px-2 px-4`).
 * @param inputs - Array of class names, conditionals, or arrays
 * @returns A single merged string of class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a human-readable format.
 * Example: "2025-10-16T06:30:47.806Z" → "October 16, 2025"
 * @param date - ISO date string
 * @returns Formatted date string in "Month Day, Year" format
 */
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
