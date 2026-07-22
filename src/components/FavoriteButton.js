"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function FavoriteButton({ carId, floating = false }) {
  const supabase = createClient();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function checkFavorite() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("car_id", carId)
        .maybeSingle();

      setIsFavorited(Boolean(data));
    }
    checkFavorite();
  }, [carId]);

  async function toggleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      router.push("/login");
      return;
    }

    if (isFavorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("car_id", carId);
      setIsFavorited(false);
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: userId, car_id: carId });
      setIsFavorited(true);
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className={
        floating
          ? "absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/70 transition-colors z-10"
          : "w-11 h-11 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-brand-red transition-colors"
      }
    >
      <Heart
        size={18}
        className={
          isFavorited
            ? "text-brand-red"
            : floating
              ? "text-white/80"
              : "text-[var(--text-secondary)]"
        }
        fill={isFavorited ? "currentColor" : "none"}
        strokeWidth={2}
      />
    </button>
  );
}
