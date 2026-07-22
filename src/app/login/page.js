"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="gc-fade-up rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-lg p-8">
        <h1 className="font-display font-bold text-3xl text-center">
          Welcome back
        </h1>
        <p className="text-center text-sm text-[var(--text-secondary)] mt-1">
          Sign in to your Great Choice account
        </p>
        <div className="swoosh-divider w-16 mx-auto my-6" />

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--text-secondary)]">OR</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent focus:border-brand-blue outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent focus:border-brand-blue outline-none"
          />
          {error && <p className="text-brand-red text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-brand-red text-white font-semibold hover:bg-brand-red/90 transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-red font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
