// src/components/ServiceMapWrapper.tsx

"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ServiceTypeCard } from "@/types/service";

// Dynamically import ServiceMap
const ServiceMap = dynamic(() => import("@/components/ServiceMap"), {
  ssr: false,
});

interface ServiceMapWrapperProps {
  services: Partial<ServiceTypeCard>[];
  center: [number, number];
  height?: string;
  zoom?: number;
}

/**
 * ServiceMapWrapper Component
 *
 * Wraps the client-side ServiceMap with Suspense.
 * Provides:
 * - Fallback UI while the map is loading
 * - Safe client-side only rendering
 * - Accepts services, map center, height, and zoom
 */
export default function ServiceMapWrapper({
  services,
  center,
  height,
  zoom,
}: ServiceMapWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
          <p>Loading map...</p>
        </div>
      }
    >
      <ServiceMap
        services={services}
        center={center}
        height={height}
        zoom={zoom}
      />
    </Suspense>
  );
}
