"use client";

import { useState } from "react";

export default function ContactForm({ car }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("idle");

  const carLabel = `${car.year} ${car.make} ${car.model}`;

  async function handleSubmit(e) {
    e.preventDefault();

    if (company) {
      setStatus("sent");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          company,
          carId: car.id,
          carLabel,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center">
        <p className="font-semibold">Thanks — we got your message!</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          We&apos;ll get back to you shortly about the {carLabel}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="font-display font-semibold text-lg">Ask About This Car</p>

      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <input
        required
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-transparent text-sm"
      />
      <input
        type="tel"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-transparent text-sm"
      />
      <input
        type="email"
        required
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-transparent text-sm"
      />
      <textarea
        required
        rows={3}
        placeholder={`I'm interested in the ${carLabel}...`}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-transparent text-sm"
      />

      {status === "error" && (
        <p className="text-brand-red text-sm">
          Something went wrong — please try again or contact us on WhatsApp
          instead.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 rounded-full border border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
