// src/lib/local-storage.ts

// Define the structure of a locally stored user
export type LocalUser = {
  id: string; // Unique user ID
  name: string; // User's display name
  email: string; // User's email address
  image: string; // URL for user's avatar/image
  createdAt: string; // ISO timestamp of when the user was created
};

// Retrieve the stored user from localStorage, or return null if not found
export const getStoredUser = (): LocalUser | null => {
  if (typeof window === "undefined") return null; // Prevent SSR errors
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null; // Parse JSON string if exists
};

// Save a user object to localStorage
export const setStoredUser = (user: LocalUser) => {
  if (typeof window === "undefined") return; // Avoid errors on server
  localStorage.setItem("user", JSON.stringify(user)); // Store as JSON string
};

// Remove the stored user from localStorage (logout)
export const removeStoredUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
};

/**
 * Service Views Handling
 *
 * Retrieve view counts for services from localStorage
 */
export const getServiceViews = () => {
  if (typeof window === "undefined") return {}; // Prevent SSR issues
  const views = localStorage.getItem("serviceViews");
  return views ? JSON.parse(views) : {}; // Return empty object if none
};

// Increment the view count for a specific service and save it
export const incrementServiceView = (serviceId: string) => {
  if (typeof window === "undefined") return 0; // SSR guard
  const views = getServiceViews(); // Load current views
  const currentViews = views[serviceId] || 0; // Default to 0 if none
  views[serviceId] = currentViews + 1; // Increment by 1
  localStorage.setItem("serviceViews", JSON.stringify(views)); // Save updated
  return views[serviceId]; // Return updated count
};
