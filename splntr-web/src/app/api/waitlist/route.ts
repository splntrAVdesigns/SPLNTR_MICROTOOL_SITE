import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Waitlist signup endpoint.
 *
 * With Supabase configured (.env.local / Vercel env vars set), signups are
 * inserted into the `waitlist` table (see supabase/schema.sql).
 * Without config, it falls back to server-side logging so local dev never
 * breaks. Duplicate signups (same email + product) return success — the
 * person is on the list either way.
 */
export async function POST(req: Request) {
  let body: { email?: string; role?: string; product?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const role = (body.role ?? "").slice(0, 64);
  const product = (body.product ?? "general").slice(0, 64);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    // Supabase not configured yet — log so signups are still visible in dev
    // and in Vercel function logs.
    console.log("[waitlist:fallback]", { email, role, product, at: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase.from("waitlist").insert({ email, role, product });

  if (error) {
    // 23505 = unique_violation: already signed up for this product. Treat as success.
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error("[waitlist:error]", error.code, error.message);
    return NextResponse.json(
      { error: "Could not save your signup right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
