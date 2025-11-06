// src/lib/actions.ts

"use server";

import { writeFile, readFile } from "fs/promises";
import path from "path";
import { LocalUser } from "./local-storage"; // Import LocalUser type

/**
 * Server Action: Create a new service listing
 *
 * This function handles the creation of new service listings
 * submitted through the service creation form. It validates input,
 * processes the data, and persists
 * it to the JSON database file on the server.
 *
 * @param state - Previous form state (for error handling)
 * @param form - FormData object containing all form fields
 * @param pitch - Markdown-formatted detailed service description
 * @param location - Geographic coordinates {lat, lng} of service location
 * @returns Promise resolving to operation status and service ID or error
 */
// Define the Service type to match the structure in services.json
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
  contactMethod?: string;
  contactDetails?: string;
  serviceRadius: number;
  availability?: string[];
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

// Define the structure of services.json
interface ServicesData {
  services: Service[];
}

interface FormActionState {
  status: "INITIAL" | "SUCCESS" | "ERROR";
  error?: string;
  _id?: string;
}

export async function createPitch(
  state: FormActionState,
  form: FormData,
  pitch: string,
  location: { lat: number; lng: number },
  user: LocalUser | null
) {
  const title = form.get("title") as string;
  const description = form.get("description") as string;
  const category = form.get("category") as string;
  const link = form.get("link") as string;
  const priceRange = form.get("priceRange") as string;
  const contactMethod = form.get("contactMethod") as string;
  const contactDetails = form.get("contactDetails") as string;
  const serviceRadius = form.get("serviceRadius") as string;
  const availability = form.getAll("availability") as string[];

  try {
    if (!user) {
      return {
        ...state,
        status: "ERROR",
        error: "Authentication required",
      };
    }

    const filePath = path.join(process.cwd(), "src", "data", "services.json");

    // Ensure services.json exists
    let data: ServicesData = { services: [] };
    try {
      const fileContents = await readFile(filePath, "utf8");
      data = JSON.parse(fileContents) as ServicesData;
    } catch (error) {
      console.warn(
        "services.json not found or invalid, creating new file:",
        error
      );
    }

    const newService: Service = {
      _id: Date.now().toString(),
      _createdAt: new Date().toISOString(),
      title,
      slug: {
        current: title.toLowerCase().replace(/\s+/g, "-"),
      },
      description,
      category,
      image: link || undefined,
      pitch,
      location,
      priceRange: priceRange || undefined,
      contactMethod: contactMethod || undefined,
      contactDetails: contactDetails || undefined,
      serviceRadius: serviceRadius ? parseInt(serviceRadius) : 5,
      availability: availability && availability.length ? availability : [],
      author: {
        _id: user.id,
        name: user.name,
        username: user.email.split("@")[0],
        image: user.image,
        bio: "Service Provider",
      },
      views: 0,
      isActive: true,
      featured: false,
    };

    data.services.push(newService);
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

    return {
      ...state,
      status: "SUCCESS",
      _id: newService._id,
    };
  } catch (error) {
    console.error("Error creating service:", error);
    return {
      ...state,
      status: "ERROR",
      error: "Failed to create service. Please try again.",
    };
  }
}
