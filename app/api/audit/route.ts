import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import { Resend } from "resend";
import {
  AuditAnswers,
  auditModuleIds,
  auditModuleMeta,
  contractorTypeOptions,
  getTemplateById,
  getTemplateHref,
  isAnswerValue,
  roleOptions,
  scoreAudit,
} from "@/lib/audit";

type AuditLead = {
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  role: string;
  contractorType: string;
  answers: AuditAnswers;
};

function getBase() {
  Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY! });
  return new Airtable().base(process.env.AIRTABLE_BASE_ID!);
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function replyToAddress() {
  return process.env.RESEND_REPLY_TO ?? "hello@wiscon.co.za";
}

function parseAuditLead(body: unknown): AuditLead | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." };
  }

  const record = body as Record<string, unknown>;
  const name = clean(record.name);
  const email = clean(record.email).toLowerCase();
  const whatsapp = clean(record.whatsapp);
  const company = clean(record.company);
  const role = clean(record.role);
  const contractorType = clean(record.contractorType);

  if (!name) return { error: "Full name is required." };
  if (!email || !validEmail(email)) return { error: "A valid email is required." };
  if (!whatsapp) return { error: "WhatsApp number is required." };
  if (!company) return { error: "Company name is required." };
  if (!roleOptions.includes(role as (typeof roleOptions)[number])) {
    return { error: "A valid role is required." };
  }
  if (
    !contractorTypeOptions.includes(
      contractorType as (typeof contractorTypeOptions)[number]
    )
  ) {
    return { error: "A valid contractor type is required." };
  }

  const answersRaw = record.answers;
  if (!answersRaw || typeof answersRaw !== "object") {
    return { error: "Audit answers are required." };
  }

  const answersRecord = answersRaw as Record<string, unknown>;
  const answers: Partial<AuditAnswers> = {};

  for (const moduleId of auditModuleIds) {
    const value = answersRecord[moduleId];
    if (!isAnswerValue(value)) {
      return { error: `A valid answer is required for ${moduleId}.` };
    }
    answers[moduleId] = value;
  }

  return {
    name,
    email,
    whatsapp,
    company,
    role,
    contractorType,
    answers: answers as AuditAnswers,
  };
}

async function writeToAirtable(lead: AuditLead) {
  const result = scoreAudit(lead.answers);
  const base = getBase();
  const table = process.env.AIRTABLE_TABLE_NAME!;
  const now = new Date().toISOString();
  const source = "wiscon-audit-v3";
  const services = result.biggestLeak ? [result.biggestLeak] : [];
  const flaggedTemplates = result.flaggedTemplateIds
    .map((id) => `Template ${id}`)
    .join(", ");
  const auditAnswers = result.categoryScores.map((score) => ({
    module: score.module,
    label: score.label,
    answer: score.answer,
    points: score.points,
  }));

  const baseFields = {
    Name: lead.name,
    Email: lead.email,
    "Company name": lead.company,
    Services: services,
    "Signed Up At": now,
    Source: source,
  };
  const auditFields = {
    Role: lead.role,
    "Contractor type": lead.contractorType,
    "Exposure Score": result.exposureScore,
    "Exposure Band": result.bandLabel,
    "Biggest Leak": result.biggestLeakLabel ?? "None",
    "Flagged Templates": flaggedTemplates,
    "Audit Answers": JSON.stringify(auditAnswers),
  };
  const fieldAttempts = [
    { ...baseFields, "WhatsApp number": lead.whatsapp, ...auditFields },
    { ...baseFields, "WhatsApp Number": lead.whatsapp, ...auditFields },
    {
      ...baseFields,
      "WhatsApp number": lead.whatsapp,
      ...Object.fromEntries(
        Object.entries(auditFields).filter(([key]) => key !== "Exposure Band")
      ),
    },
    {
      ...baseFields,
      "WhatsApp Number": lead.whatsapp,
      ...Object.fromEntries(
        Object.entries(auditFields).filter(([key]) => key !== "Exposure Band")
      ),
    },
  ];

  for (const fields of fieldAttempts) {
    try {
      await base(table).create([{ fields }], { typecast: true });
      return;
    } catch (err) {
      const airtableError = err as { error?: string };
      if (airtableError.error !== "UNKNOWN_FIELD_NAME") {
        throw err;
      }
    }
  }

  try {
    await base(table).create([{ fields: baseFields }], { typecast: true });
  } catch (err) {
    console.error("[/api/audit] Airtable write failed:", err);
    throw err;
  }
}

