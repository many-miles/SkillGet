// src/app/service/[id]/page.tsx (server component)

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { promises as fs } from "fs";
import path from "path";
// import servicesData from "@/data/services.json";
import ServiceMapWrapper from "@/components/ServiceMapWrapper";
import { PhoneIcon, DollarSignIcon, RadiusIcon } from "lucide-react";
import { ContactMethod, ServiceTypeCard } from "@/types/service";
import ViewCounter from "@/components/ViewCounter";
import ServiceDistance from "@/components/ServiceDistance";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * ServicePage Component
 *
 * Displays detailed information for a single service, including:
 * - Service title, description, and image
 * - Provider info and contact option
 * - Pricing, and service area
 * - Location map with directions
 *
 * This is a server component in Next.js and fetches service data
 * from the JSON database based on the dynamic route parameter `id`.
 *
 * @param params - URL parameters object containing the service ID as a Promise
 * @returns JSX for the service detail page
 */
export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params object to extract service ID
  const { id } = await params;

  const filePath = path.join(process.cwd(), "src", "data", "services.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const servicesData = JSON.parse(fileContents) as {
    services: ServiceTypeCard[];
  };

  // Prepare services data with proper types and defaults
  const services = servicesData.services.map((s) => ({
    ...s,
    contactMethod: (s.contactMethod as ContactMethod) || null,
    serviceRadius: s.serviceRadius ? Number(s.serviceRadius) : null,
    availability: s.availability || [],
  }));

  // Find the specific service by ID
  const service = services.find((s) => s._id === id);

  // If service not found, render 404 page
  if (!service) {
    notFound();
  }

  // Helper function to display human-readable price ranges
  const getPriceDisplay = (price: string) => {
    const priceMap: Record<string, string> = {
      free: "Free",
      budget: "R0 - R100",
      moderate: "R100 - R500",
      premium: "R500 - R1000",
      luxury: "R1000+",
      quote: "Contact for Quote",
    };
    return priceMap[price] || price;
  };

  return (
    <>
      {/* View counter component floating on page */}
      <ViewCounter serviceId={service._id} floating={true} />

      {/* Header section with service title, date, and category */}
      <section className="hero_container min-h-[300px]! relative overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 w-full max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <p className="tag">{formatDate(service._createdAt)}</p>
            {service.category && (
              <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {service.category}
              </span>
            )}
          </div>

          <h1 className="heading">{service.title}</h1>
          <p className="sub-heading max-w-5xl!">{service.description}</p>
        </div>
      </section>

      {/* Main content section */}
      <section className="section_container">
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          {/* Service image if available */}
          {service.image && (
            <Image
              src={service.image}
              alt="service thumbnail"
              width={1200}
              height={600}
              className="w-full h-auto max-h-96 object-cover rounded-xl"
            />
          )}

          <div className="space-y-5">
            {/* Author and contact info */}
            <div className="flex flex-col md:flex-row justify-between gap-5">
              {/* Author details */}
              <div className="flex gap-2 items-center">
                <Image
                  src={service.author?.image || "/default-avatar.png"}
                  alt="avatar"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-20-medium">
                    {service.author?.name || "Unknown Provider"}
                  </p>
                  <p className="text-14-normal text-gray-500">
                    Service Provider
                  </p>
                </div>
              </div>

              {/* Contact button depending on method */}
              {service.contactDetails && (
                <a
                  href={
                    service.contactMethod === "whatsapp"
                      ? `https://wa.me/${service.contactDetails.replace(/\D/g, "")}`
                      : service.contactMethod === "email"
                        ? `mailto:${service.contactDetails}`
                        : `tel:${service.contactDetails}`
                  }
                  className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors text-center font-medium"
                >
                  Contact Provider
                </a>
              )}
            </div>

            {/* Service details section */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <h3 className="text-20-semibold mb-4">Service Information</h3>

              {/* Price display */}
              {service.priceRange && (
                <p className="flex items-center gap-2">
                  <DollarSignIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Price:</span>{" "}
                  {getPriceDisplay(service.priceRange)}
                </p>
              )}

              {/* Contact method display */}
              {service.contactMethod && (
                <p className="flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Contact via:</span>{" "}
                  {service.contactMethod}
                </p>
              )}

              {/* Service radius display */}
              {service.serviceRadius && (
                <p className="flex items-center gap-2">
                  <RadiusIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Service area:</span>{" "}
                  {service.serviceRadius}km radius
                </p>
              )}

              {/* Approx distance from user (client-side) */}
              <ServiceDistance location={service.location} />

              {/* Availability schedule */}
              {service.availability?.length ? (
                <p className="flex items-start gap-2">
                  <span className="font-medium">Available:</span>
                  <span>{service.availability.join(", ")}</span>
                </p>
              ) : null}
            </div>

            {/* Detailed description / pitch */}
            <div>
              <h3 className="text-30-bold mb-4">About This Service</h3>
              <div className="prose max-w-none">
                {service.pitch ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: service.pitch.replace(/\n/g, "<br/>"),
                    }}
                  />
                ) : (
                  <p>No detailed description available.</p>
                )}
              </div>
            </div>

            {/* Location map section */}
            {service.location && (
              <div>
                <h3 className="text-30-bold mb-4">Location</h3>
                <ServiceMapWrapper
                  services={[service]}
                  center={[service.location.lat, service.location.lng]}
                  height="400px"
                  zoom={15}
                />
                {/* Directions link to Google Maps */}
                <div className="mt-4 text-center">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${service.location.lat},${service.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Back button */}
          <div className="text-center pt-6">
            <Link href="/" className="text-primary hover:underline">
              ← Back to all services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
