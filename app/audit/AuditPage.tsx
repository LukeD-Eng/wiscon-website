"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import Footer from "../components/Footer";
import {
  AnswerValue,
  AuditAnswers,
  AuditResult,
  auditModuleMeta,
  auditQuestions,
  contractorTypeOptions,
  getTemplateById,
  getTemplateHref,
  roleOptions,
} from "@/lib/audit";

type Phase = "landing" | "questions" | "lead" | "result";

type LeadForm = {
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  role: string;
  contractorType: string;
};

const emptyLeadForm: LeadForm = {
  name: "",
  email: "",
  whatsapp: "",
  company: "",
  role: "",
  contractorType: "",
};

function inputClass(hasError?: boolean) {
  return [
    "h-12 w-full rounded-lg border bg-white px-4 text-sm outline-none transition-colors",
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-brand-green",
  ].join(" ");
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function AuditPage() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<AuditAnswers>>({});
  const [lead, setLead] = useState<LeadForm>(emptyLeadForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "error">(
    "idle"
  );
  const [result, setResult] = useState<AuditResult | null>(null);

  const currentQuestion = auditQuestions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / auditQuestions.length) * 100);
  const allQuestionsAnswered = useMemo(
    () => auditQuestions.every((question) => answers[question.id]),
    [answers]
  );

  function setAnswer(value: AnswerValue) {
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: value }));
  }

  function startAudit() {
    setPhase("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextQuestion() {
    if (!answers[currentQuestion.id]) return;
    if (currentIndex === auditQuestions.length - 1) {
      setPhase("lead");
      return;
    }
    setCurrentIndex((index) => index + 1);
  }

  function previousQuestion() {
    if (currentIndex === 0) return;
    setCurrentIndex((index) => index - 1);
  }

  function updateLead(field: keyof LeadForm, value: string) {
    setLead((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: "" }));
  }

  function validateLead() {
    const nextErrors: Record<string, string> = {};

    if (!lead.name.trim()) nextErrors.name = "Enter your full name.";
    if (!lead.company.trim()) nextErrors.company = "Enter your company name.";
    if (!lead.whatsapp.trim())
      nextErrors.whatsapp = "Enter your WhatsApp number.";
    if (!lead.email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!validEmail(lead.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!lead.role) nextErrors.role = "Select your role.";
    if (!lead.contractorType)
      nextErrors.contractorType = "Select your contractor type.";

    return nextErrors;
  }

  async function submitAudit(event: FormEvent) {
    event.preventDefault();

    if (!allQuestionsAnswered) {
      setPhase("questions");
      return;
    }

    const nextErrors = validateLead();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitState("loading");
    setErrors({});

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          name: lead.name.trim(),
          email: lead.email.trim().toLowerCase(),
          whatsapp: lead.whatsapp.trim(),
          company: lead.company.trim(),
          answers,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setSubmitState("error");
        setErrors({ form: data.error ?? "Something went wrong." });
        return;
      }

      setResult(data.result as AuditResult);
      setSubmitState("idle");
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitState("error");
      setErrors({ form: "Something went wrong. Please try again." });
    }
  }

  return (
    <div className="min-h-screen bg-white text-brand-black">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-xl font-semibold">
            WIS<span className="text-brand-green">C</span>ON
          </Link>
          <Link
            href={phase === "landing" ? "#take-the-audit" : "/templates"}
            onClick={(event) => {
              if (phase === "landing") {
                event.preventDefault();
                startAudit();
              }
            }}
            className="text-sm font-semibold text-brand-green transition-opacity hover:opacity-70"
          >
            {phase === "landing" ? "Take the audit" : "Templates"}
          </Link>
        </div>
      </header>

      <main>
        {phase === "landing" && <LandingView onStart={startAudit} />}

        {phase === "questions" && (
          <section id="take-the-audit" className="px-5 py-14 sm:px-8 sm:py-20">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="mb-5 text-sm font-semibold uppercase text-brand-green">
                  Free WhatsApp Workflow Audit
                </p>
                <h1 className="mb-5 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
                  Show me where I&apos;m leaking money
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-gray-600">
                  Six questions about how you actually run your jobs. Get your
                  Exposure Score, your biggest gap, and the templates that fix
                  it today.
                </p>
                <div className="mt-8 grid gap-3 text-sm text-gray-600 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    Six questions
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    Two minutes
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    Free template pack
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-8">
                  <div className="mb-3 flex items-center justify-between gap-4 text-sm text-gray-500">
                    <span>
                      Question {currentIndex + 1} of {auditQuestions.length}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-brand-green transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <p className="mb-3 text-sm font-semibold uppercase text-brand-green">
                  {currentQuestion.label}
                </p>
                <h2 className="mb-7 text-2xl font-bold leading-snug">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const selected = answers[currentQuestion.id] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAnswer(option.value)}
                        className={[
                          "flex min-h-[76px] w-full items-start gap-4 rounded-lg border p-4 text-left transition-colors",
                          selected
                            ? "border-brand-green bg-green-50"
                            : "border-gray-200 bg-white hover:border-gray-300",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                            selected
                              ? "border-brand-green bg-brand-green text-white"
                              : "border-gray-300 text-gray-500",
                          ].join(" ")}
                        >
                          {option.value}
                        </span>
                        <span className="text-sm leading-relaxed text-gray-700">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={previousQuestion}
                    disabled={currentIndex === 0}
                    className="h-11 rounded-lg border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition-opacity disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextQuestion}
                    disabled={!answers[currentQuestion.id]}
                    className="h-11 rounded-lg bg-brand-green px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {currentIndex === auditQuestions.length - 1
                      ? "See my result"
                      : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {phase === "lead" && (
          <section className="px-5 py-14 sm:px-8 sm:py-20">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="mb-5 text-sm font-semibold uppercase text-brand-green">
                  Your result
                </p>
                <h1 className="mb-5 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
                  Your Exposure Score is ready.
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-gray-600">
                  Enter your details and we&apos;ll reveal your Exposure Score and
                  send your templates straight to you.
                </p>
                <button
                  type="button"
                  onClick={() => setPhase("questions")}
                  className="mt-8 text-sm font-semibold text-brand-green"
                >
                  Review my answers
                </button>
              </div>

              <form
                onSubmit={submitAudit}
                noValidate
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      Full name
                    </span>
                    <input
                      className={inputClass(Boolean(errors.name))}
                      value={lead.name}
                      onChange={(event) => updateLead("name", event.target.value)}
                      autoComplete="name"
                      placeholder="Luke Davids"
                    />
                    {errors.name && (
                      <span className="mt-1.5 block text-sm text-red-600">
                        {errors.name}
                      </span>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      Company name
                    </span>
                    <input
                      className={inputClass(Boolean(errors.company))}
                      value={lead.company}
                      onChange={(event) =>
                        updateLead("company", event.target.value)
                      }
                      autoComplete="organization"
                      placeholder="Davids Construction"
                    />
                    {errors.company && (
                      <span className="mt-1.5 block text-sm text-red-600">
                        {errors.company}
                      </span>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      Email address
                    </span>
                    <input
                      className={inputClass(Boolean(errors.email))}
                      value={lead.email}
                      onChange={(event) =>
                        updateLead("email", event.target.value)
                      }
                      autoComplete="email"
                      inputMode="email"
                      placeholder="luke@company.co.za"
                    />
                    {errors.email && (
                      <span className="mt-1.5 block text-sm text-red-600">
                        {errors.email}
                      </span>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      WhatsApp number
                    </span>
                    <input
                      className={inputClass(Boolean(errors.whatsapp))}
                      value={lead.whatsapp}
                      onChange={(event) =>
                        updateLead("whatsapp", event.target.value)
                      }
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+27 68 935 9269"
                    />
                    {errors.whatsapp && (
                      <span className="mt-1.5 block text-sm text-red-600">
                        {errors.whatsapp}
                      </span>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      Your role
                    </span>
                    <select
                      className={inputClass(Boolean(errors.role))}
                      value={lead.role}
                      onChange={(event) => updateLead("role", event.target.value)}
                    >
                      <option value="">Select your role</option>
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <span className="mt-1.5 block text-sm text-red-600">
                        {errors.role}
                      </span>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      Contractor type
                    </span>
                    <select
                      className={inputClass(Boolean(errors.contractorType))}
                      value={lead.contractorType}
                      onChange={(event) =>
                        updateLead("contractorType", event.target.value)
                      }
                    >
                      <option value="">Select type</option>
                      {contractorTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.contractorType && (
                      <span className="mt-1.5 block text-sm text-red-600">
                        {errors.contractorType}
                      </span>
                    )}
                  </label>
                </div>

                {errors.form && (
                  <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {errors.form}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="mt-7 h-12 w-full rounded-lg bg-brand-green px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {submitState === "loading"
                    ? "Saving your result..."
                    : "Reveal my Exposure Score"}
                </button>
                <p className="mt-4 text-center text-sm text-gray-500">
                  No spam. No pitch. Just your score and the templates that fix
                  it.
                </p>
              </form>
            </div>
          </section>
        )}

        {phase === "result" && result && <ResultView result={result} />}
      </main>

      <Footer />
    </div>
  );
}

function LandingView({ onStart }: { onStart: () => void }) {
  const workflows = [
    ["QuoteFlow", "Quote acceptance before you mobilise"],
    ["VariProof", "Variation sign-off before work starts"],
    ["SnagTrack", "Defect instructions with a paper trail"],
    ["LeadGate", "Qualify before you drive out to quote"],
    ["Site Diary", "Daily written record on every project"],
    ["SafeGuard", "Toolbox talks and incident records"],
  ];

  return (
    <>
      <section className="bg-[#0D1F2D] px-5 py-16 text-center text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mx-auto mb-7 inline-flex rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
            Free WhatsApp Workflow Audit
          </p>

          <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Where is your site admin <span className="text-green-300">leaking money?</span>
          </h1>

          <p className="mx-auto mb-9 max-w-2xl text-lg leading-relaxed text-white/75">
            Answer 6 questions about how you run your jobs on WhatsApp. Get
            your Exposure Score, find out exactly where the gaps are, and get 9
            copy-paste templates that fix them. Two minutes. Free.
          </p>

          <div className="mb-9 flex flex-wrap justify-center gap-2.5">
            {[
              "2 minutes",
              "Your Exposure Score",
              "9 copy-paste templates",
              "Built for SA contractors",
            ].map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85"
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="mx-auto flex max-w-md flex-col gap-3">
            <button
              type="button"
              onClick={onStart}
              className="h-14 rounded-full bg-brand-green px-8 text-base font-extrabold text-white transition hover:bg-[#145230]"
            >
              Show me where I&apos;m leaking money
              {" "}
              <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={onStart}
              className="h-12 rounded-full border border-white/25 px-8 text-sm font-semibold text-white/75 transition hover:border-white/50 hover:text-white"
            >
              Take the free audit
            </button>
          </div>

          <p className="mt-5 text-xs tracking-wide text-white/45">
            Built for South African contractors. Free. No catch.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-green">
            The problem
          </p>
          <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight">
            Most SA contractors don&apos;t lose money because of bad work.
          </h2>

          <p className="mb-5 text-lg leading-relaxed text-gray-700">
            They lose it because nothing was written down when it mattered.
          </p>

          <div className="my-7 border-l-4 border-brand-green pl-5">
            <p className="text-lg italic leading-relaxed text-gray-700">
              A quote agreed on a voice call. Extra work started on a verbal. A
              defect buried in the group chat. A snag &quot;sorted&quot; with no photo,
              no sign-off, no record.
            </p>
          </div>

          <p className="mb-5 text-lg leading-relaxed text-gray-700">
            If your team uses WhatsApp for construction, this audit will find
            exactly where your exposure is.
          </p>

          <p className="mb-5 text-lg leading-relaxed text-gray-700">
            The agreement happened. It just doesn&apos;t look like one.
          </p>

          <p className="text-lg leading-relaxed text-gray-700">
            This audit takes two minutes. Six questions about how you actually
            run your jobs. You get a score showing exactly where the gaps are —
            and 9 copy-paste WhatsApp templates that fix them today.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-green">
            What you get
          </p>
          <h2 className="mb-7 text-3xl font-extrabold leading-tight tracking-tight">
            Your Exposure Score. Your biggest gap, named.
          </h2>

          <ul className="space-y-4">
            {[
              "Get written approval within seconds of a client requesting extra work, so your invoice reflects what was actually agreed — not what the client remembers agreeing to.",
              "Get your quote accepted in writing the moment you send it, so you never mobilise on a job that wasn't properly confirmed.",
              'Get a written snag instruction confirmed by the sub, so "I sorted it" never becomes an argument about whether it actually was.',
              "The templates that fix your biggest gaps — flagged for you specifically — plus the full set of 9 to cover everything else.",
            ].map((item) => (
              <li key={item} className="flex gap-4 text-base leading-relaxed text-gray-800">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mb-4 mt-10 text-xs font-bold uppercase tracking-widest text-brand-green">
            The 6 workflows we test
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {workflows.map(([name, description]) => (
              <div key={name} className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="mb-1 font-bold">{name}</p>
                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-green">
            Who this is for
          </p>
          <h2 className="mb-7 text-3xl font-extrabold leading-tight tracking-tight">
            The bigger your jobs, the more the gaps cost you.
          </h2>

          <div className="mb-7 rounded-lg border border-green-200 bg-green-50 p-6">
            <p className="text-base leading-relaxed text-green-900">
              SA contractors — solo operators to established GCs — running jobs
              through WhatsApp with no written record at the moment it matters.
              If your team uses WhatsApp to run quotes, variations, snags,
              leads, or site updates, this audit will find exactly where the
              exposure is.
            </p>
          </div>

          <p className="text-lg leading-relaxed text-gray-700">
            Every cent you&apos;ve lost on an undocumented agreement is sitting in a
            WhatsApp chat somewhere. The record exists. The problem is it looks
            like a conversation, not a decision.
          </p>
        </div>
      </section>

      <section className="bg-[#0D1F2D] px-5 py-14 text-center text-white sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight">
            Two minutes. Find out exactly where you&apos;re exposed.
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/70">
            Answer 6 questions. Get your Exposure Score. Walk away with the
            templates to fix it — today.
          </p>
          <button
            id="take-the-audit"
            type="button"
            onClick={onStart}
            className="h-14 w-full max-w-md rounded-full bg-brand-green px-8 text-base font-extrabold text-white transition hover:bg-[#145230]"
          >
            Show me where I&apos;m leaking money
            {" "}
            <span aria-hidden="true">→</span>
          </button>
          <p className="mt-4 text-xs tracking-wide text-white/45">
            Built for South African contractors. Free. No catch.
          </p>
        </div>
      </section>
    </>
  );
}

function ResultView({ result }: { result: AuditResult }) {
  const templateHref = getTemplateHref(result.biggestLeak);
  const flaggedTemplates = result.flaggedTemplateIds
    .map((id) => getTemplateById(id))
    .filter(Boolean);
  const pilotable = result.biggestLeak
    ? auditModuleMeta[result.biggestLeak].pilotable
    : false;
  const whatsappText = result.biggestLeakLabel
    ? `Hi Luke, I completed the WISCON audit and my biggest gap was ${result.biggestLeakLabel}. Can you show me that workflow?`
    : "Hi Luke, I completed the WISCON audit. Can you show me how WISCON works?";

  return (
    <section className="px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <p className="mb-5 text-sm font-semibold uppercase text-brand-green">
              Your Exposure Score
            </p>
            <div className="mb-4 text-6xl font-bold text-brand-black">
              {result.exposureScore}%
            </div>
            <h1 className="mb-4 text-3xl font-bold">{result.bandLabel}</h1>
            <p className="text-base leading-relaxed text-gray-700">
              {result.bandHeadline}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            {result.biggestLeak ? (
              <>
                <p className="mb-3 text-sm font-semibold uppercase text-brand-green">
                  Your biggest leak is {result.biggestLeakLabel}
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  {result.biggestLeakCopy}
                </p>
              </>
            ) : (
              <>
                <p className="mb-3 text-sm font-semibold uppercase text-brand-green">
                  No single leak stood out
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  Your answers are clean across the board. Keep the templates
                  nearby so the record exists even when the site gets busy.
                </p>
              </>
            )}

            <div className="mt-7 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <p className="mb-3 text-sm font-semibold text-brand-black">
                Templates flagged for you
              </p>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                Here are your 9 templates. The ones flagged above are your
                priority — copy, paste, send. They&apos;re the manual version of
                what WISCON handles automatically on every job.
              </p>
              {flaggedTemplates.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {flaggedTemplates.map(
                    (template) =>
                      template && (
                        <span
                          key={template.id}
                          className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-brand-green"
                        >
                          Template {template.id}: {template.title}
                        </span>
                      )
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  The full set is useful as a backup even if your score is low.
                </p>
              )}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={templateHref}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-green px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Open my templates
              </Link>
              {pilotable && (
                <a
                  href={`https://wa.me/27689359269?text=${encodeURIComponent(
                    whatsappText
                  )}`}
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-gray-50"
                >
                  Ask Luke to show me
                </a>
              )}
            </div>

            {result.biggestLeak && !pilotable && (
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                Your interest in {result.biggestLeakLabel} is logged. That
                workflow is not being offered as a live pilot yet, so start with
                the manual template for now.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="mb-6 text-2xl font-bold">Workflow breakdown</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {result.categoryScores.map((score) => (
              <div key={score.module} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-semibold">{score.label}</p>
                  <p className="text-sm text-gray-500">{score.points}/10</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={[
                      "h-full rounded-full",
                      score.points >= 10
                        ? "bg-red-500"
                        : score.points >= 5
                          ? "bg-amber-500"
                          : "bg-brand-green",
                    ].join(" ")}
                    style={{ width: `${score.points * 10}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  {score.shortLabel}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
