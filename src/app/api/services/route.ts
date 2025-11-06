// src/app/api/services/route.ts

import { NextResponse } from "next/server";
import servicesData from "@/data/services.json";
import { calculateDistance } from "@/lib/distance";
import type { ServiceTypeCard } from "@/types/service";

const typedServices = servicesData.services as ServiceTypeCard[];

/**
 * GET /api/services
 * Fetches a list of services, optionally filtered by search query or category.
 *
 * All services are loaded from the server-side JSON database.
 * This ensures all users see the same data including newly created services.
 *
 * @param request - Incoming HTTP GET request with optional searchParams
 *   - query: string to search in service titles or descriptions
 *   - category: filter services by category
 * @returns JSON array of services matching the filters
 */
export async function GET(request: Request) {
  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase();
  const category = searchParams.get("category");
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const maxDistanceParam = searchParams.get("maxDistance");
  const sortBy = searchParams.get("sortBy");
  const lat = latParam ? Number(latParam) : null;
  const lng = lngParam ? Number(lngParam) : null;
  const maxDistance = maxDistanceParam ? Number(maxDistanceParam) : null;

  // Start with all services from the server-side JSON database
  let services: ServiceTypeCard[] = [...typedServices];

  // Filter services by search query in title or description
  if (query) {
    services = services.filter(
      (service) =>
        service.title?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
    );
  }

  // Filter services by category if provided
  if (category) {
    services = services.filter((service) => service.category === category);
  }

  if (
    lat !== null &&
    lng !== null &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng)
  ) {
    const userLocation = { lat, lng };
    services = services.map((service) => ({
      ...service,
      distance: service.location
        ? calculateDistance(userLocation, service.location)
        : null,
    }));

    if (maxDistance !== null && !Number.isNaN(maxDistance)) {
      services = services.filter(
        (s) =>
          s.distance !== null &&
          s.distance !== undefined &&
          s.distance <= maxDistance
      );
    }

    if (sortBy === "distance") {
      services.sort(
        (a, b) =>
          (a.distance ?? Number.POSITIVE_INFINITY) -
          (b.distance ?? Number.POSITIVE_INFINITY)
      );
    }
  }

  return NextResponse.json(services);
}
