// src/components/ServiceCard.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  EyeIcon,
  MapPinIcon,
  PhoneIcon,
  DollarSignIcon,
  RadiusIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { formatDistance } from "@/lib/distance";
import { ServiceTypeCard } from "@/types/service";
import { getServiceViews } from "@/lib/local-storage";

/**
 * The ServiceCard component renders a summary card for a single service listing.
 * It displays key information such as title, category, description, pricing, contact method,
 * service radius, and author details. The component also shows the number of views in real-time,
 * updating via localStorage events. Optional features include a featured badge, service image,
 * and approximate distance display. Each card links to the detailed service page.
 */

interface ServiceCardProps {
  post: ServiceTypeCard;
}

export default function ServiceCard({ post }: ServiceCardProps) {
  const {
    _id,
    _createdAt,
    title,
    category,
    image,
    description,
    author,
    priceRange,
    contactMethod,
    serviceRadius,
    location,
  } = post;

  /**
   * View counter - Real-time tracking
   * Fetches current view count from localStorage on mount and storage events.
   * This ensures the card shows the latest view count even after other users
   * view the service in different tabs.
   */

  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    const updateViews = () => {
      const viewsData = getServiceViews();
      setViews(viewsData[_id] || 0);
    };

    updateViews();

    window.addEventListener("storage", updateViews);
    return () => window.removeEventListener("storage", updateViews);
  }, [_id]);

  const getPriceDisplay = (price: string | null) => {
    if (!price) return null;
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
    <article className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all flex flex-col relative">
      {post.featured && (
        <div className="absolute top-3 right-3 z-10 bg-amber-100 text-black text-[10px] font-extrabold px-2 py-1 rounded-lg border-2 border-black shadow-md uppercase tracking-wide">
          Featured
        </div>
      )}

      {image && (
        <Link href={`/service/${_id}`} className="relative block aspect-video">
          <Image
            src={image}
            alt={title || "Service image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      )}

      <div className="flex flex-col grow p-4 space-y-3">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p>{formatDate(_createdAt)}</p>
          <div className="flex items-center gap-1">
            <EyeIcon className="w-4 h-4" />
            <span suppressHydrationWarning>
              {views} view{views !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div>
          <Link href={`/service/${_id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
              {title || "Untitled Service"}
            </h3>
          </Link>
          {category && (
            <p className="text-xs text-gray-500 uppercase mt-1">{category}</p>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        )}

        <div className="space-y-1 text-sm text-gray-700 pt-2 border-t border-gray-100">
          {location && (
            <p className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-500" />
              <span>Jeffreys Bay</span>
            </p>
          )}

          {post.distance != null && (
            <p className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-500" />
              <span>{formatDistance(post.distance)}</span>
            </p>
          )}

          {priceRange && (
            <p className="flex items-center gap-2">
              <DollarSignIcon className="w-4 h-4 text-gray-500" />
              <span>{getPriceDisplay(priceRange)}</span>
            </p>
          )}

          {serviceRadius && (
            <p className="flex items-center gap-2">
              <RadiusIcon className="w-4 h-4 text-gray-500" />
              <span>{serviceRadius} km radius</span>
            </p>
          )}

          {contactMethod && (
            <p className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-gray-500" />
              <span className="capitalize">{contactMethod} available</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2">
            {author?.image ? (
              <Image
                src={author.image}
                alt={author.name ?? "Service Image"}
                width={28}
                height={28}
                className="rounded-full border border-gray-200"
              />
            ) : (
              <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">
                  {(author?.name || "A")[0].toUpperCase()}
                </span>
              </span>
            )}
            <p className="text-sm font-medium text-gray-800 truncate">
              {author?.name || "Service Provider"}
            </p>
          </div>

          <Link
            href={`/service/${_id}`}
            className="bg-primary text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
