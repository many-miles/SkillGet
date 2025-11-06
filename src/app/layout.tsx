// src/app/layout.tsx

import type { Metadata } from "next";
import { Work_Sans } from "next/font/google"; // Import from Google Fonts
import Navbar from "@/components/Navbar";
import "./globals.css";
import "easymde/dist/easymde.min.css";
import { Toaster } from "@/components/ui/sonner";

/**
 * RootLayout component wraps all pages of the application.
 * - Provides the global HTML structure including <html> and <body> tags.
 * - Loads the Work Sans Google font with multiple weights and sets it as a CSS variable.
 * - Includes the Navbar at the top and a Toaster for global notifications.
 * - Renders the page-specific content inside the <main> element.
 */

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "400", "500", "600", "700", "800", "900"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SGDirectory",
  description: "Connect with trusted local service providers in Jeffreys Bay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={workSans.variable}>
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
