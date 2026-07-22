"use client";

import { useEffect } from "react";

const STORAGE_KEY = "recentlyViewedCars";
const MAX_ITEMS = 8;

export default function RecentlyViewedTracker({ carId }) {
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const updated = [carId, ...existing.filter((id) => id !== carId)].slice(
        0,
        MAX_ITEMS,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage unavailable (private browsing, etc.) — safe to ignore.
    }
  }, [carId]);

  return null;
}
