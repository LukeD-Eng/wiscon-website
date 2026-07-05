"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Footer from "../components/Footer";
import {
  AuditModule,
  auditModuleIds,
  auditModuleMeta,
  isAuditModule,
  templates,
} from "@/lib/audit";

type Filter = "all" | AuditModule;

export default function TemplatesPage() {
  const searchParams = useSearchParams();
  const queryHighlight = searchParams.get("highlight");
  const highlight =
    queryHighlight && isAuditModule(queryHighlight) ? queryHighlight : null;
  const [manualFilter, setManualFilter] = useState<Filter | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const activeFilter = manualFilter ?? highlight ?? "all";

  const visibleTemplates = useMemo(() => {
    if (activeFilter === "all") return templates;
    return templates.filter((template) => template.module === activeFilter);
  }, [activeFilter]);

  const pilotableHighlight = highlight
    ? auditModuleMeta[highlight].pilotable
    : true;

  async function copyTemplate(id: number, body: string) {
    let copied = false;

    if (navigator.clipboard?.writeText) {
      try {
        await Promise.race([
          navigator.clipboard.writeText(body),
          new Promise((_, reject) =>
            window.setTimeout(() => reject(new Error("Clipboard timeout")), 750)
          ),
        ]);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      const el = document.createElement("textarea");
      el.value = body;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }

    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  }

  return (
    <div className="min-h-screen bg-white text-brand-black">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-xl font-semibold">
            WIS<span className="text-brand-green">C</span>ON
          </Link>
          <Link
            href="/audit"
            className="text-sm font-semibold text-brand-green transition-opacity hover:opacity-70"
          >
            Take the audit
          </Link>
        </div>
      </header>

      <main>
        <section className="px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="mb-5 text-sm font-semibold uppercase text-brand-green">
                Your audit reward
              </p>
              <h1 className="mb-5 text-4xl font-bold leading-tight sm:text-5xl">
                Your 9 WhatsApp templates.
              </h1>
              <p className="text-lg leading-relaxed text-gray-600">
                The ones flagged for your score are your priority. Copy, paste,
                send. They are the manual version of what WISCON handles
                automatically on every job.
              </p>
              {highlight && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm leading-relaxed text-brand-green">
                  Your audit pointed to {auditModuleMeta[highlight].label}. That
                  template group is open first, but the full set is always
                  available under All 9.
                </div>
              )}
            </div>

            <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setManualFilter("all")}
                className={[
                  "h-10 shrink-0 rounded-lg border px-4 text-sm font-semibold transition-colors",
                  activeFilter === "all"
                    ? "border-brand-green bg-brand-green text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                All 9
              </button>
              {auditModuleIds.map((module) => (
                <button
                  key={module}
                  type="button"
                  onClick={() => setManualFilter(module)}
                  className={[
                    "h-10 shrink-0 rounded-lg border px-4 text-sm font-semibold transition-colors",
                    activeFilter === module
                      ? "border-brand-green bg-brand-green text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {auditModuleMeta[module].label}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {visibleTemplates.map((template) => {
                const isHighlighted = highlight === template.module;
                return (
                  <article
                    key={template.id}
                    className={[
                      "rounded-lg border bg-white p-5 shadow-sm sm:p-6",
                      isHighlighted
                        ? "border-green-300 ring-2 ring-green-100"
                        : "border-gray-200",
                    ].join(" ")}
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-brand-green">
                          Template {template.id} — {template.moduleLabel}
                        </p>
                        <h2 className="text-xl font-bold">{template.title}</h2>
                      </div>
                      {isHighlighted && (
                        <span className="rounded-lg bg-green-50 px-3 py-1 text-xs font-semibold text-brand-green">
                          Priority
                        </span>
                      )}
                    </div>

                    <p className="mb-5 text-sm leading-relaxed text-gray-600">
                      {template.description}
                    </p>

                    <pre className="min-h-[172px] whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 font-sans text-sm leading-relaxed text-gray-800">
                      {template.body}
                    </pre>

                    <button
                      type="button"
                      onClick={() => copyTemplate(template.id, template.body)}
                      className="mt-5 h-11 rounded-lg bg-brand-green px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      {copiedId === template.id
                        ? "Copied"
                        : "Copy template"}
                    </button>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8">
              <h2 className="mb-3 text-2xl font-bold">
                Want the automated version?
              </h2>
              {pilotableHighlight ? (
                <>
                  <p className="max-w-2xl text-base leading-relaxed text-gray-600">
                    WISCON can run QuoteFlow, VariProof, SnagTrack, and LeadGate
                    as structured WhatsApp workflows. Site Diary and SafeGuard
                    interest is being logged for the build queue.
                  </p>
                  <a
                    href="https://wa.me/27689359269?text=Hi%20Luke%2C%20I%20want%20to%20see%20a%20WISCON%20workflow%20run%20live"
                    className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-brand-green px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Message Luke
                  </a>
                </>
              ) : (
                <p className="max-w-2xl text-base leading-relaxed text-gray-600">
                  Your interest has been logged through the audit. This workflow
                  is not being offered as a live pilot yet, so start with the
                  manual template for now.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
