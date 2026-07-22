import { Star, ShieldCheck, BadgeCheck, Clock } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        <div className="flex items-center gap-2">
          <div className="flex text-brand-red">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <span className="text-sm font-semibold">4.9 out of 5</span>
          <span className="text-sm text-[var(--text-secondary)]">
            (from our Google reviews)
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <ShieldCheck size={18} className="text-brand-blue" />
          Every car inspected
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <BadgeCheck size={18} className="text-brand-blue" />
          Honest, upfront pricing
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Clock size={18} className="text-brand-blue" />
          10+ years serving the community
        </div>
      </div>
    </section>
  );
}
