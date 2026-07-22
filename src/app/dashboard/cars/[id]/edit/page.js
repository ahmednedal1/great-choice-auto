import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CarForm from "@/components/CarForm";

export default async function EditCarPage({ params }) {
  const supabase = createClient();
  const { data: car } = await supabase
    .from("cars")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!car) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl">
        Edit {car.year} {car.make} {car.model}
      </h1>
      <div className="swoosh-divider w-16 mt-2 mb-8" />
      <CarForm car={car} />
    </div>
  );
}
