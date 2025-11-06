//src/app/page.tsx

import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import ServicesList from "@/components/ServicesList";
import { ServiceTypeCard, ContactMethod } from "@/types/service";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Define the Service type
interface Service {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  description: string;
  category: string;
  image?: string;
  pitch: string;
  location: { lat: number; lng: number };
  priceRange?: string;
  contactMethod?: ContactMethod;
  contactDetails?: string;
  serviceRadius: number;
  author: {
    _id: string;
    name: string;
    username: string;
    image: string;
    bio: string;
  };
  views: number;
  isActive: boolean;
  featured: boolean;
}

interface ServicesData {
  services: Service[];
}

/**
 * Home Page Component (Server Component)
 *
 * Main landing page displaying all service listings with search and filter capabilities.
 * Features:
 * - Server-side rendering for SEO and performance
 * - Real-time search filtering
 * - Category-based filtering
 * - Responsive grid layout
 *
 * Services are loaded dynamically from the JSON database file at runtime.
 *
 * @param searchParams - URL parameters for search and filters
 * @returns Home page with service listings
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Await search params
  const params = await searchParams;

  // Extract query and category, handle both string and array cases
  const queryRaw = typeof params.query === "string" ? params.query : "";
  const category = typeof params.category === "string" ? params.category : "";
  const query = queryRaw?.toLowerCase();

  // Load services dynamically from services.json
  let allServices: ServiceTypeCard[] = [];
  try {
    const filePath = path.join(process.cwd(), "src", "data", "services.json");
    const fileContents = await readFile(filePath, "utf8");
    const data = JSON.parse(fileContents) as ServicesData;
    allServices = (data?.services ?? []).map((s) => ({
      ...s,
      contactMethod: s.contactMethod as ContactMethod,
      serviceRadius: Number(s.serviceRadius),
    }));
  } catch (error) {
    console.error("Error reading services:", error);
  }

  let services = [...allServices];

  if (category) {
    services = services.filter((s) => s.category === category);
  }

  if (query) {
    services = services.filter(
      (s) =>
        (s.title ?? "").toLowerCase().includes(query) ||
        (s.description ?? "").toLowerCase().includes(query) ||
        (s.author?.name ?? "").toLowerCase().includes(query) ||
        (s.author?.username ?? "").toLowerCase().includes(query)
    );
  }

  const uniqueCategories = Array.from(
    new Set(
      allServices
        .map((s) => s.category)
        .filter((cat): cat is string => Boolean(cat))
    )
  ).sort();

  const categoryOrder = [
    "accommodation",
    "surfing",
    "tours",
    "food",
    "transport",
    "beauty",
    "events",
    "home",
    "other",
  ];

  // Sort categories by defined order
  const categories = uniqueCategories.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <>
      {/* Hero Section with Search */}
      <section className="hero_container">
        <h1 className="heading">
          Find Local Services in <br />
          Jeffreys Bay
        </h1>
        <p className="sub-heading max-w-3xl!">
          Connect with local service providers, from surfing lessons to
          accommodation
        </p>

        {/* Search form */}
        <SearchForm query={queryRaw} />
      </section>

      {/* Main Content Section */}
      <section className="section_container">
        {/* Results Header */}
        <p className="text-30-semibold">
          {queryRaw
            ? `Search results for "${queryRaw}"`
            : category
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Services`
              : "All Services"}
        </p>

        {/* Category Filter Pills */}
        <div className="flex gap-2 flex-wrap mt-4 mb-6">
          {categories.map((cat) => {
            const isActive = category === cat;
            const count = allServices.filter((s) => s.category === cat).length;

            return (
              <Link
                key={cat}
                href={`/?category=${cat}`}
                scroll={false}
                prefetch={false}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-linear-to-r from-primary to-[#764ba2] text-white scale-105 shadow-md"
                    : "bg-white border border-gray-300 hover:border-primary hover:scale-105"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
              </Link>
            );
          })}

          {/* Clear Filters Button */}
          {(queryRaw || category) && (
            <Link
              href="/"
              scroll={false}
              prefetch={false}
              className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-all"
            >
              ✕ Clear Filters
            </Link>
          )}
        </div>

        {/* Service count */}
        <p className="text-sm text-gray-600 mb-4">
          Showing {services.length} of {allServices.length} service
          {services.length !== 1 ? "s" : ""}
        </p>

        {/* Services Grid */}
        <ServicesList
          initialServices={services}
          query={query}
          currentCategory={category}
        />
      </section>
    </>
  );
}
