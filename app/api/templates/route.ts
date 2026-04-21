import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Airtable from "airtable";

function getBase() {
  Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY! });
  return new Airtable().base(process.env.AIRTABLE_BASE_ID!);
}

async function checkDuplicate(email: string): Promise<boolean> {
  const base = getBase();
  const table = process.env.AIRTABLE_TABLE_NAME!;
  const records = await base(table)
    .select({
      filterByFormula: `AND({Email}="${email}", {Source}="variproof-templates")`,
      maxRecords: 1,
    })
    .firstPage();
  return records.length > 0;
}

async function writeToAirtable(name: string, email: string) {
  const base = getBase();
  const table = process.env.AIRTABLE_TABLE_NAME!;
  await base(table).create([
    {
      fields: {
        Name: name,
        Email: email,
        "Company name": "",
        Services: ["VariProof"],
        "Signed Up At": new Date().toISOString(),
        Source: "variproof-templates",
      },
    },
  ]);
}

async function sendTemplatesEmail(name: string, email: string) {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  // Set VARIPROOF_TEMPLATES_URL in your Vercel environment variables
  // once your templates file is hosted (e.g. a Google Drive share link or Dropbox link).
  const templatesUrl = process.env.VARIPROOF_TEMPLATES_URL;
  const hasLink = templatesUrl && templatesUrl !== "#";

  const downloadSection = hasLink
    ? `<p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 24px;">
        Here are your templates: <a href="${templatesUrl}" style="color: #1B6B3A; font-weight: 600;">Click here to download</a>
      </p>`
    : `<p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 24px;">
        Your templates are ready — we'll send the download link shortly.
      </p>`;

  await resend.emails.send({
    // NOTE: Update this to a verified sender address once you've added your
    // domain in Resend (resend.com/domains). E.g. "Luke <luke@wiscon.co.za>"
    from: "WISCON <onboarding@resend.dev>",
    to: email,
    subject: "Your change order templates are inside",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #1C1C1C;">
        <p style="font-size: 16px; line-height: 1.6; color: #1C1C1C; margin-bottom: 16px;">Hey ${name},</p>
        ${downloadSection}
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 16px;">
          Five messages. Copy, paste, send. That is it.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 16px;">
          Before your next extra job starts, send Template 1. It takes 30 seconds and it means you and the client are on the same page in writing before you lift a finger.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 32px;">
          That one message is the difference between getting paid and having an argument.
        </p>
        <p style="font-size: 14px; color: #9CA3AF;">
          Luke<br/>
          WISCON — WhatsApp Integrated Services in Construction
        </p>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = body;

    // Validate
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Duplicate check — non-fatal if lookup fails
    let isDuplicate = false;
    try {
      isDuplicate = await checkDuplicate(cleanEmail);
    } catch {
      // proceed with write if check fails
    }

    // Write to Airtable only if not a duplicate
    if (!isDuplicate) {
      await writeToAirtable(cleanName, cleanEmail);
    }

    // Always send the templates email — they should always get what they asked for
    sendTemplatesEmail(cleanName, cleanEmail).catch((err) =>
      console.error("[/api/templates] Resend failed:", err)
    );

    return NextResponse.json({ message: "Success." }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/templates]", msg);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
