"use client";

import { useState } from "react";
import ServiceMapClient from "@/components/ServiceMapClient";
import servicesData from "@/data/services.json";
import { MapService, PriceRange } from "@/types/service";

/**
 * MapPage Component
 *
 * Displays a map of all services in Jeffreys Bay with interactive markers.
 * Also provides a category breakdown with counts and icons for quick reference.
 *
 * This page converts service data from the server-side JSON database into a
 * format suitable for the map component and renders both the map and UI elements.
 */

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  // Convert all services for counting
  const allServices: MapService[] = servicesData.services
    .filter(
      (s): s is typeof s & { location: { lat: number; lng: number } } =>
        !!s.location
    )
    .map((s) => ({
      _id: s._id,
      title: s.title || null,
      category: (s.category as string | null) || null,
      location: s.location, //
      priceRange: (s.priceRange as PriceRange) ?? undefined,
      author: s.author
        ? {
            _id: s.author._id,
            name: s.author.name || null,
            username: s.author.username || null,
            image: s.author.image || null,
            bio: s.author.bio || null,
          }
        : null,
    }));

  // Filter services for map display based on selected category
  const filteredServices =
    selectedCategory === "all"
      ? allServices
      : allServices.filter((s) => s.category === selectedCategory);

  return (
    <>
      {/* Header section */}
      <section className="hero_container min-h-[200px]">
        <h1 className="heading">Service Map</h1>
        <p className="sub-heading">Explore all services in Jeffreys Bay</p>
      </section>

      {/* Main content section */}
      <section className="section_container">
        {/* Map display */}
        <div className="mb-6">
          <h2 className="text-30-semibold mb-4">
            {filteredServices.length} Services on Map
          </h2>

          <ServiceMapClient
            services={filteredServices} // Pass filtered services to map
            height="600px"
            zoom={13} // Initial map zoom level
          />
        </div>

        {/* Category breakdown grid */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {/* All Services option */}
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full bg-white border-2 ${
              selectedCategory === "all"
                ? "border-primary shadow-lg bg-linear-to-br from-primary/5 to-[#764ba2]/5"
                : "border-gray-200 hover:border-primary/50"
            } rounded-lg p-4 text-center transition-all transform hover:scale-105`}
          >
            <p className="text-3xl mb-2">🗺️</p>
            <p className="font-semibold">All Services</p>
          </button>

          {/* Individual categories */}
          {Array.from(
            new Set(
              servicesData.services.map((s) => s.category).filter(Boolean)
            ) // Unique categories
          ).map((category) => {
            // Count number of services in this category using allServices
            const count = allServices.filter(
              (s) => s.category === category
            ).length;

            // Assign emoji to each category for visual reference
            const categoryEmoji: Record<string, string> = {
              surfing: "🏄‍♂️",
              accommodation: "🏠",
              food: "🍽️",
              transport: "🚗",
              beauty: "💆‍♀️",
              tours: "🗺️",
              events: "🎉",
            };

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as string)}
                className={`w-full bg-white border-2 ${
                  selectedCategory === category
                    ? "border-primary shadow-lg bg-linear-to-br from-primary/5 to-[#764ba2]/5"
                    : "border-gray-200 hover:border-primary/50"
                } rounded-lg p-4 text-center transition-all transform hover:scale-105`}
              >
                {/* Emoji icon for category */}
                <p className="text-3xl mb-2">
                  {categoryEmoji[category || ""] || "📌"}
                </p>
                {/* Category name and service count */}
                <p className="font-semibold capitalize">
                  {count} {category}
                </p>
              </button>
            );
          })}
        </div>

        {/* Info box with tips */}
        <div className="mt-8 bg-blue-50 border-l-4 border-primary p-4 rounded">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Click on any map marker to see service
            details and contact information.
          </p>
        </div>
      </section>
    </>
  );
}
