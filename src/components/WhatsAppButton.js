"use client";

import { createClient } from "@/lib/supabase/client";
import { whatsappHref } from "@/lib/shop";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({ car, sticky = false }) {
  const isSold = car.status === "sold";

  async function handleClick() {
    if (isSold) return;

    const message = `Hi, I'm interested in the ${car.year} ${car.make} ${car.model} ($${Number(
      car.price,
    ).toLocaleString()}) — is it still available?`;

    const waUrl = whatsappHref(message);

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      supabase
        .from("inquiries")
        .insert({
          car_id: car.id,
          user_id: userData?.user?.id ?? null,
          channel: "whatsapp",
          message,
        })
        .then(() => {});
    } catch (err) {
      console.error("Could not log WhatsApp inquiry:", err);
    }

    window.open(waUrl, "_blank");
  }

  const baseClasses =
    "flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-white transition-colors";

  if (isSold) {
    return (
      <button
        disabled
        className={`${baseClasses} bg-white/10 text-white/50 cursor-not-allowed`}
      >
        This car has been sold
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} bg-[#25D366] hover:bg-[#1fbd5a] ${
        sticky ? "shadow-lg" : ""
      }`}
    >
      <MessageCircle size={18} />
      Contact on WhatsApp
    </button>
  );
}
