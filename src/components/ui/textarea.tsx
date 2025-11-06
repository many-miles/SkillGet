// src/components/ui/textarea.tsx

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Textarea Component
 *
 * Reusable textarea input with Tailwind styling and ref forwarding.
 * Supports consistent padding, borders, focus rings, disabled state,
 * and responsive font sizing. Can be used wherever multi-line text input
 * is needed in forms or content editors.
 *
 * @param className - Optional additional class names for custom styling
 * @param props - All standard HTML textarea props (value, onChange, placeholder, rows, etc.)
 * @param ref - Forwarded ref to access the underlying textarea element
 * @returns JSX textarea element
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

/* Export the Textarea component for reuse across the application */
export { Textarea };
