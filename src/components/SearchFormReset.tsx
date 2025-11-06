// src/components/SearchFormReset.tsx

"use client";

import Link from "next/link";
import { X } from "lucide-react";

/**
 * SearchFormReset component:
 * - Renders a reset button for the search form
 *  - Clears the input when clicked
 *  - Navigates back to the homepage
 */
const SearchFormReset = () => {
  // Reset function to clear the search form
  const reset = () => {
    const form = document.querySelector(".search-form") as HTMLFormElement;
    if (form) form.reset();
  };

  return (
    <button type="reset" onClick={reset}>
      {/* Styled link acting as reset button */}
      <Link href="/" className="search-btn text-white">
        <X className="size-5" />
      </Link>
    </button>
  );
};

export default SearchFormReset;
