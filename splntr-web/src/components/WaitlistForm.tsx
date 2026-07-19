"use client";

import { useState } from "react";

type FormState = "idle" | "sending" | "done" | "error";

export default function WaitlistForm({ product }: { product?: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit() {
    if (!email.includes("@")) {
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, product: product ?? "general" }),
      });
      if (!res.ok) throw new Error("Request failed");
      setState("done");
      setMessage("You're on the list. Beta invites go out in waves — watch your inbox.");
    } catch {
      setState("error");
      setMessage("Something went wrong sending your signup. Try again in a moment.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-lg border border-volt/40 bg-volt/10 p-6 text-center">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-volt">Signed up</p>
        <p className="mt-2 text-sm text-volt-ice">{message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-panel/60 p-6">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="sr-only" htmlFor={`wl-email-${product ?? "general"}`}>Email address</label>
        <input
          id={`wl-email-${product ?? "general"}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
          className="rounded border border-line bg-void px-4 py-3 text-sm text-white placeholder:text-haze/60 focus:border-volt focus:outline-none"
        />
        <label className="sr-only" htmlFor={`wl-role-${product ?? "general"}`}>What best describes you</label>
        <select
          id={`wl-role-${product ?? "general"}`}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded border border-line bg-void px-4 py-3 text-sm text-haze focus:border-volt focus:outline-none"
        >
          <option value="">I&apos;m a…</option>
          <option value="producer">Producer / musician</option>
          <option value="designer">Designer / motion artist</option>
          <option value="dj-performer">DJ / live performer</option>
          <option value="creator">Content creator / streamer</option>
          <option value="other">Other</option>
        </select>
        <button
          type="button"
          onClick={submit}
          disabled={state === "sending"}
          className="rounded border border-volt/60 bg-volt/15 px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-volt transition hover:bg-volt/25 hover:shadow-volt disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : "Join waitlist"}
        </button>
      </div>
      {state === "error" && <p className="mt-3 text-sm text-red-400">{message}</p>}
      <p className="mt-3 text-xs text-haze/70">
        Beta invites, release news, and dev updates only. Unsubscribe anytime.
      </p>
    </div>
  );
}
