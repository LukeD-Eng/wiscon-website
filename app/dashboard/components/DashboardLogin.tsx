"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthMode = "login" | "register" | "magic";
type Status = "idle" | "sending" | "sent" | "error";

export default function DashboardLogin({ configError }: { configError?: string | null }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setStatus("idle");
    setMessage("");
  }

  async function submitLogin() {
    const res = await fetch("/api/dashboard/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, method: "password" }),
    });

    const body = (await res.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
      redirectTo?: string;
    };

    if (!res.ok) {
      setStatus("error");
      setMessage(body.error ?? "Could not sign in.");
      return;
    }

    setStatus("sent");
    setMessage(body.message ?? "Signed in.");
    router.push(body.redirectTo ?? "/dashboard");
    router.refresh();
  }

  async function submitMagicLink() {
    const res = await fetch("/api/dashboard/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, method: "magic_link" }),
    });

    const body = (await res.json().catch(() => ({}))) as { message?: string; error?: string };

    if (!res.ok) {
      setStatus("error");
      setMessage(body.error ?? "Could not send login link.");
      return;
    }

    setStatus("sent");
    setMessage(body.message ?? "Login link sent.");
  }

  async function submitRegister() {
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    const res = await fetch("/api/dashboard/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerName, companyName, ownerPhone, email, password }),
    });

    const body = (await res.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
      redirectTo?: string | null;
    };

    if (!res.ok) {
      setStatus("error");
      setMessage(body.error ?? "Could not create dashboard account.");
      return;
    }

    setStatus("sent");
    setMessage(body.message ?? "Registration created.");

    if (body.redirectTo) {
      router.push(body.redirectTo);
      router.refresh();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    if (mode === "login") await submitLogin();
    if (mode === "register") await submitRegister();
    if (mode === "magic") await submitMagicLink();
  }

  return (
    <main className="min-h-screen bg-white px-5 py-12 sm:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-green">
          WISCON Dashboard
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-brand-black">
          Company records
        </h1>
        <p className="mb-8 text-base leading-relaxed text-gray-600">
          Sign in or register the company owner account for WISCON records and exports.
        </p>

        <div className="mb-6 grid grid-cols-3 rounded-md border border-gray-200 bg-gray-50 p-1 text-sm font-semibold">
          {[
            { value: "login", label: "Sign in" },
            { value: "register", label: "Register" },
            { value: "magic", label: "Email link" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => switchMode(item.value as AuthMode)}
              className={`h-10 rounded px-2 transition ${
                mode === item.value ? "bg-white text-brand-black shadow-sm" : "text-gray-600 hover:text-brand-black"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Owner name</span>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(event) => setOwnerName(event.target.value)}
                  required
                  className="h-12 w-full rounded-md border border-gray-300 px-4 text-base outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
                  placeholder="Luke Smith"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Company name</span>
                <input
                  type="text"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  required
                  className="h-12 w-full rounded-md border border-gray-300 px-4 text-base outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
                  placeholder="Company (Pty) Ltd"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Owner phone</span>
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(event) => setOwnerPhone(event.target.value)}
                  required
                  className="h-12 w-full rounded-md border border-gray-300 px-4 text-base outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
                  placeholder="+27821234567"
                />
              </label>
            </>
          )}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-12 w-full rounded-md border border-gray-300 px-4 text-base outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
              placeholder="you@company.co.za"
            />
          </label>
          {mode !== "magic" && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                className="h-12 w-full rounded-md border border-gray-300 px-4 text-base outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
                placeholder="Minimum 8 characters"
              />
            </label>
          )}
          {mode === "register" && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                className="h-12 w-full rounded-md border border-gray-300 px-4 text-base outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
                placeholder="Repeat password"
              />
            </label>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-brand-green px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending"
              ? "Working..."
              : mode === "register"
                ? "Create owner account"
                : mode === "magic"
                  ? "Send login link"
                  : "Sign in"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 rounded-md border px-4 py-3 text-sm ${
              status === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message}
          </p>
        )}

        {configError && (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {configError}
          </p>
        )}
      </div>
    </main>
  );
}
