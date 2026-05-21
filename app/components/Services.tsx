type BadgeType = "active" | "soon";

const services: {
  id: string;
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  target: string;
  badge: BadgeType;
  icon: string;
}[] = [
  {
    id: "VariProof",
    name: "VariProof",
    tagline: "Variation Approval Workflow",
    problem: "Verbal change orders get remembered differently when the invoice arrives.",
    solution:
      "Capture a variation in WhatsApp, get client approval, and save a timestamped record with the evidence attached.",
    target: "GCs · Subcontractors · Architects · Engineers",
    badge: "active",
    icon: "✅",
  },
  {
    id: "LeadGate",
    name: "LeadGate",
    tagline: "Structured Lead Intake",
    problem: "New enquiries arrive in WhatsApp with missing details and no clear next step.",
    solution:
      "Turn inbound WhatsApp enquiries into structured lead records with budget, scope, photos, and follow-up status.",
    target: "Bakkie builders · Electricians · Plumbers · Solar installers",
    badge: "soon",
    icon: "🔗",
  },
  {
    id: "SnagTrack",
    name: "SnagTrack",
    tagline: "Defect Responsibility Workflow",
    problem: "Snag photos get shared, but responsibility and completion proof get lost.",
    solution:
      "Capture the defect photo, assign responsibility, collect completion proof, and keep the sign-off trail in one place.",
    target: "Principal contractors · Site supervisors · Subcontractors",
    badge: "soon",
    icon: "📋",
  },
  {
    id: "QuoteFlow",
    name: "QuoteFlow",
    tagline: "Quote Acceptance Record",
    problem: "Informal voice note quotes create scope confusion before work even starts.",
    solution:
      "Send a clear quote through WhatsApp, capture acceptance, and keep a formal record of the agreed scope and price.",
    target: "Bakkie builders · Small GCs · Electricians · Plumbers",
    badge: "soon",
    icon: "📝",
  },
  {
    id: "SafeGuard",
    name: "SafeGuard",
    tagline: "Site Incident Records",
    problem: "Incidents, near-misses, and toolbox talks are still handled on paper or not captured at all.",
    solution:
      "Log incidents, near-misses, and toolbox talks from site, then store the record where the team can find it.",
    target: "H&S officers · Principal contractors · Site supervisors",
    badge: "soon",
    icon: "🦺",
  },
  {
    id: "SiteDiary",
    name: "Site Diary",
    tagline: "Daily Site Memory",
    problem: "Daily site updates vanish into chat, leaving no clean evidence base for delays or claims.",
    solution:
      "Capture workers, work completed, weather, delays, and photos from WhatsApp, then turn them into a weekly site record.",
    target: "Small GCs · Site managers · Principal agents",
    badge: "soon",
    icon: "📅",
  },
];

export default function Services() {
  return (
    <section id="services" className="px-5 sm:px-8 py-20 sm:py-24" style={{ backgroundColor: "var(--color-white)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "var(--color-black)" }}
          >
            The workflow layer for construction communication.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            WISCON structures the messages your team already sends: variations, defects, quotes, incidents, lead enquiries, and daily site records. No new app. No new behaviour. Just a clearer record of who said what, when, and with what evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex flex-col rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-shadow"
              style={{ backgroundColor: "var(--color-off-white)" }}
            >
              <div className="text-3xl mb-5">{s.icon}</div>
              <div className="mb-1">
                {s.badge === "active" ? (
                  <span
                    className="inline-block max-w-full text-xs font-semibold uppercase tracking-widest leading-snug px-2.5 py-1 rounded-full mb-3"
                    style={{ backgroundColor: "#D1FAE5", color: "var(--color-green)" }}
                  >
                    Now in development — join the waitlist
                  </span>
                ) : (
                  <span
                    className="inline-block max-w-full text-xs font-semibold uppercase tracking-widest leading-snug px-2.5 py-1 rounded-full mb-3"
                    style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
                  >
                    Coming soon
                  </span>
                )}
              </div>
              <h3
                className="text-xl font-bold mb-1"
                style={{ color: "var(--color-black)" }}
              >
                {s.name}
              </h3>
              <p className="text-sm font-medium text-gray-500 mb-4">{s.tagline}</p>
              <p className="text-sm text-gray-500 italic mb-3">&ldquo;{s.problem}&rdquo;</p>
              <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-1">{s.solution}</p>
              <div className="border-t border-gray-200 pt-5 mt-auto">
                <p className="text-xs text-gray-500">{s.target}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center h-13 px-8 rounded-full text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-green)", height: "52px" }}
          >
            Join the Waitlist
          </a>
        </div>
      </div>
    </section>
  );
}
