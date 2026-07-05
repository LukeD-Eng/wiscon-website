export const auditModuleIds = [
  "QuoteFlow",
  "VariProof",
  "SnagTrack",
  "LeadGate",
  "SiteDiary",
  "SafeGuard",
] as const;

export type AuditModule = (typeof auditModuleIds)[number];
export type AnswerValue = "A" | "B" | "C";
export type AuditAnswers = Record<AuditModule, AnswerValue>;
export type AuditBand = "tight" | "leaking" | "bleeding";

export type AuditQuestion = {
  id: AuditModule;
  label: string;
  shortLabel: string;
  question: string;
  options: Array<{
    value: AnswerValue;
    label: string;
    points: number;
  }>;
};

export type Template = {
  id: number;
  module: AuditModule;
  moduleLabel: string;
  title: string;
  description: string;
  body: string;
};

export type AuditResult = {
  totalPoints: number;
  exposureScore: number;
  band: AuditBand;
  bandLabel: string;
  bandHeadline: string;
  biggestLeak: AuditModule | null;
  biggestLeakLabel: string | null;
  biggestLeakCopy: string | null;
  flaggedTemplateIds: number[];
  categoryScores: Array<{
    module: AuditModule;
    label: string;
    shortLabel: string;
    answer: AnswerValue;
    points: number;
  }>;
};

export const roleOptions = [
  "Owner / Director",
  "Project Manager",
  "QS / Estimator",
  "Site Manager",
  "Other",
] as const;

export const contractorTypeOptions = [
  "Residential",
  "Commercial",
  "Civils",
  "Specialist trade",
  "Mixed",
] as const;

export const auditModuleMeta: Record<
  AuditModule,
  { label: string; shortLabel: string; pilotable: boolean }
> = {
  QuoteFlow: { label: "QuoteFlow", shortLabel: "Quotes", pilotable: true },
  VariProof: { label: "VariProof", shortLabel: "Variations", pilotable: true },
  SnagTrack: { label: "SnagTrack", shortLabel: "Snags", pilotable: true },
  LeadGate: { label: "LeadGate", shortLabel: "Leads", pilotable: true },
  SiteDiary: { label: "Site Diary", shortLabel: "Site records", pilotable: false },
  SafeGuard: { label: "SafeGuard", shortLabel: "H&S", pilotable: false },
};

export const auditQuestions: AuditQuestion[] = [
  {
    id: "QuoteFlow",
    label: "QuoteFlow",
    shortLabel: "Quote acceptance",
    question:
      "How do you confirm a client has accepted a quote before you commit resources?",
    options: [
      {
        value: "A",
        label: "A verbal yes — a call, a voice note, or they just seemed keen",
        points: 10,
      },
      {
        value: "B",
        label:
          "A WhatsApp message, but acceptance isn't always explicit or replied to",
        points: 5,
      },
      {
        value: "C",
        label: "Written acceptance of scope and price before we mobilise",
        points: 0,
      },
    ],
  },
  {
    id: "VariProof",
    label: "VariProof",
    shortLabel: "Variations",
    question:
      "When a client requests extra work mid-project, what happens before your team starts it?",
    options: [
      {
        value: "A",
        label:
          "We discuss it and get going — paperwork catches up later, if at all",
        points: 10,
      },
      {
        value: "B",
        label:
          "We send a WhatsApp confirming it, but don't always get a reply before starting",
        points: 5,
      },
      {
        value: "C",
        label:
          "We get written approval of scope and cost before anyone lifts a finger",
        points: 0,
      },
    ],
  },
  {
    id: "SnagTrack",
    label: "SnagTrack",
    shortLabel: "Defects / snags",
    question:
      "How is a defect or remedial instruction issued to a subcontractor or team?",
    options: [
      {
        value: "A",
        label: "Verbally on site, or in the group chat",
        points: 10,
      },
      {
        value: "B",
        label: "A WhatsApp message that often gets buried in the thread",
        points: 5,
      },
      {
        value: "C",
        label:
          "A written instruction with a deadline that they confirm receipt of",
        points: 0,
      },
    ],
  },
  {
    id: "LeadGate",
    label: "LeadGate",
    shortLabel: "Lead handling",
    question: "When a new enquiry comes in, what happens first?",
    options: [
      {
        value: "A",
        label: "We call or drive out to quote before qualifying",
        points: 10,
      },
      {
        value: "B",
        label: "We respond fast but qualify informally, case by case",
        points: 5,
      },
      {
        value: "C",
        label: "We qualify budget, scope and seriousness before spending time",
        points: 0,
      },
    ],
  },
  {
    id: "SiteDiary",
    label: "Site Diary",
    shortLabel: "Site records",
    question: "How consistently do you keep a daily written site record?",
    options: [
      {
        value: "A",
        label: "Rarely — memory, or scattered notes and photos",
        points: 10,
      },
      {
        value: "B",
        label: "Sometimes — when it feels important",
        points: 5,
      },
      {
        value: "C",
        label:
          "Consistently — a written daily record on every active project",
        points: 0,
      },
    ],
  },
  {
    id: "SafeGuard",
    label: "SafeGuard",
    shortLabel: "Health & Safety",
    question: "How do you record toolbox talks, inductions and on-site incidents?",
    options: [
      {
        value: "A",
        label: "Paper forms, or not captured consistently at all",
        points: 10,
      },
      {
        value: "B",
        label: "Some WhatsApp messages and photos, but nothing structured",
        points: 5,
      },
      {
        value: "C",
        label: "A consistent written or digital record for every talk and incident",
        points: 0,
      },
    ],
  },
];

