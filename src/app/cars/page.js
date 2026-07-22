import { createClient } from "@/lib/supabase/server";
import CarCard from "@/components/CarCard";
import InventoryFilters from "@/components/InventoryFilters";

export const metadata = {
  title: "Inventory",
  description: "Browse our full inventory of quality used cars.",
};

export default async function InventoryPage({ searchParams }) {
  const supabase = createClient();

  let query = supabase
    .from("cars")
    .select("*, car_images(*)")
    .neq("status", "draft");

  if (searchParams?.q) {
    query = query.or(
      `make.ilike.%${searchParams.q}%,model.ilike.%${searchParams.q}%`,
    );
  }
  if (searchParams?.bodyType)
    query = query.eq("body_type", searchParams.bodyType);
  if (searchParams?.make) query = query.ilike("make", `%${searchParams.make}%`);
  if (searchParams?.minPrice)
    query = query.gte("price", Number(searchParams.minPrice));
  if (searchParams?.maxPrice)
    query = query.lte("price", Number(searchParams.maxPrice));
  if (searchParams?.transmission)
    query = query.eq("transmission", searchParams.transmission);
  if (searchParams?.fuelType)
    query = query.eq("fuel_type", searchParams.fuelType);

  switch (searchParams?.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "mileage_asc":
      query = query.order("mileage", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: cars } = await query;

  // Distinct makes for the filter dropdown, pulled from live inventory
  const { data: allCars } = await supabase
    .from("cars")
    .select("make")
    .neq("status", "draft");
  const makes = [...new Set((allCars ?? []).map((c) => c.make))].sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl mb-1">
        {searchParams?.q ? `Results for "${searchParams.q}"` : "Inventory"}
      </h1>
      <div className="swoosh-divider w-16 mb-8" />

      <InventoryFilters makes={makes} />

      {cars && cars.length > 0 ? (
        <>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            {cars.length} {cars.length === 1 ? "car" : "cars"} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-[var(--text-secondary)] text-center py-16 border border-dashed border-[var(--border)] rounded-2xl">
          No cars match your filters right now — try clearing a filter or check
          back soon.
        </p>
      )}
    </div>
  );
}
