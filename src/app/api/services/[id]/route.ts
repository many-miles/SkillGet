// src/app/api/services/[id]/route.ts

import { NextResponse, NextRequest } from "next/server";
import servicesData from "@/data/services.json";

/**
 * API Route: /api/services/[id]
 *
 * Handles requests for individual service data based on service ID.
 *
 * GET:
 * - Extracts the `id` from the URL.
 * - Looks up the service in `services.json`.
 * - Returns 400 if the ID is missing.
 * - Returns 404 if the service is not found.
 * - Returns the service data as JSON if found.
 *
 * PATCH:
 * - Placeholder endpoint for updating the service's view count.
 * - Currently returns a success message for client-side view tracking.
 */

export async function GET(req: NextRequest) {
  const pathParts = req.nextUrl.pathname.split("/");
  const id = pathParts[pathParts.length - 1];

  if (!id) {
    return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
  }

  const service = servicesData.services.find((s) => s._id === id);

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  return NextResponse.json(service);
}

export async function PATCH() {
  return NextResponse.json({
    success: true,
    message: "View count updated client-side",
  });
}
