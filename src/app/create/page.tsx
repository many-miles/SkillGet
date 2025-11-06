"use client";

import dynamic from "next/dynamic";

/**
 * Create Service Page
 *
 * This page lets users create a new service listing.
 * It includes a hero section with a title/subtitle and
 * a dynamically loaded ServiceForm component (client-side only).
 */

const ServiceForm = dynamic(() => import("@/components/ServiceForm"), {
  ssr: false,
  loading: () => <div>Loading form...</div>,
});

export default function CreateService() {
  return (
    <>
      <section className="hero_container min-h-[200px]">
        <h1 className="heading">Create New Service</h1>
        <p className="sub-heading">List your service in Jeffreys Bay</p>
      </section>

      <section className="section_container max-w-3xl">
        <ServiceForm />
      </section>
    </>
  );
}
