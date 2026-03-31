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
    .select({ filterByFormula: `{Email}="${email}"`, maxRecords: 1 })
    .firstPage();
  return records.length > 0;
}

async function writeToAirtable(fields: {
  Name: string;
  Email: string;
  "Company name": string;
  Services: string[];
  "Signed Up At": string;
  Source: string;
}) {
  const base = getBase();
  const table = process.env.AIRTABLE_TABLE_NAME!;
  await base(table).create([{ fields }]);
}

async function sendConfirmationEmail(name: string, email: string, services: string[]) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: "WISCON <onboarding@resend.dev>",
    to: email,
    subject: "You're on the WISCON waitlist 🎉",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #1C1C1C;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Hi ${name},</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 16px;">
          You're on the WISCON waitlist. We'll be in touch before we go public.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 24px;">
          You expressed interest in: <strong>${services.join(", ")}</strong>.
        </p>
        <p style="font-size: 14px; color: #9CA3AF;">
          — The WISCON team<br/>
          WhatsApp Integrated Services in Construction
        </p>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, services } = body;

    // Validate
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (!Array.isArray(services) || services.length === 0) {
      return NextResponse.json({ error: "At least one service must be selected." }, { status: 400 });
    }
    const validServices = ["LeadSync", "ChangeVerify", "SnagScribe"];
    if (!services.every((s: string) => validServices.includes(s))) {
      return NextResponse.json({ error: "Invalid service selected." }, { status: 400 });
    }

    // Duplicate check — non-fatal if lookup fails
    let isDuplicate = false;
    try {
      isDuplicate = await checkDuplicate(email.trim().toLowerCase());
    } catch {
      // proceed with write if check fails
    }
    if (isDuplicate) {
      return NextResponse.json({ message: "Already on waitlist." }, { status: 409 });
    }

    // Write to Airtable
    await writeToAirtable({
      Name: name.trim(),
      Email: email.trim().toLowerCase(),
      "Company name": company?.trim() ?? "",
      Services: services,
      "Signed Up At": new Date().toISOString(),
      Source: "website",
    });

    // Send confirmation email — fire and forget
    sendConfirmationEmail(name.trim(), email.trim().toLowerCase(), services).catch((err) =>
      console.error("[/api/waitlist] Resend failed:", err)
    );

    return NextResponse.json({ message: "Success." }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/waitlist]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
