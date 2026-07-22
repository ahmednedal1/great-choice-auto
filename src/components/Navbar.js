"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "./ThemeToggle";
import ConfirmDialog from "./ConfirmDialog";
import { Car, Heart, Phone } from "lucide-react";

const links = [
  { href: "/cars", label: "Inventory", icon: Car },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/#contact", label: "Contact", icon: Phone },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.is_admin ?? false);
      } else {
        setIsAdmin(false);
      }
    }
    loadUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => loadUser());
    return () => subscription.unsubscribe();
  }, []);

  function requestSignOut() {
    setOpen(false);
    setConfirmOpen(true);
  }

  async function confirmSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    setConfirmOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <header className="bg-brand-black sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Great Choice Auto Sales — home"
          >
            <Image
              src="/logo.png"
              alt="Great Choice Auto Sales"
              width={340}
              height={220}
              priority
              className="h-28 w-auto sm:h-[128px]"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                <l.icon size={15} />
                {l.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className="text-sm font-semibold px-4 py-2 rounded-full border border-brand-red text-brand-red hover:bg-brand-red hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={requestSignOut}
                  className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-red text-white hover:bg-brand-red/90 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-red text-white hover:bg-brand-red/90 transition-colors"
              >
                Sign In
              </Link>
            )}
            <ThemeToggle />
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              aria-label="Open menu"
              onClick={() => setOpen(!open)}
              className="w-11 h-11 flex items-center justify-center text-white"
            >
              <div className="space-y-1.5">
                <span className="block w-6 h-0.5 bg-white" />
                <span className="block w-6 h-0.5 bg-white" />
                <span className="block w-6 h-0.5 bg-white" />
              </div>
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden bg-brand-black border-t border-white/10 px-4 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-white/90 text-base py-2"
              >
                <l.icon size={17} />
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-center text-sm font-semibold px-4 py-3 rounded-full border border-brand-red text-brand-red"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={requestSignOut}
                  className="text-center text-sm font-semibold px-4 py-3 rounded-full bg-brand-red text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-center text-sm font-semibold px-4 py-3 rounded-full bg-brand-red text-white"
              >
                Sign In
              </Link>
            )}
          </nav>
        )}
      </header>

      <ConfirmDialog
        open={confirmOpen}
        title="Sign out?"
        message="You'll need to sign in again to access your favorites and dashboard."
        confirmLabel="Sign Out"
        loadingLabel="Signing out…"
        cancelLabel="Cancel"
        loading={signingOut}
        onConfirm={confirmSignOut}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}