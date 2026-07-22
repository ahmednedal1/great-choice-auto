import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SHOP } from "@/lib/shop";

function clean(value, max = 2000) {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  return v.slice(0, max);
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 60);
  const message = clean(body.message, 4000);
  const carId = clean(body.carId, 100);
  const carLabel = clean(body.carLabel, 200) || "a vehicle";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error: dbError } = await supabase.from("inquiries").insert({
    car_id: carId,
    user_id: user?.id ?? null,
    name,
    phone,
    email,
    message,
    channel: "form",
  });

  if (dbError) {
    return NextResponse.json(
      { error: "Could not save your message." },
      { status: 500 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL || SHOP.email;
  const from = process.env.INQUIRY_FROM_EMAIL || "onboarding@resend.dev";

  if (apiKey) {
    try {
      const html = `
        <h2>New inquiry — ${escapeHtml(carLabel)}</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#888;font-size:12px">Sent from the ${escapeHtml(
          SHOP.name,
        )} website.</p>
      `;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${SHOP.name} <${from}>`,
          to: [to],
          reply_to: email,
          subject: `New inquiry: ${carLabel}`,
          html,
        }),
      });

      if (!res.ok) {
        console.error("Resend email failed:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Could not send inquiry email:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
