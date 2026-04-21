"use client";

import { useState, FormEvent } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function VariProofPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  function validate() {
    const errs: { name?: string; email?: string } = {};
    if (!name.trim()) errs.name = "Please enter your name.";
    if (!email.trim()) {
      errs.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address.";
    }
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
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (res.ok) {
        setFormState("success");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--color-white)",
        color: "var(--color-black)",
      }}
    >
      {/* Minimal header */}
      <header
        className="px-5 sm:px-8 h-16 flex items-center shrink-0"
        style={{ borderBottom: "1px solid #F3F4F6" }}
      >
        <a
          href="https://wiscon.co.za"
          className="font-semibold text-xl tracking-tight"
          style={{ color: "var(--color-black)" }}
        >
          WIS<span style={{ color: "var(--color-green)" }}>C</span>ON
        </a>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section
          className="px-5 sm:px-8 py-20 sm:py-28"
          style={{ backgroundColor: "var(--color-white)" }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-5"
                style={{ color: "var(--color-green)" }}
              >
                Free for SA Contractors
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
                style={{ color: "var(--color-black)" }}
              >
                Stop losing money on work you already did.
              </h1>
              <p
                className="text-lg sm:text-xl leading-relaxed mb-10"
                style={{ color: "#4B5563" }}
              >
                You did the extra work because it was discussed — now
                they&apos;re saying they never agreed to it. This free template
                pack makes sure that never costs you again.
              </p>
              <a
                href="#get-templates"
                className="inline-flex items-center justify-center px-8 rounded-full text-base font-semibold text-white transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-green)",
                  height: "52px",
                }}
              >
                Send me the free templates
              </a>
            </div>
          </div>
        </section>

        {/* Who this is for */}
        <section
          className="px-5 sm:px-8 py-16 sm:py-20"
          style={{ backgroundColor: "var(--color-off-white)" }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-5"
                style={{ color: "var(--color-green)" }}
              >
                Who this is for
              </p>
              <p
                className="text-lg sm:text-xl leading-relaxed"
                style={{ color: "#4B5563" }}
              >
                You&apos;re a contractor who does things right. You show up, you
                deliver, and you treat clients the way you&apos;d want to be
                treated. But if you&apos;ve ever finished extra work and then
                had a client change their story — this is for you.
              </p>
            </div>
          </div>
        </section>

        {/* What's inside */}
        <section
          className="px-5 sm:px-8 py-16 sm:py-20"
          style={{ backgroundColor: "var(--color-white)" }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-5"
                style={{ color: "var(--color-green)" }}
              >
                What&apos;s inside
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-8"
                style={{ color: "var(--color-black)" }}
              >
                5 copy-paste WhatsApp templates that take less than a minute to
                send.
              </h2>
              <div className="space-y-6">
                {[
                  "A written record of every change order, confirmed by the client on WhatsApp — so that when the invoice comes, there is nothing to argue about.",
                  "A PDF with the client's approval, timestamped and saved — so that you walk into every dispute with proof, not just your word against theirs.",
                  "The whole process takes less than a minute — so that paperwork never slows you down on a job where time is money.",
                ].map((bullet, i) => (
                  <div key={i} className="flex gap-4">
                    <div
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: "var(--color-green)" }}
                    >
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p
                      className="text-base sm:text-lg leading-relaxed"
                      style={{ color: "#4B5563" }}
                    >
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Email capture form / Success state */}
        {formState !== "success" ? (
          <section
            id="get-templates"
            className="px-5 sm:px-8 py-16 sm:py-20"
            style={{ backgroundColor: "var(--color-off-white)" }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="max-w-xl">
                <p
                  className="text-sm font-semibold uppercase tracking-widest mb-5"
                  style={{ color: "var(--color-green)" }}
                >
                  Get the templates
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
                  style={{ color: "var(--color-black)" }}
                >
                  Enter your details and we&apos;ll send them over.
                </h2>
                <p
                  className="text-base leading-relaxed mb-8"
                  style={{ color: "#4B5563" }}
                >
                  Built for South African contractors. No sign-up fees. No
                  catch. Just the templates.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="vp-name"
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: "var(--color-black)" }}
                    >
                      Full name{" "}
                      <span style={{ color: "var(--color-green)" }}>*</span>
                    </label>
                    <input
                      id="vp-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name)
                          setErrors((x) => ({ ...x, name: undefined }));
                      }}
                      placeholder="John Smith"
                      className="w-full h-12 px-4 rounded-xl border text-sm outline-none transition-colors focus:border-current"
                      style={{
                        borderColor: errors.name ? "#EF4444" : "#D1D5DB",
                        color: "var(--color-black)",
                        backgroundColor: "var(--color-white)",
                      }}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="vp-email"
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: "var(--color-black)" }}
                    >
                      Email address{" "}
                      <span style={{ color: "var(--color-green)" }}>*</span>
                    </label>
                    <input
                      id="vp-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors((x) => ({ ...x, email: undefined }));
                      }}
                      placeholder="john@company.co.za"
                      className="w-full h-12 px-4 rounded-xl border text-sm outline-none transition-colors focus:border-current"
                      style={{
                        borderColor: errors.email ? "#EF4444" : "#D1D5DB",
                        color: "var(--color-black)",
                        backgroundColor: "var(--color-white)",
                      }}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className="w-full rounded-full text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{
                      backgroundColor: "var(--color-green)",
                      height: "52px",
                    }}
                  >
                    {formState === "loading"
                      ? "Sending…"
                      : "Send me the free templates"}
                  </button>

                  {formState === "error" && (
                    <p className="text-sm text-red-500 text-center">
                      Something went wrong. Please try again or email us at{" "}
                      <a
                        href="mailto:hello@wiscon.co.za"
                        style={{ color: "var(--color-green)" }}
                      >
                        hello@wiscon.co.za
                      </a>
                      .
                    </p>
                  )}
                </form>
              </div>
            </div>
          </section>
        ) : (
          /* Success state */
          <section
            id="get-templates"
            className="px-5 sm:px-8 py-20 sm:py-24"
            style={{ backgroundColor: "var(--color-off-white)" }}
          >
            <div className="max-w-lg mx-auto text-center">
              <div className="text-5xl mb-6">✅</div>
              <h2
                className="text-2xl font-bold mb-3"
                style={{ color: "var(--color-black)" }}
              >
                Check your inbox.
              </h2>
              <p className="leading-relaxed" style={{ color: "#4B5563" }}>
                The templates are on their way. Before your next extra job
                starts, send Template 1. It takes 30 seconds — and means you
                and the client are on the same page in writing before you lift a
                finger.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Minimal footer */}
      <footer
        className="px-5 sm:px-8 py-8 shrink-0"
        style={{ borderTop: "1px solid #F3F4F6" }}
      >
        <div
          className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{ color: "#9CA3AF" }}
        >
          <span>© 2026 WISCON. WhatsApp Integrated Services in Construction.</span>
          <a
            href="https://wiscon.co.za"
            className="transition-opacity hover:opacity-60"
            style={{ color: "var(--color-green)" }}
          >
            Back to wiscon.co.za
          </a>
        </div>
      </footer>
    </div>
  );
}
