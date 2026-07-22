import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";
import RecentlyViewedTracker from "@/components/RecentlyViewedTracker";
import CarCard from "@/components/CarCard";
import { Gauge, Fuel, Settings2, Calendar, Check } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import ImageGallery from "@/components/ImageGallery";

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const { data: car } = await supabase
    .from("cars")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!car) return {};

  return {
    title: `${car.year} ${car.make} ${car.model} — $${Number(car.price).toLocaleString()}`,
    description: car.description?.slice(0, 155),
  };
}

export default async function CarDetailPage({ params }) {
  const supabase = createClient();
  const { data: car } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("id", params.id)
    .single();

  if (!car) notFound();

  const images = car.car_images?.length
    ? [...car.car_images].sort((a, b) => a.sort_order - b.sort_order)
    : [{ image_url: "/placeholder-car.svg" }];

  // Similar cars: same make, excluding this one, non-draft, limit 3
  const { data: similarCars } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("make", car.make)
    .neq("id", car.id)
    .neq("status", "draft")
    .limit(3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pb-28 md:pb-10">
      {/* Side-effect only: records this car in localStorage, renders nothing */}
      <RecentlyViewedTracker carId={car.id} />

      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <ImageGallery
          images={images}
          alt={`${car.year} ${car.make} ${car.model}`}
          sold={car.status === "sold"}
        />

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display font-bold text-3xl">
              {car.year} {car.make} {car.model}
            </h1>
            <FavoriteButton carId={car.id} />
          </div>
          <div className="flex items-baseline gap-3 mt-3">
            {car.original_price && car.original_price > car.price && (
              <span className="text-lg text-[var(--text-secondary)] line-through">
                ${Number(car.original_price).toLocaleString()}
              </span>
            )}
            <span className="text-brand-red font-bold text-3xl">
              ${Number(car.price).toLocaleString()}
            </span>
          </div>

          <div className="swoosh-divider w-16 my-6" />

          {/* Specs — icon comparison grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Spec icon={Calendar} label="Year" value={car.year} />
            <Spec
              icon={Gauge}
              label="Mileage"
              value={car.mileage ? `${car.mileage.toLocaleString()} km` : "—"}
            />
            <Spec
              icon={Settings2}
              label="Transmission"
              value={car.transmission || "—"}
            />
            <Spec icon={Fuel} label="Fuel Type" value={car.fuel_type || "—"} />
          </div>

          {/* Features */}
          {car.features?.length > 0 && (
            <div className="mb-8">
              <p className="font-display font-semibold text-lg mb-3">
                Features
              </p>
              <div className="grid grid-cols-2 gap-2">
                {car.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check size={16} className="text-brand-red flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {car.description && (
            <div className="mb-8">
              <p className="font-display font-semibold text-lg mb-2">
                Description
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {car.description}
              </p>
            </div>
          )}

          {/* Desktop CTA */}
          <div className="hidden md:block mb-8">
            <WhatsAppButton car={car} />
          </div>

          {/* Contact form */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <ContactForm car={car} />
          </div>
        </div>
      </div>

      {/* Similar cars */}
      {similarCars && similarCars.length > 0 && (
        <div className="mt-16">
          <p className="font-display font-bold text-2xl mb-1">
            Similar Vehicles
          </p>
          <div className="swoosh-divider w-16 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCars.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg)] border-t border-[var(--border)] z-40">
        <WhatsAppButton car={car} sticky />
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)]">
      <div className="w-9 h-9 rounded-full bg-brand-red/10 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-brand-red" />
      </div>
      <div>
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
          {label}
        </p>
        <p className="font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  );
}
