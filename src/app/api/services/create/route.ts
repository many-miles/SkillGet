// src/app/api/services/create/route.ts

import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

/**
 * POST /api/services/create
 * Creates a new service and persists it to the JSON database
 *
 * This endpoint allows users to submit new service listings.
 * The service data is appended to the services.json file on the server,
 * ensuring persistence across sessions and making it available to all users.
 *
 * @param request - HTTP request containing service data in JSON body
 * @returns JSON response with created service or error message
 */
export async function POST(request: Request) {
  try {
    const newService = await request.json();

    // Define path to the JSON database file
    const filePath = path.join(process.cwd(), "src", "data", "services.json");

    const fileContents = await readFile(filePath, "utf8");
    const data = JSON.parse(fileContents);

    // Generate unique ID based on timestamp
    const serviceWithId = {
      ...newService,
      _id: Date.now().toString(),
      _createdAt: new Date().toISOString(),
      views: 0,
      isActive: true,
      featured: false,
    };

    // Append new service to existing services array
    data.services.push(serviceWithId);

    // Write updated data back to file with formatting
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

    // Return success response with created service
    return NextResponse.json(serviceWithId, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);

    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/services/create
 * Returns method not allowed for GET requests
 * This endpoint only accepts POST requests
 */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to create services." },
    { status: 405 }
  );
}
