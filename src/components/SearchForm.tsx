// src/components/SearchForm.tsx

import Form from "next/form";
import SearchFormReset from "../components/SearchFormReset";
import { Search } from "lucide-react";

/**
 * SearchForm component:
 * - Renders a search input for services
 * - Shows a reset button if a query exists
 * - Submits the form via Next.js Form component
 */
const SearchForm = ({ query }: { query?: string }) => {
  return (
    <Form action="/" scroll={false} className="search-form">
      {/* Search input field */}
      <input
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search by service name, description, or provider..."
      />

      {/* Buttons: reset (if query) + submit */}
      <div className="flex gap-2">
        {query && <SearchFormReset />}

        <button title="button" type="submit" className="search-btn text-white">
          <Search className="size-5" />
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;
