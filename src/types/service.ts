// src/types/service.ts

/**
 * Main service card interface
 *
 * Represents a service listing displayed as a card.
 */
export interface ServiceTypeCard {
  _id: string; // Unique identifier for the service
  title?: string | null; // Service title (optional, can be null)
  slug: { current: string }; // URL-friendly slug object
  _createdAt: string; // ISO date string of creation
  author?: {
    // Service author/owner (optional)
    _id: string; // Author ID
    name: string | null; // Author name
    username: string | null; // Author username
    image: string | null; // Author avatar URL
    bio: string | null; // Short bio of the author
  } | null;
  image?: string; // URL to service image
  category?: string | null; // Service category (e.g., "surfing")
  description?: string; // Short description of the service
  priceRange?: string; // Price range (free, budget, premium, etc.)
  contactMethod?: ContactMethod | null; // Preferred contact method
  contactDetails?: string | null; // Contact info (phone, email, etc.)
  serviceRadius?: number | null; // Service coverage radius in km
  availability?: string[]; // Days or times service is available
  location?: {
    // Optional coordinates
    lat: number;
    lng: number;
  };
  featured?: boolean; // Flag to mark featured services
  pitch?: string; // Detailed pitch or description in markdown
  views?: number; // Number of views for analytics
  distance?: number | null;
}

/**
 * Basic type aliases
 */

// Allowed price ranges for a service
export type PriceRange =
  | "free"
  | "budget"
  | "moderate"
  | "premium"
  | "luxury"
  | "quote"
  | string;

// Allowed contact methods for a service
export type ContactMethod = "phone" | "whatsapp" | "email" | "person";

/**
 * Supporting interfaces
 */

// Represents a geographic location
export interface ServiceLocation {
  lat: number;
  lng: number;
}

// Represents a service author
export interface ServiceAuthor {
  _id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  bio: string | null;
}

/**
 * Map-specific service type
 *
 * Simplified service type optimized for map rendering.
 * Ensures location is always present.
 */
export interface MapService {
  _id: string;
  title: string | null;
  category: string | null;
  location: ServiceLocation; // Required for map marker
  priceRange: PriceRange | undefined;
  author: ServiceAuthor | null;
}

/**
 * Search/filter parameters
 *
 * Parameters used for filtering or searching services.
 * At the moment only categories and searches are filtered, other implementations might follow in future
 */
export interface ServiceSearchParams {
  query?: string; // Search term (service title or description)
  category?: string; // Filter by category
  priceRange?: PriceRange[]; // Filter by multiple price ranges
  maxDistance?: number; // Filter services within a distance (km)
  availability?: string[]; // Filter by available days/times
  sortBy?: "distance" | "date" | "views"; // Sort option
  hasContactInfo?: boolean; // Only include services with contact info
}
