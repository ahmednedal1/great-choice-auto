import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  const { data: cars } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .order("created_at", { ascending: false });

  const { data: newInquiries } = await supabase
    .from("inquiries")
    .select("id")
    .eq("status", "new");

  const soldThisMonth =
    cars?.filter(
      (c) =>
        c.status === "sold" &&
        c.sold_at &&
        new Date(c.sold_at).getMonth() === new Date().getMonth(),
    ).length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl">Dashboard</h1>
          <div className="swoosh-divider w-16 mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/inquiries"
            className="px-5 py-2.5 rounded-full border border-[var(--border)] font-semibold text-sm hover:border-brand-red"
          >
            Inquiries
          </Link>
          <Link
            href="/dashboard/cars/new"
            className="px-5 py-2.5 rounded-full bg-brand-red text-white font-semibold text-sm"
          >
            + Add Car
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Listings" value={cars?.length ?? 0} />
        <StatCard label="Sold This Month" value={soldThisMonth} />
        <Link href="/dashboard/inquiries" className="block">
          <StatCard label="New Inquiries" value={newInquiries?.length ?? 0} />
        </Link>
      </div>

      {/* Listings — stacked cards on mobile, table on desktop */}
      <div>
        <p className="font-display font-semibold text-lg mb-4">My Listings</p>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
                <th className="py-3 pr-4">Car</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Listed</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {cars?.map((car) => (
                <DashboardRow key={car.id} car={car} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {cars?.map((car) => (
            <DashboardCard key={car.id} car={car} />
          ))}
        </div>

        {!cars?.length && (
          <p className="text-[var(--text-secondary)] text-center py-16 border border-dashed border-[var(--border)] rounded-2xl">
            No listings yet — add your first car.
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <p className="font-display font-bold text-3xl text-brand-red">{value}</p>
      <p className="text-xs text-[var(--text-secondary)] mt-1">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    available: "bg-brand-blue/15 text-brand-blue",
    reserved: "bg-yellow-500/15 text-yellow-500",
    sold: "bg-brand-red/15 text-brand-red",
    draft: "bg-white/10 text-[var(--text-secondary)]",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function DashboardRow({ car }) {
  return (
    <tr className="border-b border-[var(--border)]">
      <td className="py-3 pr-4">
        {car.year} {car.make} {car.model}
      </td>
      <td className="py-3 pr-4">${Number(car.price).toLocaleString()}</td>
      <td className="py-3 pr-4">
        <StatusBadge status={car.status} />
      </td>
      <td className="py-3 pr-4 text-[var(--text-secondary)]">
        {new Date(car.created_at).toLocaleDateString()}
      </td>
      <td className="py-3 pr-4">
        <Link
          href={`/dashboard/cars/${car.id}/edit`}
          className="text-brand-red font-semibold"
        >
          Edit
        </Link>
      </td>
    </tr>
  );
}

function DashboardCard({ car }) {
  const cover = car.car_images?.[0]?.image_url || "/placeholder-car.svg";
  return (
    <Link
      href={`/dashboard/cars/${car.id}/edit`}
      className="flex items-center gap-4 p-3 rounded-xl border border-[var(--border)]"
    >
      <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
        <Image src={cover} alt="" fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">
          {car.year} {car.make} {car.model}
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          ${Number(car.price).toLocaleString()}
        </p>
      </div>
      <StatusBadge status={car.status} />
    </Link>
  );
}
