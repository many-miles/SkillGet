// src/components/ServiceForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import dynamic from "next/dynamic";
import { Button } from "../components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "../lib/validation";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createPitch } from "../lib/actions";
import { toast } from "sonner";
import LocationPicker from "./LocationPicker";
import { getStoredUser } from "../lib/local-storage";

/**
 * The ServiceForm component provides a complete interface for users to create and publish
 * a new service listing. It includes fields for basic details, pricing, contact info, and
 * location selection via an interactive map. Input validation is handled with Zod, and the
 * data is submitted using the `createPitch` action. Upon successful submission, users are
 * redirected to the homepage, with visual feedback provided through toast notifications.
 */

// Dynamically import MDEditor
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>,
  }
);

// Inline styles for form elements
const serviceFormStyles = `
.service-form_label { display: block; font-weight: 600; font-size: 14px; color: #333; margin-bottom: 8px; }
.service-form_input, .service-form_textarea { width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; }
.service-form_input:focus, .service-form_textarea:focus { outline: none; border-color: #667eea; }
.service-form_error { color: #667eea; font-size: 12px; margin-top: 4px; }
`;

const ServiceForm: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const [location, setLocation] = useState({ lat: -34.0489, lng: 24.9087 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = serviceFormStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const categories = [
    { value: "accommodation", label: "Accommodation" },
    { value: "surfing", label: "Surfing Lessons" },
    { value: "tours", label: "Tours & Activities" },
    { value: "food", label: "Food & Catering" },
    { value: "transport", label: "Transport" },
    { value: "home", label: "Home Services" },
    { value: "beauty", label: "Beauty & Wellness" },
    { value: "events", label: "Events" },
    { value: "other", label: "Other" },
  ];

  const priceRanges = [
    { value: "free", label: "Free" },
    { value: "budget", label: "R0 - R100" },
    { value: "moderate", label: "R100 - R500" },
    { value: "premium", label: "R500 - R1000" },
    { value: "luxury", label: "R1000+" },
    { value: "quote", label: "Contact for Quote" },
  ];

  const contactMethods = [
    { value: "phone", label: "Phone" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "email", label: "Email" },
    { value: "person", label: "In Person" },
  ];

  const availabilityDays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const formValues = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      link: formData.get("link") as string,
      priceRange: formData.get("priceRange") as string,
      contactMethod: formData.get("contactMethod") as string,
      contactDetails: formData.get("contactDetails") as string,
      serviceRadius: formData.get("serviceRadius") as string,
      pitch,
    };

    try {
      await formSchema.parseAsync(formValues);

      const user = getStoredUser();
      if (!user) {
        toast.error("Please login to create a service");
        setIsSubmitting(false);
        return;
      }

      const result = await createPitch(
        { status: "INITIAL" },
        formData,
        pitch,
        location,
        user
      );

      if (result.status === "SUCCESS") {
        toast.success("Your service has been listed successfully!");
        router.push("/"); // Reliable redirect
        return;
      }

      toast.error(result.error || "Failed to create service");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast.error("Please check your inputs and try again");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="service-form max-w-4xl mx-auto space-y-6"
    >
      {/* Basic Information */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="service-form_label">
              Service Title *
            </label>
            <Input
              id="title"
              name="title"
              className="service-form_input"
              required
              placeholder="e.g. Professional Surfing Lessons"
            />
            {errors.title && (
              <p className="service-form_error">{errors.title}</p>
            )}
          </div>
          <div>
            <label htmlFor="category" className="service-form_label">
              Category *
            </label>
            <select
              id="category"
              name="category"
              className="service-form_input"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="service-form_error">{errors.category}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="service-form_label">
            Short Description *
          </label>
          <Textarea
            id="description"
            name="description"
            className="service-form_textarea"
            required
            placeholder="Brief description of your service (20-500 characters)"
          />
          {errors.description && (
            <p className="service-form_error">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Pricing & Contact */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Pricing & Contact</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priceRange" className="service-form_label">
              Price Range
            </label>
            <select
              id="priceRange"
              name="priceRange"
              className="service-form_input"
            >
              <option value="">Select price range</option>
              {priceRanges.map((price) => (
                <option key={price.value} value={price.value}>
                  {price.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="contactMethod" className="service-form_label">
              Preferred Contact Method
            </label>
            <select
              id="contactMethod"
              name="contactMethod"
              className="service-form_input"
            >
              <option value="">Select contact method</option>
              {contactMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contactDetails" className="service-form_label">
            Contact Information
          </label>
          <Input
            id="contactDetails"
            name="contactDetails"
            className="service-form_input"
            placeholder="Phone number, WhatsApp, or email"
          />
        </div>

        {/* Availability selection */}
        <div className="mt-4">
          <label className="service-form_label">
            Availability (select days)
          </label>
          <div className="flex flex-wrap gap-2">
            {availabilityDays.map((day) => (
              <label
                key={day.value}
                className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
              >
                <input
                  type="checkbox"
                  name="availability"
                  value={day.value}
                  className="form-checkbox"
                />
                <span className="text-sm capitalize">{day.label}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Select the days you are available to provide this service.
          </p>
        </div>
      </div>

      {/* Location & Coverage */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Service Location</h3>
        <div className="space-y-4">
          <div>
            <label className="service-form_label">
              📍 Select Your Service Location
            </label>
            <LocationPicker
              onLocationSelect={(lat, lng) => setLocation({ lat, lng })}
              initialLocation={location}
            />
            <p className="text-sm text-gray-500 mt-2">
              Click on the map to set your service location in Jeffreys Bay
            </p>
          </div>
          <div>
            <label htmlFor="serviceRadius" className="service-form_label">
              Service Radius (km)
            </label>
            <Input
              id="serviceRadius"
              name="serviceRadius"
              type="number"
              className="service-form_input"
              placeholder="5"
              min="1"
              max="50"
              defaultValue="5"
            />
            <p className="text-sm text-gray-500 mt-1">
              How far are you willing to travel from your location?
            </p>
          </div>
        </div>
      </div>

      {/* Image URL */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Service Image</h3>
        <div>
          <label htmlFor="link" className="service-form_label">
            Image URL
          </label>
          <Input
            id="link"
            name="link"
            className="service-form_input"
            placeholder="https://example.com/your-service-image.jpg"
          />
          {errors.link && <p className="service-form_error">{errors.link}</p>}
        </div>
      </div>

      {/* Detailed Description */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Detailed Description</h3>
        <div data-color-mode="light">
          <label htmlFor="pitch" className="service-form_label">
            Service Details
          </label>
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value as string)}
            id="pitch"
            preview="edit"
            height={300}
            style={{ borderRadius: 20, overflow: "hidden" }}
            textareaProps={{
              placeholder:
                "Describe your service in detail. Include what's included, requirements, experience level, etc.",
            }}
            previewOptions={{ disallowedElements: ["style"] }}
          />
          {errors.pitch && <p className="service-form_error">{errors.pitch}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="service-form_btn text-white w-full bg-primary hover:bg-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Publishing..." : "Publish Service"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default ServiceForm;
