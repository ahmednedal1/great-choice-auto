// Central place for shop / owner contact details.
// Edit these values to update them everywhere (footer, WhatsApp, metadata, emails).

export const SHOP = {
  name: process.env.NEXT_PUBLIC_SHOP_NAME || "Great Choice Auto Sales",
  tagline: "Quality used cars, honestly priced.",

  // Phone — display version + digits-only (E.164, no + or spaces) for tel:/wa.me links
  phoneDisplay: "(226) 505-9118",
  phoneE164: "12265059118",

  // WhatsApp number (digits only, country code first). Falls back to the phone number.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "12265059118",

  email: "Greatchoiceautosales.inc@gmail.com",

  address: {
    line1: "3761 Hwy 6, Unit 4",
    line2: "Hamilton, ON L0R 1W0",
    // "Get directions" / "View larger map" link (the shop's shared Google Maps location)
    mapsUrl: "https://maps.app.goo.gl/hnxUhHG8EH5QtmCv8",
    // Embeddable map (no API key needed) shown inside an <iframe> in the footer
    mapEmbedUrl:
      "https://www.google.com/maps?q=3761+Hwy+6+Unit+4+Hamilton+ON+L0R+1W0&output=embed",
  },

  hours: "Mon–Sat: 9am–6pm",

  facebook: "https://www.facebook.com/share/1Bqb6BV7bT/",
};

// Convenience helpers
export const telHref = `tel:+${SHOP.phoneE164}`;
export const mailtoHref = `mailto:${SHOP.email}`;
export function whatsappHref(text) {
  const base = `https://wa.me/${SHOP.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
