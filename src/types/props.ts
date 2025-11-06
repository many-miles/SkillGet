// src/types/props.ts
/**
 * Form-related state
 *
 * Tracks form state, including errors and status messages.
 */
export interface FormState {
  error?: string; // Optional error message for validation or submission errors
  status?: string; // Optional status message (e.g., "loading", "success")
}
