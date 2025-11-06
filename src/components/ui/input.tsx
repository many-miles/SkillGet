// src/components/ui/input.tsx

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input Component
 *
 * Reusable input field with Tailwind styling and support for ref forwarding.
 * Applies consistent padding, border, focus ring, disabled styles, and file input styling.
 * Can be used for text, email, password, or any standard HTML input type.
 *
 * @param className - Optional additional class names for custom styling
 * @param type - HTML input type (text, email, password, etc.)
 * @param props - All other standard HTML input props (value, onChange, placeholder, etc.)
 * @param ref - Forwarded ref for accessing the input element directly
 * @returns JSX input element
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

/* Export the Input component for use throughout the app */
export { Input };
