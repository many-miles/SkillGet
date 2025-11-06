// src/components/ui/sonner.tsx

"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

/**
 * ToasterProps
 *
 * Inherits all props from the Sonner Toaster component.
 * Allows customization of toast notifications such as duration,
 * position, and additional styling.
 */
type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Toaster Component
 *
 * Wrapper around the Sonner Toaster component that integrates
 * theme switching via `next-themes`. Automatically applies
 * the current theme (light/dark/system) to the toast notifications.
 *
 * Customizes toast styling using Tailwind classes for:
 * - Toast container
 * - Description text
 * - Action buttons (primary)
 * - Cancel buttons (muted)
 *
 * @param props - All standard Sonner Toaster props (position, duration, etc.)
 * @returns The themed Toaster component
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme(); // Get current theme from next-themes

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]} // Apply current theme
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

/* Export the themed Toaster for use throughout the app */
export { Toaster };
