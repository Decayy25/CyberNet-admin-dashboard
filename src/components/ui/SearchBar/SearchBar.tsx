import React, { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void | Promise<void>;
  onChange?: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

const SearchBar = ({
  onSearch,
  onChange,
  isLoading = false,
  placeholder = "Cari sesuatu...",
  value,
  defaultValue = "",
  className = "",
  inputClassName = "",
  buttonClassName = "",
}: SearchBarProps) => {
  const [query, setQuery] = useState(value ?? defaultValue);

  useEffect(() => {
    (async () => {
      if (value !== undefined) {
        setQuery(value);
      }
    })();
  }, [value]);

  const handleSearch = async () => {
    const trimmed = query.trim();
    onChange?.(trimmed);

    if (isLoading) return;
    await onSearch?.(trimmed);
    setQuery("");
    onChange?.("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setQuery(nextValue);
    onChange?.(nextValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void handleSearch();
    }
  };

  return (
    <div
      className={`flex items-center rounded-xl border border-gray-700 bg-[#111827] p-2 shadow-sm shadow-black/20 ${className}`}
    >
      <div className="flex items-center pl-2">
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="pointer-events-none w-5 fill-gray-400"
        >
          <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z" />
        </svg>
      </div>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className={`w-full min-w-45 bg-transparent pl-2 text-sm font-medium text-white outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60 ${inputClassName}`}
        placeholder={placeholder}
        id="search-input"
      />

      <button
        type="button"
        onClick={() => void handleSearch()}
        disabled={isLoading}
        className={`ml-2 flex min-w-22 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-600/50 ${buttonClassName}`}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500" />
        ) : (
          "Search"
        )}
      </button>
    </div>
  );
};

export default SearchBar;