async function sendResultEmail(lead: AuditLead, origin: string) {
  if (!process.env.RESEND_API_KEY) {
    console.error("[/api/audit] RESEND_API_KEY is not set.");
    return;
  }

  const result = scoreAudit(lead.answers);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const templatesPath = getTemplateHref(result.biggestLeak);
  const templatesUrl = `${origin}${templatesPath}`;
  const firstName = lead.name.split(/\s+/)[0] || lead.name;
  const flagged = result.flaggedTemplateIds
    .map((id) => getTemplateById(id)?.title ?? `Template ${id}`)
    .join(", ");

  return resend.emails.send({
    from: process.env.RESEND_FROM ?? "WISCON <onboarding@resend.dev>",
    replyTo: replyToAddress(),
    to: lead.email,
    subject: "Your audit results + your templates",
    html: `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1C1C1C;">
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 18px;">Hi ${escapeHtml(firstName)},</p>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin: 0 0 18px;">
          Your Exposure Score is in — and so are your templates. Your score: <strong style="color:#1C1C1C;">${result.exposureScore}% — ${escapeHtml(result.bandLabel)}</strong>.
        </p>
        ${
          result.biggestLeak
            ? `<p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin: 0 0 18px;">
                Your biggest leak is <strong style="color:#1C1C1C;">${escapeHtml(auditModuleMeta[result.biggestLeak].label)}</strong>. The templates highlighted for you are: <strong style="color:#1C1C1C;">${escapeHtml(flagged)}</strong>.
              </p>`
            : `<p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin: 0 0 18px;">
                Your answers show a tight workflow. The full template set is still worth keeping close for the days when site pressure makes admin easy to skip.
              </p>`
        }
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin: 0 0 18px;">
          The ones highlighted for you based on your results are where to start. Send the first relevant one before your next job moves forward. Thirty seconds. That's the difference between having a record and not having one.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin: 0 0 24px;">
          Here's the full set: <a href="${templatesUrl}" style="color:#1B6B3A; font-weight: 700;">open your templates</a>
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin: 0 0 18px;">
          One thing worth knowing — those templates are the manual version of what I'm building. Every workflow they cover, handled automatically through WhatsApp. No new app. Same number.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin: 0 0 28px;">More on that in a few days.</p>
        <p style="font-size: 14px; line-height: 1.6; color: #9CA3AF; margin: 0;">
          Luke<br />
          WISCON — WhatsApp Integrated Services in Construction
        </p>
      </div>
    `,
  });
}

