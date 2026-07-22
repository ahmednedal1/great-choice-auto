"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

export default function InventoryFilters({ makes = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [make, setMake] = useState(searchParams.get("make") || "");
  const [bodyType, setBodyType] = useState(searchParams.get("bodyType") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [transmission, setTransmission] = useState(
    searchParams.get("transmission") || "",
  );
  const [fuelType, setFuelType] = useState(searchParams.get("fuelType") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  function applyFilters(e) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (bodyType) params.set("bodyType", bodyType);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (transmission) params.set("transmission", transmission);
    if (fuelType) params.set("fuelType", fuelType);
    if (sort) params.set("sort", sort);
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    setMake("");
    setBodyType("");
    setMinPrice("");
    setMaxPrice("");
    setTransmission("");
    setFuelType("");
    setSort("newest");
    router.push(pathname);
  }

  return (
    <form
      onSubmit={applyFilters}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
    >
      <select
        value={make}
        onChange={(e) => setMake(e.target.value)}
        className="input"
      >
        <option value="">All Makes</option>
        {makes.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        value={bodyType}
        onChange={(e) => setBodyType(e.target.value)}
        className="input"
      >
        <option value="">All Types</option>
        {["sedan", "suv", "truck", "coupe", "van", "hatchback", "wagon"].map(
          (t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ),
        )}
      </select>

      <input
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="input"
      />
      <input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="input"
      />

      <select
        value={transmission}
        onChange={(e) => setTransmission(e.target.value)}
        className="input"
      >
        <option value="">Any Transmission</option>
        <option>Automatic</option>
        <option>Manual</option>
      </select>

      <select
        value={fuelType}
        onChange={(e) => setFuelType(e.target.value)}
        className="input"
      >
        <option value="">Any Fuel Type</option>
        <option>Gasoline</option>
        <option>Diesel</option>
        <option>Hybrid</option>
        <option>Electric</option>
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="input"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="mileage_asc">Mileage: Low to High</option>
      </select>

      <div className="col-span-2 sm:col-span-3 lg:col-span-6 flex gap-3">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-full bg-brand-red text-white font-semibold text-sm"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="px-6 py-2.5 rounded-full border border-[var(--border)] font-semibold text-sm"
        >
          Clear
        </button>
      </div>

      <style jsx>{`
        .input {
          padding: 0.6rem 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-primary);
          color-scheme: light dark;
          font-size: 0.875rem;
        }
      `}</style>
    </form>
  );
}
