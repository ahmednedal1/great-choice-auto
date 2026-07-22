import Link from "next/link";
import { Car, Truck, CarFront, Caravan } from "lucide-react";

const TYPES = [
  { label: "Sedan", icon: CarFront, query: "sedan" },
  { label: "SUV", icon: Car, query: "suv" },
  { label: "Truck", icon: Truck, query: "truck" },
  { label: "Coupe", icon: CarFront, query: "coupe" },
  { label: "Van", icon: Caravan, query: "van" },
];

export default function ShopByType() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <h2 className="font-display font-bold text-2xl md:text-3xl text-center">
        Shop by Type
      </h2>
      <div className="swoosh-divider w-16 mx-auto mt-2 mb-8" />

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
        {TYPES.map(({ label, icon: Icon, query }) => (
          <Link
            key={label}
            href={`/cars?bodyType=${query}`}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-brand-red hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center">
              <Icon size={22} className="text-brand-red" />
            </div>
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
