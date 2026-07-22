import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import InquiryStatus from "@/components/InquiryStatus";
import { whatsappHref } from "@/lib/shop";
import { Phone, Mail, MessageCircle, ArrowLeft } from "lucide-react";

export const metadata = { title: "Inquiries" };

export default async function InquiriesPage() {
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

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*, car:cars(id, year, make, model)")
    .order("created_at", { ascending: false });

  const list = inquiries ?? [];
  const newCount = list.filter((i) => i.status === "new").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-brand-red mb-4"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl">Inquiries</h1>
          <div className="swoosh-divider w-16 mt-2" />
        </div>
        <span className="text-sm text-[var(--text-secondary)]">
          {newCount} new · {list.length} total
        </span>
      </div>

      <div className="mt-8 space-y-4">
        {list.map((inq) => {
          const carLabel = inq.car
            ? `${inq.car.year} ${inq.car.make} ${inq.car.model}`
            : "General inquiry";
          const waText = `Hi${
            inq.name ? " " + inq.name : ""
          }, thanks for your interest in the ${carLabel} at Great Choice Auto Sales.`;
          return (
            <div
              key={inq.id}
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{inq.name || "Anonymous"}</p>
                    <span
                      className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
                        inq.channel === "whatsapp"
                          ? "bg-[#25D366]/15 text-[#25D366]"
                          : "bg-brand-blue/15 text-brand-blue"
                      }`}
                    >
                      {inq.channel}
                    </span>
                  </div>
                  {inq.car ? (
                    <Link
                      href={`/cars/${inq.car.id}`}
                      className="text-sm text-brand-red hover:underline"
                    >
                      {carLabel}
                    </Link>
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)]">
                      {carLabel}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {new Date(inq.created_at).toLocaleString()}
                  </span>
                  <InquiryStatus id={inq.id} status={inq.status} />
                </div>
              </div>

              {inq.message && (
                <p className="text-sm text-[var(--text-secondary)] mt-3 whitespace-pre-line">
                  {inq.message}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {inq.phone && (
                  <a
                    href={`tel:${inq.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--border)] hover:border-brand-red"
                  >
                    <Phone size={13} /> {inq.phone}
                  </a>
                )}
                {inq.phone && (
                  <a
                    href={whatsappHref(waText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--border)] hover:border-[#25D366]"
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                )}
                {inq.email && (
                  <a
                    href={`mailto:${inq.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--border)] hover:border-brand-blue"
                  >
                    <Mail size={13} /> {inq.email}
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {list.length === 0 && (
          <p className="text-[var(--text-secondary)] text-center py-16 border border-dashed border-[var(--border)] rounded-2xl">
            No inquiries yet. Messages from the contact form and WhatsApp will
            show up here.
          </p>
        )}
      </div>
    </div>
  );
}
