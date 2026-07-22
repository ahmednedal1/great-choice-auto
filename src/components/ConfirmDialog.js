"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  loadingLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="gc-backdrop fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={() => !loading && onCancel()}
    >
      <div
        className="gc-modal w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 flex-shrink-0 rounded-full bg-brand-red/15 flex items-center justify-center">
            <AlertTriangle className="text-brand-red" size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-lg">{title}</h2>
            {message && (
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full border border-[var(--border)] font-semibold text-sm hover:bg-[var(--surface)] transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full bg-brand-red text-white font-semibold text-sm hover:bg-brand-red/90 transition-colors disabled:opacity-60"
          >
            {loading ? loadingLabel || confirmLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