export const templates: Template[] = [
  {
    id: 1,
    module: "VariProof",
    moduleLabel: "VariProof",
    title: "Before extra work starts",
    description:
      "Send this before starting anything outside the original scope.",
    body: `Hi [Name], just to confirm before we get going — you've asked us to [describe the extra work]. The additional cost is R[amount] and it should take [timeframe]. Please reply "Confirmed" so I have your approval in writing. [Your name]`,
  },
  {
    id: 2,
    module: "VariProof",
    moduleLabel: "VariProof",
    title: "No reply after 24 hours",
    description:
      "A calm follow-up that keeps the written approval trail intact.",
    body: `Hi [Name], following up on the [extra work] message. I can't start until I have your confirmation in writing. Reply "Confirmed" when you're ready. [Your name]`,
  },
  {
    id: 3,
    module: "VariProof",
    moduleLabel: "VariProof",
    title: "Client disputes work they already approved",
    description:
      "Points the conversation back to the approval the client already gave.",
    body: `Hi [Name], regarding the query on [extra work] — on [date] you confirmed via WhatsApp that you approved this at R[amount]. I've included that message below. Happy to chat if needed. [Your name]
[Paste their confirmation here]`,
  },
  {
    id: 4,
    module: "LeadGate",
    moduleLabel: "LeadGate",
    title: "Lead qualification opener",
    description:
      "Filters budget, scope, timing, and seriousness before you spend time on a call or site visit.",
    body: `Hi [Name], thanks for the enquiry. Before I quote properly, please send:
1. Site address/suburb
2. Short description of the work
3. Photos or video of the area
4. Ideal timing
5. Budget range

Once I have that, I can confirm whether it's a good fit and the next step. [Your name]`,
  },
  {
    id: 5,
    module: "QuoteFlow",
    moduleLabel: "QuoteFlow",
    title: "Getting a quote accepted before you mobilise",
    description:
      "Client confirms scope, price, and terms in writing before you spend a cent.",
    body: `Hi [Name], here's your quote for [describe work]:
Scope: [description]
Price: R[amount]
Payment terms: [terms]
Start date: [date]
Reply "Accepted" to confirm you're happy with the scope, price and terms. I'll get started once I have that from you. [Your name]`,
  },
  {
    id: 6,
    module: "SnagTrack",
    moduleLabel: "SnagTrack",
    title: "Defect instruction to a sub",
    description:
      "A specific defect, location, and deadline in writing.",
    body: `Hi [Name], snag on site: [describe the defect], at [location]. This must be fixed by [date]. Please confirm you've received this instruction. [Your name]`,
  },
  {
    id: 7,
    module: "SnagTrack",
    moduleLabel: "SnagTrack",
    title: "Confirm the defect is fixed",
    description:
      "Gets a completion photo and written confirmation before sign-off.",
    body: `Hi [Name], please send a photo of the [defect] once it's fixed and confirm in this message that it's done. I need both before I can sign this off. [Your name]`,
  },
  {
    id: 8,
    module: "SiteDiary",
    moduleLabel: "Site Diary",
    title: "End of day site record",
    description:
      "One written daily record for workers, work, weather, issues, and tomorrow's plan.",
    body: `Site log — [Date]
Workers on site: [number + trades]
Work completed: [description]
Weather: [conditions]
Issues/incidents: [details or "None"]
Plan for tomorrow: [brief]
— [Your name]`,
  },
  {
    id: 9,
    module: "SafeGuard",
    moduleLabel: "SafeGuard",
    title: "Toolbox talk / incident record",
    description:
      "A simple written H&S record for talks, inductions, or incidents.",
    body: `H&S record — [Date]
Type: [Toolbox talk / Induction / Incident]
Topic or details: [description]
Attendees or persons involved: [names]
Photo attached: [Yes / No]
— [Your name]`,
  },
];

