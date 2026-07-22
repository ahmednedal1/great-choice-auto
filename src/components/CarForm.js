"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BODY_TYPE_OPTIONS = [
  "sedan",
  "suv",
  "truck",
  "coupe",
  "van",
  "hatchback",
  "wagon",
];

const FEATURE_OPTIONS = [
  "Bluetooth",
  "Backup Camera",
  "Sunroof",
  "Leather Seats",
  "Heated Seats",
  "Alloy Wheels",
  "Navigation",
  "Cruise Control",
  "Keyless Entry",
  "Apple CarPlay / Android Auto",
];

export default function CarForm({ car }) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = Boolean(car);

  const [form, setForm] = useState({
    make: car?.make || "",
    model: car?.model || "",
    year: car?.year || new Date().getFullYear(),
    price: car?.price || "",
    original_price: car?.original_price || "",
    mileage: car?.mileage || "",
    fuel_type: car?.fuel_type || "Gasoline",
    transmission: car?.transmission || "Automatic",
    body_type: car?.body_type || "sedan",
    description: car?.description || "",
    features: car?.features || [],
    status: car?.status || "available",
  });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleFeature(feature) {
    setForm((f) => ({
      ...f,
      features: f.features.includes(feature)
        ? f.features.filter((x) => x !== feature)
        : [...f.features, feature],
    }));
  }

  async function uploadImages(carId) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = `${carId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("car-images")
        .upload(path, file);
      if (uploadError) continue;

      const {
        data: { publicUrl },
      } = supabase.storage.from("car-images").getPublicUrl(path);

      await supabase.from("car_images").insert({
        car_id: carId,
        image_url: publicUrl,
        sort_order: i,
        is_cover: i === 0,
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      mileage: form.mileage ? Number(form.mileage) : null,
      sold_at: form.status === "sold" ? new Date().toISOString() : null,
    };

    let carId = car?.id;

    if (isEditing) {
      const { error } = await supabase
        .from("cars")
        .update(payload)
        .eq("id", carId);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("cars")
        .insert(payload)
        .select()
        .single();
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
      carId = data.id;
    }

    if (files.length > 0) await uploadImages(carId);

    setSaving(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Make">
          <input
            required
            value={form.make}
            onChange={(e) => update("make", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Model">
          <input
            required
            value={form.model}
            onChange={(e) => update("model", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Year">
          <input
            type="number"
            required
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Mileage (km)">
          <input
            type="number"
            value={form.mileage}
            onChange={(e) => update("mileage", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Price ($)">
          <input
            type="number"
            required
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Original Price ($) — optional, shows as strikethrough">
          <input
            type="number"
            value={form.original_price}
            onChange={(e) => update("original_price", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Type">
          <select
            value={form.body_type}
            onChange={(e) => update("body_type", e.target.value)}
            className="input"
          >
            {BODY_TYPE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fuel Type">
          <select
            value={form.fuel_type}
            onChange={(e) => update("fuel_type", e.target.value)}
            className="input"
          >
            {["Gasoline", "Diesel", "Hybrid", "Electric"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Transmission">
          <select
            value={form.transmission}
            onChange={(e) => update("transmission", e.target.value)}
            className="input"
          >
            {["Automatic", "Manual"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="input"
          >
            {["draft", "available", "reserved", "sold"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Features">
        <div className="grid grid-cols-2 gap-2">
          {FEATURE_OPTIONS.map((feature) => (
            <label key={feature} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.features.includes(feature)}
                onChange={() => toggleFeature(feature)}
              />
              {feature}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Photos">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="text-sm"
        />
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          First photo becomes the cover image. On mobile this opens your camera
          or photo library.
        </p>
      </Field>

      {error && <p className="text-brand-red text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="px-8 py-3 rounded-full bg-brand-red text-white font-semibold disabled:opacity-60"
      >
        {saving ? "Saving…" : isEditing ? "Save Changes" : "Add Car"}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.65rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-primary);
          color-scheme: light dark;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
