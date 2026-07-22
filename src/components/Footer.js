import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ArrowUpRight,
  Facebook,
} from "lucide-react";
import { SHOP, telHref, mailtoHref, whatsappHref } from "@/lib/shop";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-brand-black text-white/70 mt-20 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 lg:grid-cols-2">
        {/* Left: brand + contact details */}
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <Image
              src="/logo.png"
              alt={`${SHOP.name} logo`}
              width={160}
              height={160}
              className="w-40 h-auto mb-3"
            />
            <p className="text-sm">{SHOP.tagline}</p>

            <div className="flex items-center gap-3 mt-4">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#25D366] transition-colors"
              >
                <Phone size={16} />
              </a>
              <a
                href={SHOP.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#1877F2] transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href={mailtoHref}
                aria-label="Email"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-red transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          <div className="text-sm space-y-3">
            <p className="text-white font-semibold">Get In Touch</p>
            <a
              href={telHref}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone size={15} className="text-brand-red flex-shrink-0" />
              {SHOP.phoneDisplay}
            </a>
            <a
              href={mailtoHref}
              className="flex items-center gap-2 hover:text-white transition-colors break-all"
            >
              <Mail size={15} className="text-brand-red flex-shrink-0" />
              {SHOP.email}
            </a>
            <a
              href={SHOP.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 hover:text-white transition-colors"
            >
              <MapPin
                size={15}
                className="text-brand-red flex-shrink-0 mt-0.5"
              />
              <span>
                {SHOP.address.line1}
                <br />
                {SHOP.address.line2}
              </span>
            </a>
            <p className="flex items-center gap-2">
              <Clock size={15} className="text-brand-red flex-shrink-0" />
              {SHOP.hours}
            </p>
          </div>
        </div>

        {/* Right: embedded Google Map */}
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-white/5">
          <iframe
            src={SHOP.address.mapEmbedUrl}
            title={`${SHOP.name} location on Google Maps`}
            className="w-full h-64 md:h-72 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            href={SHOP.address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/10 transition-colors group"
          >
            <span className="flex items-start gap-2 text-sm">
              <MapPin
                size={16}
                className="text-brand-red flex-shrink-0 mt-0.5"
              />
              <span>
                {SHOP.address.line1}, {SHOP.address.line2}
              </span>
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-white whitespace-nowrap">
              Get directions
              <ArrowUpRight
                size={15}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </span>
          </a>
        </div>
      </div>

      <div className="swoosh-divider mx-4" />
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <p>
          © {new Date().getFullYear()} {SHOP.name}. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