export const bandCopy: Record<
  AuditBand,
  { label: string; headline: string }
> = {
  bleeding: {
    label: "At Risk",
    headline:
      "Your answers show a few places where important job decisions could be clearer. Start with the templates flagged below and focus on the biggest gap first.",
  },
  leaking: {
    label: "Exposed",
    headline:
      "You already have some good habits in place. There is still at least one workflow where a clearer written step could help the next job run smoother.",
  },
  tight: {
    label: "Controlled",
    headline:
      "You are already running tighter than most. WISCON is built to make those good habits easier to repeat, so the record exists even on busy days.",
  },
};

export const biggestLeakCopy: Record<AuditModule, string> = {
  QuoteFlow:
    "Your biggest gap is quote acceptance. Template 5 helps you keep payment stages clear, and Template 4 is useful when you need the client to accept scope, price, and terms before work starts.",
  VariProof:
    "Your biggest gap is variations. Template 1 helps you confirm the scope, cost, and timing of extra work before anyone gets started.",
  SnagTrack:
    "Your biggest gap is defect instructions. Templates 6 and 7 help you assign a snag clearly and close the loop with a photo and written confirmation.",
  LeadGate:
    "Your biggest gap is lead handling. Template 4 gives you a useful structure for getting the important details clear before time is spent on the wrong work.",
  SiteDiary:
    "Your biggest gap is site records. Template 8 gives you a simple daily rhythm for capturing what happened while the details are still fresh.",
  SafeGuard:
    "Your biggest gap is health and safety records. Template 9 gives you a simple structure for toolbox talks, inductions, and incident notes.",
};

const flaggedTemplatesByModule: Record<AuditModule, number[]> = {
  QuoteFlow: [5],
  VariProof: [1, 2, 3],
  SnagTrack: [6, 7],
  LeadGate: [4],
  SiteDiary: [8],
  SafeGuard: [9],
};

const tiePriority: AuditModule[] = [
  "VariProof",
  "QuoteFlow",
  "SnagTrack",
  "LeadGate",
  "SiteDiary",
  "SafeGuard",
];

export function isAuditModule(value: string): value is AuditModule {
  return auditModuleIds.includes(value as AuditModule);
}

export function isAnswerValue(value: unknown): value is AnswerValue {
  return value === "A" || value === "B" || value === "C";
}

export function getTemplateById(id: number) {
  return templates.find((template) => template.id === id);
}

export function getTemplateHref(module: AuditModule | null) {
  return module ? `/templates?highlight=${module}` : "/templates";
}

export function scoreAudit(answers: AuditAnswers): AuditResult {
  const categoryScores = auditQuestions.map((question) => {
    const answer = answers[question.id];
    const option = question.options.find((item) => item.value === answer);

    if (!option) {
      throw new Error(`Invalid answer for ${question.id}`);
    }

    return {
      module: question.id,
      label: question.label,
      shortLabel: question.shortLabel,
      answer,
      points: option.points,
    };
  });

  const totalPoints = categoryScores.reduce((sum, item) => sum + item.points, 0);
  const exposureScore = Math.round((totalPoints / 60) * 100);
  const band = getBand(exposureScore);
  const biggestLeak = getBiggestLeak(categoryScores);
  const flaggedTemplateIds = biggestLeak
    ? flaggedTemplatesByModule[biggestLeak]
    : [];

  return {
    totalPoints,
    exposureScore,
    band,
    bandLabel: bandCopy[band].label,
    bandHeadline: bandCopy[band].headline,
    biggestLeak,
    biggestLeakLabel: biggestLeak ? auditModuleMeta[biggestLeak].label : null,
    biggestLeakCopy: biggestLeak ? biggestLeakCopy[biggestLeak] : null,
    flaggedTemplateIds,
    categoryScores,
  };
}

function getBand(exposureScore: number): AuditBand {
  if (exposureScore <= 33) return "tight";
  if (exposureScore <= 66) return "leaking";
  return "bleeding";
}

function getBiggestLeak(
  scores: Array<{ module: AuditModule; points: number }>
): AuditModule | null {
  const highest = Math.max(...scores.map((item) => item.points));
  if (highest === 0) return null;

  const tied = scores
    .filter((item) => item.points === highest)
    .map((item) => item.module);

  return tiePriority.find((module) => tied.includes(module)) ?? tied[0] ?? null;
}
