"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DeleteCarButton({ carId, carName, images = [] }) {
    const supabase = createClient();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {
        setBusy(true);
        setError("");

        // 1. Best-effort: remove the photo files from the "car-images" bucket
        try {
            const marker = "/car-images/";
            const paths = (images || [])
                .map((img) => {
                    const url = img?.image_url || "";
                    const i = url.indexOf(marker);
                    return i === -1 ? null : url.slice(i + marker.length);
                })
                .filter(Boolean);
            if (paths.length) {
                await supabase.storage.from("car-images").remove(paths);
            }
        } catch {
            // storage cleanup is optional — keep going even if it fails
        }

        // 2. Remove image rows (safe even if you already have ON DELETE CASCADE)
        await supabase.from("car_images").delete().eq("car_id", carId);

        // 3. Delete the car itself
        const { error: delErr } = await supabase
            .from("cars")
            .delete()
            .eq("id", carId);

        if (delErr) {
            setError(delErr.message);
            setBusy(false);
            return;
        }

        setOpen(false);
        setBusy(false);
        router.refresh(); // list updates, deleted car disappears
    }

    return (
        <>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(true);
                }}
                aria-label="Delete car"
                className="flex-shrink-0 text-[var(--text-secondary)] hover:text-brand-red transition-colors"
            >
                <Trash2 size={18} />
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!busy) setOpen(false);
                    }}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="font-display font-bold text-lg">Delete this car?</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-2">
                            {carName ? `"${carName}"` : "This listing"} and its photos will be
                            permanently removed. This can’t be undone.
                        </p>
                        {error && <p className="text-sm text-brand-red mt-3">{error}</p>}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={busy}
                                className="px-4 py-2 rounded-full border border-[var(--border)] font-semibold text-sm disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={busy}
                                className="px-4 py-2 rounded-full bg-brand-red text-white font-semibold text-sm hover:bg-brand-red/90 disabled:opacity-50"
                            >
                                {busy ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}