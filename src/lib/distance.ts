// src/lib/distance.ts

// Define a simple interface to represent geographic coordinates
export interface Location {
  lat: number; // Latitude in decimal degrees
  lng: number; // Longitude in decimal degrees
}

/**
 * Haversine Distance Utility
 *
 * Calculate the great-circle distance between two points on Earth using the Haversine formula.
 * This accounts for Earth's curvature and returns distance in kilometers.
 */
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRadians(point2.lat - point1.lat); // Latitude difference in radians
  const dLng = toRadians(point2.lng - point1.lng); // Longitude difference in radians

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Return distance in kilometers
}

// Helper function to convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Distance Formatting Utility
 *
 * Convert a numeric distance into a human-readable string
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    // Less than 1 km, show in meters
    return `${Math.round(distance * 1000)}m away`;
  } else if (distance < 10) {
    // Between 1 km and 10 km, show 1 decimal place in km
    return `${distance.toFixed(1)}km away`;
  } else {
    // Greater than 10 km, round to nearest km
    return `${Math.round(distance)}km away`;
  }
}

/**
 * User Geolocation
 *
 * Get the user's current geographic location via the browser's Geolocation API
 */
export function getUserLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location success:", position.coords);
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);

        let errorMessage = "Location access denied";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions for this site.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location information unavailable. Check your GPS/network connection.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = `Location error: ${error.message}`;
            break;
        }

        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false, // Use standard accuracy for better browser compatibility
        timeout: 15000, // Maximum wait time of 15 seconds
        maximumAge: 300000, // Cache location for 5 minutes
      }
    );
  });
}
