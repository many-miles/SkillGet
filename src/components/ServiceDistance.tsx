"use client";

import { useEffect, useState } from "react";
import { MapPinIcon } from "lucide-react";
import {
  Location,
  calculateDistance,
  formatDistance,
  getUserLocation,
} from "@/lib/distance";

/**
 * The ServiceDistance component calculates and displays the approximate distance
 * between the user’s current location and a provided service location. It uses
 * geolocation data retrieved via `getUserLocation()` and computes the distance
 * with `calculateDistance()`, formatting it for display. While the distance is
 * being determined, a loading message is shown. If location data is missing,
 * the component renders nothing.
 */

export default function ServiceDistance({
  location,
}: {
  location?: Location | null;
}) {
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(!location ? false : true);

  useEffect(() => {
    if (!location) {
      return;
    }

    let mounted = true;

    getUserLocation()
      .then((userLoc) => {
        if (!mounted) return;
        const d = calculateDistance(userLoc, location!);
        setDistance(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [location]);

  if (!location || distance === null) return null;

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-gray-600">
        <MapPinIcon className="w-4 h-4 text-gray-500" />
        <span>Calculating distance…</span>
      </p>
    );
  }

  return (
    <p className="flex items-center gap-2 text-sm text-gray-700">
      <MapPinIcon className="w-4 h-4 text-gray-500" />
      <span>Approximately {formatDistance(distance)}</span>
    </p>
  );
}
