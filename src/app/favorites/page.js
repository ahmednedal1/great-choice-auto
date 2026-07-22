import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CarCard from "@/components/CarCard";

export default async function FavoritesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: favorites } = await supabase
    .from("favorites")
    .select("car:cars(*, car_images(*))")
    .eq("user_id", user.id);

  const cars = favorites?.map((f) => f.car).filter(Boolean) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl">My Favorites</h1>
      <div className="swoosh-divider w-16 mt-2 mb-8" />

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--text-secondary)] text-center py-16 border border-dashed border-[var(--border)] rounded-2xl">
          You haven&apos;t saved any cars yet.
        </p>
      )}
    </div>
  );
}
