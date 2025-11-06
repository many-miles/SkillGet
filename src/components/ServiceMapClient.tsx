// src/components/ServiceMapClient.tsx

"use client";

import dynamic from "next/dynamic";
import { MapService } from "@/types/service";

/**
 * Dynamically import the main ServiceMap component.
 * This ensures the map is only rendered on the client side,
 * preventing server-side rendering issues with Leaflet (which depends on `window`).
 */
const ServiceMap = dynamic(() => import("@/components/ServiceMap"), {
  ssr: false,
});

interface Props {
  services: MapService[];
  height?: string;
  zoom?: number;
}

/**
 * ServiceMapClient Component
 *
 * Lightweight wrapper that loads the full ServiceMap component.
 */
export default function ServiceMapClient({
  services,
  height = "500px",
  zoom = 12,
}: Props) {
  return <ServiceMap services={services} height={height} zoom={zoom} />;
}
