//src/components/ui/button.tsx

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * buttonVariants
 * Utility function to generate Tailwind class strings based on
 * variant and size props using class-variance-authority (CVA).
 * Variants control visual style (color, background, hover effects).
 * Sizes control height, padding, and text size.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * ButtonProps
 * Extends standard HTML button attributes with:
 * - variant: Visual style of the button
 * - size: Height, padding, text size
 * - asChild: If true, renders a Radix Slot instead of a <button>
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Button Component
 * Reusable button component supporting multiple variants and sizes.
 * Can render as a standard <button> or wrap another element via `asChild`.
 * Applies Tailwind styles dynamically based on props.
 *
 * @param className - Optional additional classes
 * @param variant - Button visual style variant
 * @param size - Button size variant
 * @param asChild - If true, renders as Radix Slot for polymorphic behavior
 * @param props - Standard button HTML props
 * @returns JSX element for a styled button
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

/* Export Button component and buttonVariants utility */
export { Button, buttonVariants };
