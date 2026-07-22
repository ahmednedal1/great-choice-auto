"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) return setError(error.message);
    setDone(true);
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="font-display font-bold text-2xl">Check your email</h1>
        <p className="text-[var(--text-secondary)] mt-3">
          We sent a confirmation link to {email}. Confirm your account to sign
          in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="gc-fade-up rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-lg p-8">
        <h1 className="font-display font-bold text-3xl text-center">
          Create Account
        </h1>
        <p className="text-center text-sm text-[var(--text-secondary)] mt-1">
          Join Great Choice Auto Sales
        </p>
        <div className="swoosh-divider w-16 mx-auto my-6" />

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--text-secondary)]">OR</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent focus:border-brand-blue outline-none"
          />
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
            minLength={6}
            placeholder="Password (min. 6 characters)"
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
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-red font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