async function sendOwnerNotification(lead: AuditLead, origin: string) {
  if (!process.env.RESEND_API_KEY) {
    console.error("[/api/audit] RESEND_API_KEY is not set.");
    return;
  }

  const notifyEmail =
    process.env.AUDIT_NOTIFICATION_EMAIL ?? "luke12davids@gmail.com";
  const result = scoreAudit(lead.answers);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const templatesUrl = `${origin}${getTemplateHref(result.biggestLeak)}`;
  const answerRows = result.categoryScores
    .map(
      (score) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #E5E7EB;">${escapeHtml(score.label)}</td>
          <td style="padding:8px;border-bottom:1px solid #E5E7EB;">${score.answer}</td>
          <td style="padding:8px;border-bottom:1px solid #E5E7EB;">${score.points}/10</td>
        </tr>`
    )
    .join("");

  return resend.emails.send({
    from: process.env.RESEND_FROM ?? "WISCON <onboarding@resend.dev>",
    replyTo: replyToAddress(),
    to: notifyEmail,
    subject: `New WISCON audit: ${result.exposureScore}% — ${result.biggestLeakLabel ?? "No leak"}`,
    html: `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; margin: 0 auto; padding: 40px 24px; color: #1C1C1C;">
        <h1 style="font-size:24px;margin:0 0 18px;">New WISCON audit lead</h1>
        <p style="font-size:16px;line-height:1.6;color:#4B5563;margin:0 0 18px;">
          ${escapeHtml(lead.name)} from ${escapeHtml(lead.company)} completed the audit.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 24px;">
          <tbody>
            <tr><td style="padding:8px;border-bottom:1px solid #E5E7EB;font-weight:700;">Email</td><td style="padding:8px;border-bottom:1px solid #E5E7EB;">${escapeHtml(lead.email)}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #E5E7EB;font-weight:700;">WhatsApp</td><td style="padding:8px;border-bottom:1px solid #E5E7EB;">${escapeHtml(lead.whatsapp)}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #E5E7EB;font-weight:700;">Role</td><td style="padding:8px;border-bottom:1px solid #E5E7EB;">${escapeHtml(lead.role)}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #E5E7EB;font-weight:700;">Contractor type</td><td style="padding:8px;border-bottom:1px solid #E5E7EB;">${escapeHtml(lead.contractorType)}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #E5E7EB;font-weight:700;">Score</td><td style="padding:8px;border-bottom:1px solid #E5E7EB;">${result.exposureScore}% — ${escapeHtml(result.bandLabel)}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #E5E7EB;font-weight:700;">Biggest leak</td><td style="padding:8px;border-bottom:1px solid #E5E7EB;">${escapeHtml(result.biggestLeakLabel ?? "None")}</td></tr>
          </tbody>
        </table>
        <h2 style="font-size:18px;margin:0 0 10px;">Answers</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 24px;">
          <thead>
            <tr>
              <th style="padding:8px;border-bottom:1px solid #D1D5DB;text-align:left;">Workflow</th>
              <th style="padding:8px;border-bottom:1px solid #D1D5DB;text-align:left;">Answer</th>
              <th style="padding:8px;border-bottom:1px solid #D1D5DB;text-align:left;">Points</th>
            </tr>
          </thead>
          <tbody>${answerRows}</tbody>
        </table>
        <p style="font-size:14px;line-height:1.6;color:#4B5563;margin:0;">
          Result templates: <a href="${templatesUrl}" style="color:#1B6B3A;font-weight:700;">${templatesUrl}</a>
        </p>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = parseAuditLead(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = scoreAudit(parsed.answers);
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || req.nextUrl.origin;

    await writeToAirtable(parsed);

    const [resultEmail, ownerNotification] = await Promise.allSettled([
      sendResultEmail(parsed, origin),
      sendOwnerNotification(parsed, origin),
    ]);

    if (resultEmail.status === "rejected") {
      console.error("[/api/audit] Resend failed:", resultEmail.reason);
    } else if (resultEmail.value?.error) {
      console.error("[/api/audit] Resend failed:", resultEmail.value.error);
    }
    if (ownerNotification.status === "rejected") {
      console.error(
        "[/api/audit] owner notification failed:",
        ownerNotification.reason
      );
    } else if (ownerNotification.value?.error) {
      console.error(
        "[/api/audit] owner notification failed:",
        ownerNotification.value.error
      );
    }

    const resultEmailStatus =
      resultEmail.status === "fulfilled" && resultEmail.value
        ? {
            status: resultEmail.status,
            id: resultEmail.value.data?.id ?? null,
            error: resultEmail.value.error ?? null,
            to: parsed.email,
          }
        : { status: resultEmail.status, to: parsed.email };
    const ownerNotificationTo =
      process.env.AUDIT_NOTIFICATION_EMAIL ?? "luke12davids@gmail.com";
    const ownerNotificationStatus =
      ownerNotification.status === "fulfilled" && ownerNotification.value
        ? {
            status: ownerNotification.status,
            id: ownerNotification.value.data?.id ?? null,
            error: ownerNotification.value.error ?? null,
            to: ownerNotificationTo,
          }
        : {
            status: ownerNotification.status,
            to: ownerNotificationTo,
          };

    return NextResponse.json(
      {
        message: "Success.",
        result,
        email: {
          resultEmail: resultEmailStatus,
          ownerNotification: ownerNotificationStatus,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/audit]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
