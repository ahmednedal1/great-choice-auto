import Link from "next/link";
import Image from "next/image";
import { Gauge, Fuel, Settings2, Calendar } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

export default function CarCard({ car }) {
  const isSold = car.status === "sold";
  const coverImage =
    car.car_images?.find((img) => img.is_cover)?.image_url ||
    car.car_images?.[0]?.image_url ||
    "/placeholder-car.svg";

  return (
    <Link
      href={`/cars/${car.id}`}
      className="group block rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] hover:border-brand-red/50 hover:shadow-xl transition-all"
    >
      <div className="relative aspect-[4/3] bg-black/20">
        <Image
          src={coverImage}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isSold && (
          <div className="absolute top-3 left-3 bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Sold
          </div>
        )}
        {!isSold && car.original_price && car.original_price > car.price && (
          <div className="absolute top-3 left-3 bg-brand-blue text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Price Drop
          </div>
        )}
        <FavoriteButton carId={car.id} floating />
      </div>

      <div className="p-4">
        <p className="font-display font-semibold text-lg leading-tight">
          {car.year} {car.make} {car.model}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          {car.original_price && car.original_price > car.price && (
            <span className="text-sm text-[var(--text-secondary)] line-through">
              ${Number(car.original_price).toLocaleString()}
            </span>
          )}
          <span className="text-brand-red font-bold text-xl">
            ${Number(car.price).toLocaleString()}
          </span>
        </div>

        {/* Carwow-style icon spec row */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3 pt-3 border-t border-[var(--border)]">
          <SpecIcon icon={Calendar} value={car.year} />
          <SpecIcon
            icon={Gauge}
            value={car.mileage ? `${car.mileage.toLocaleString()} km` : "—"}
          />
          <SpecIcon icon={Settings2} value={car.transmission || "—"} />
          <SpecIcon icon={Fuel} value={car.fuel_type || "—"} />
        </div>
      </div>
    </Link>
  );
}

function SpecIcon({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
      <Icon size={14} className="flex-shrink-0 text-brand-red" />
      <span className="truncate">{value}</span>
    </div>
  );
}
