"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const OPTIONS = ["new", "contacted", "closed"];

const STYLES = {
  new: "bg-brand-red/15 text-brand-red border-brand-red/40",
  contacted: "bg-brand-blue/15 text-brand-blue border-brand-blue/40",
  closed: "bg-white/10 text-[var(--text-secondary)] border-[var(--border)]",
};

export default function InquiryStatus({ id, status: initial }) {
  const supabase = createClient();
  const router = useRouter();
  const [status, setStatus] = useState(initial || "new");
  const [saving, setSaving] = useState(false);

  async function change(e) {
    const nextStatus = e.target.value;
    const prevStatus = status;
    setStatus(nextStatus);
    setSaving(true);
    const { error } = await supabase
      .from("inquiries")
      .update({ status: nextStatus })
      .eq("id", id);
    setSaving(false);
    if (error) {
      setStatus(prevStatus);
      return;
    }
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={change}
      disabled={saving}
      className={`text-xs font-semibold capitalize rounded-full border px-3 py-1.5 bg-transparent cursor-pointer disabled:opacity-60 ${
        STYLES[status] || STYLES.new
      }`}
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o} className="text-black">
          {o}
        </option>
      ))}
    </select>
  );
}
