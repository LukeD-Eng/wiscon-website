"use client";

import { useState, FormEvent } from "react";

type FormState = "idle" | "loading" | "success" | "duplicate" | "error";

const services = ["LeadGate", "VariProof", "SnagTrack", "SiteInstruct"] as const;
type Service = (typeof services)[number];

export default function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [selected, setSelected] = useState<Service[]>([]);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleService(s: Service) {
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
    if (errors.services) setErrors((e) => ({ ...e, services: "" }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Please enter your name.";
    if (!email.trim()) {
      errs.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (selected.length === 0)
      errs.services = "Please select at least one service you're interested in.";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setFormState("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), company: company.trim(), services: selected }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setFormState("duplicate");
      } else if (res.ok) {
        setFormState("success");
      } else {
        console.error("Waitlist error:", data);
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <section id="waitlist" className="px-5 sm:px-8 py-20 sm:py-24" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-black)" }}>
            You&apos;re on the list.
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Thanks for signing up. We&apos;ll be in touch when WISCON is ready to launch. Keep an eye on your inbox.
          </p>
        </div>
      </section>
    );
  }

  if (formState === "duplicate") {
    return (
      <section id="waitlist" className="px-5 sm:px-8 py-20 sm:py-24" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="max-w-lg mx-auto text-center">
          <div className="text-5xl mb-6">👋</div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-black)" }}>
            You&apos;re already on the list.
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We already have your details. We&apos;ll reach out when things are ready — no need to sign up again.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="px-5 sm:px-8 py-20 sm:py-24" style={{ backgroundColor: "var(--color-white)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "var(--color-black)" }}
          >
            Get early access.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            WISCON is launching soon. Join the waitlist and be first to know — we&apos;ll reach out before we go public.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-black)" }}>
              Full name <span style={{ color: "var(--color-green)" }}>*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(x => ({ ...x, name: "" })); }}
              placeholder="John Smith"
              className="w-full h-12 px-4 rounded-xl border text-sm outline-none transition-colors focus:border-current"
              style={{
                borderColor: errors.name ? "#EF4444" : "#D1D5DB",
                color: "var(--color-black)",
              }}
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-black)" }}>
              Email address <span style={{ color: "var(--color-green)" }}>*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(x => ({ ...x, email: "" })); }}
              placeholder="john@company.co.za"
              className="w-full h-12 px-4 rounded-xl border text-sm outline-none transition-colors focus:border-current"
              style={{
                borderColor: errors.email ? "#EF4444" : "#D1D5DB",
                color: "var(--color-black)",
              }}
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-black)" }}>
              Company name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="ABC Construction"
              className="w-full h-12 px-4 rounded-xl border text-sm outline-none transition-colors"
              style={{ borderColor: "#D1D5DB", color: "var(--color-black)" }}
            />
          </div>

          {/* Services */}
          <div>
            <p className="block text-sm font-medium mb-3" style={{ color: "var(--color-black)" }}>
              Which services interest you? <span style={{ color: "var(--color-green)" }}>*</span>
            </p>
            <div className="space-y-3">
              {services.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors"
                    style={{
                      backgroundColor: selected.includes(s) ? "var(--color-green)" : "transparent",
                      borderColor: selected.includes(s) ? "var(--color-green)" : "#D1D5DB",
                    }}
                  >
                    {selected.includes(s) && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selected.includes(s)}
                    onChange={() => toggleService(s)}
                  />
                  <span className="text-sm" style={{ color: "var(--color-black)" }}>{s}</span>
                </label>
              ))}
            </div>
            {errors.services && <p className="mt-2 text-sm text-red-500">{errors.services}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={formState === "loading"}
            className="w-full h-13 rounded-full text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "var(--color-green)", height: "52px" }}
          >
            {formState === "loading" ? "Submitting…" : "Join the Waitlist"}
          </button>

          {formState === "error" && (
            <p className="text-sm text-red-500 text-center">
              Something went wrong. Please try again or email us directly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
