// src/components/ServicesList.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { ServiceTypeCard } from "@/types/service";
import ServiceCard from "@/components/ServiceCard";
import { getUserLocation, calculateDistance } from "@/lib/distance";
import Link from "next/link";

/**
 * Services List Component
 *
 * Client-side wrapper that enriches the server-provided `initialServices`
 * with distance information when the user grants geolocation access.
 *
 * Distance is calculated once and persisted across category changes.
 */
export default function ServicesList({
  initialServices,
  query,
  currentCategory,
}: {
  initialServices: ServiceTypeCard[];
  query?: string;
  currentCategory?: string;
}) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [hasCheckedLocation, setHasCheckedLocation] = useState(false);

  useEffect(() => {
    if (hasCheckedLocation) return;

    let mounted = true;

    async function fetchUserLocation() {
      try {
        const loc = await getUserLocation();
        if (mounted) {
          setUserLocation(loc);
        }
      } catch (e) {
        console.log("Could not get user location:", e);
      } finally {
        if (mounted) {
          setHasCheckedLocation(true);
        }
      }
    }

    fetchUserLocation();

    return () => {
      mounted = false;
    };
  }, [hasCheckedLocation]);

  const services = useMemo(() => {
    if (!hasCheckedLocation || !userLocation) {
      return initialServices;
    }

    return initialServices.map((service) => ({
      ...service,

      distance: service.location
        ? calculateDistance(userLocation, service.location)
        : null,
    })) as ServiceTypeCard[];
  }, [initialServices, userLocation, hasCheckedLocation]);

  // Client-side filtering
  const filteredServices = query
    ? services.filter(
        (s) =>
          (s.title ?? "").toLowerCase().includes(query.toLowerCase()) ||
          (s.description ?? "").toLowerCase().includes(query.toLowerCase()) ||
          (s.author?.name ?? "").toLowerCase().includes(query.toLowerCase()) ||
          (s.author?.username ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : services;

  return (
    <ul className="mt-7 card_grid">
      {filteredServices.length > 0 ? (
        filteredServices.map((post) => (
          <li key={post._id}>
            <ServiceCard post={post} />
          </li>
        ))
      ) : (
        <li className="col-span-full">
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-2">No services found</p>
            {query && (
              <p className="text-sm text-gray-400">
                Try adjusting your search term or{" "}
                <Link href="/" className="text-primary hover:underline">
                  clear filters
                </Link>
              </p>
            )}
            {currentCategory && !query && (
              <p className="text-sm text-gray-400">
                No services in this category yet.{" "}
                <Link href="/" className="text-primary hover:underline">
                  View all services
                </Link>
              </p>
            )}
          </div>
        </li>
      )}
    </ul>
  );
}
