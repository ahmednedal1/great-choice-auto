"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/cars?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-white rounded-full p-1.5 max-w-xl mx-auto shadow-lg"
    >
      <Search size={18} className="ml-3 text-gray-400 flex-shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by make or model, e.g. Honda Civic"
        className="flex-1 py-2.5 bg-transparent text-black text-sm outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="px-6 py-2.5 rounded-full bg-brand-red text-white font-semibold text-sm hover:bg-brand-red/90 transition-colors flex-shrink-0"
      >
        Search
      </button>
    </form>
  );
}
