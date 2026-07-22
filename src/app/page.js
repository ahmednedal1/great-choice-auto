import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CarCard from "@/components/CarCard";
import HeroSearch from "@/components/HeroSearch";
import ShopByType from "@/components/ShopByType";
import TrustStrip from "@/components/TrustStrip";

export default async function HomePage() {
  const supabase = createClient();
  const { data: cars } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .neq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-black text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-red/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <p className="uppercase tracking-[0.3em] text-xs text-brand-chrome mb-4">
            Trusted local dealer
          </p>
          <h1 className="font-display font-bold text-4xl md:text-6xl leading-tight">
            Find your <span className="chrome-text">great choice</span>
            <br />
            <span className="text-brand-red">on four wheels.</span>
          </h1>
          <div className="swoosh-divider w-32 mx-auto my-8" />
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Every car on our lot is inspected, honestly priced, and ready to
            drive. Browse the inventory or message us directly on WhatsApp.
          </p>
          <div className="mb-8">
            <HeroSearch />
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/cars"
              className="px-8 py-3.5 rounded-full bg-brand-red font-semibold hover:bg-brand-red/90 transition-colors"
            >
              View Inventory
            </Link>
            <Link
              href="/#contact"
              className="px-8 py-3.5 rounded-full border border-white/30 font-semibold hover:border-white transition-colors"
            >
              Visit The Lot
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip />

      <ShopByType />

      {/* Featured inventory */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl">
              Featured Vehicles
            </h2>
            <div className="swoosh-divider w-16 mt-2" />
          </div>
          <Link
            href="/cars"
            className="text-sm font-semibold text-brand-red hover:underline"
          >
            See all →
          </Link>
        </div>

        {cars && cars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-secondary)] text-center py-16 border border-dashed border-[var(--border)] rounded-2xl">
            No cars listed yet. Add your first car from the owner dashboard.
          </p>
        )}
      </section>

      {/* Why buy from us */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-center mb-10">
            Why Buy From Us
          </h2>
          <div className="grid gap-10 sm:grid-cols-3 text-center">
            <div>
              <p className="font-display font-bold text-3xl text-brand-red">
                10+
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Years in business
              </p>
            </div>
            <div>
              <p className="font-display font-bold text-3xl text-brand-red">
                500+
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Cars sold
              </p>
            </div>
            <div>
              <p className="font-display font-bold text-3xl text-brand-red">
                5★
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Average customer rating
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
