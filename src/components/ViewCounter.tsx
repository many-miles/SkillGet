// src/components/ViewCounter.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { EyeIcon } from "lucide-react";
import { getServiceViews, incrementServiceView } from "@/lib/local-storage";

/**
 * This component tracks and displays how many times a specific service has been viewed.
 * It retrieves the current view count from local storage and increments it the first time
 * the component mounts for a given serviceId. The count is then kept in sync across browser
 * tabs using the 'storage' event. Optionally, the counter can be displayed as a floating
 * badge on the screen when the `floating` prop is set to true.
 */

export default function ViewCounter({
  serviceId,
  floating = false,
}: {
  serviceId: string;
  floating?: boolean;
}) {
  const hasIncremented = useRef(false);

  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    const viewsData = getServiceViews();
    const currentViews = viewsData[serviceId] || 0;

    if (!hasIncremented.current) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setViews(currentViews);

        setTimeout(() => {
          const newViews = incrementServiceView(serviceId);
          setViews(newViews);
        }, 0);

        hasIncremented.current = true;
      } catch (error) {
        console.error("Error updating view count:", error);
        setViews(currentViews); // Fallback to current count
      }
    } else {
      setViews(currentViews);
    }
  }, [serviceId]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedViews = getServiceViews();
      setViews(updatedViews[serviceId] || 0);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [serviceId]);

  const viewCountText = `${views} view${views !== 1 ? "s" : ""}`;

  if (floating) {
    return (
      <div className="fixed bottom-6 right-6 bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2 border border-gray-200 z-50">
        <EyeIcon className="w-5 h-5 text-gray-600" />
        <span className="font-medium" suppressHydrationWarning>
          {viewCountText}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
      <EyeIcon className="w-4 h-4" />
      <span suppressHydrationWarning>{viewCountText}</span>
    </div>
  );
}
