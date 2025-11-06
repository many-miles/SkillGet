// src/components/LocationPicker.tsx

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/**
 * LocationPicker component provides an interactive Leaflet map for selecting a location.
 * - Users can click on the map to set a marker and choose coordinates.
 * - Defaults to Jeffreys Bay if no initial location is provided.
 * - Coordinates are passed to the parent via the `onLocationSelect` callback.
 * - Handles Leaflet marker icon setup to work correctly in Next.js.
 * - Displays an info panel showing the selected coordinates and whether they are within
 *   the Jeffreys Bay area.
 */

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// Component Props
interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

/**
 * LocationMarker
 * - Handles map clicks to update position
 * - Renders a marker if position is set
 */
function LocationMarker({
  position,
  onLocationSelect,
}: {
  position: [number, number] | null;
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  if (!position) return null;
  return <Marker position={position} />;
}

/**
 * LocationPicker
 * - Interactive Leaflet map for selecting a location
 * - Defaults to Jeffreys Bay if no initial location
 * - Displays coordinates and area check
 */
const LocationPicker = ({
  onLocationSelect,
  initialLocation,
}: LocationPickerProps) => {
  const [isClient] = useState(true);
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation
      ? [initialLocation.lat, initialLocation.lng]
      : [-34.0489, 24.9087]
  );

  /**
   * Fix default Leaflet marker icons
   * Leaflet's default markers won't load properly in Next.js without this fix.
   */
  useEffect(() => {
    const iconProto = L.Icon.Default.prototype as unknown as Record<
      string,
      unknown
    >;
    delete iconProto._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    if (!initialLocation) {
      onLocationSelect(-34.0489, 24.9087);
    }
  }, [initialLocation, onLocationSelect]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  if (!isClient) {
    return (
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p>Loading map...</p>
      </div>
    );
  }

  // Render map and info panel
  return (
    <div className="space-y-2">
      {/* Map Container */}
      <div className="h-64 rounded-lg overflow-hidden border-2 border-gray-300 relative-z-0">
        <MapContainer
          className="z-0"
          center={position || [-34.0489, 24.9087]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            onLocationSelect={handleLocationSelect}
          />
        </MapContainer>
      </div>

      {/* Info Panel */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p>
          <strong>📍 Click on the map</strong> to set your service location
        </p>
        {position && (
          <p className="mt mt-1">
            Selected: {position[0].toFixed(4)}, {position[1].toFixed(4)}
            {Math.abs(position[0] - -34.0489) < 0.3 &&
            Math.abs(position[1] - 24.9087) < 0.3
              ? " (Jeffreys Bay area ✅)"
              : " (Outside Jeffreys Bay ⚠️)"}
          </p>
        )}
      </div>
    </div>
  );
};

// Export component
export default LocationPicker;
