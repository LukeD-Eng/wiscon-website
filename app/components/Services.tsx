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
    tagline: "Formalised Variation Orders",
    problem: "Verbal change orders are the #1 cause of disputes in SA construction.",
    solution:
      "GC triggers → homeowner approves via button tap → BSUID captured → tamper-proof PDF with SHA-256 hash delivered to both parties via WhatsApp. ECTA Section 13 compliant.",
    target: "GCs · Subcontractors · Architects · Engineers",
    badge: "active",
    icon: "✅",
  },
  {
    id: "LeadGate",
    name: "LeadGate",
    tagline: "Automated Lead Qualifier",
    problem: "Tire-kickers waste 10–15 hours of your week.",
    solution:
      "Click-to-WhatsApp triggers a rule-based bot that qualifies leads on budget, service type, and photo — books site visits for real leads only.",
    target: "Bakkie builders · Electricians · Plumbers · Solar installers",
    badge: "soon",
    icon: "🔗",
  },
  {
    id: "SnagTrack",
    name: "SnagTrack",
    tagline: "WhatsApp Defect Tracking",
    problem: "Defect instructions buried in noisy group chats — no audit trail, no accountability.",
    solution:
      "Supervisor sends a photo → defect routed to responsible sub → completion photo collected → supervisor approves → full timestamped audit trail. No app download.",
    target: "Principal contractors · Site supervisors · Subcontractors",
    badge: "soon",
    icon: "📋",
  },
  {
    id: "QuoteFlow",
    name: "QuoteFlow",
    tagline: "Formal WhatsApp Quoting",
    problem: "Informal voice note quotes cause scope disputes before work even starts.",
    solution:
      "Contractor enters scope and price → formal quote sent to client → client accepts via button tap → ECTA-compliant PDF record delivered to both parties.",
    target: "Bakkie builders · Small GCs · Electricians · Plumbers",
    badge: "soon",
    icon: "📝",
  },
  {
    id: "SafeGuard",
    name: "SafeGuard",
    tagline: "OHSA H&S Incident Reporting",
    problem: "Almost no small SA contractor complies with OHSA incident reporting — it's done on paper or not at all.",
    solution:
      "Log incidents, near-misses, and toolbox talks via WhatsApp buttons → PDF incident report generated → stored and sent to all relevant parties.",
    target: "H&S officers · Principal contractors · Site supervisors",
    badge: "soon",
    icon: "🦺",
  },
  {
    id: "SiteDiary",
    name: "Site Diary",
    tagline: "Daily Site Log Bot",
    problem: "No daily site diary = no evidence base for JBCC Extension of Time claims.",
    solution:
      "Log daily workers, work completed, weather, and delays via WhatsApp → weekly PDF client report auto-generated.",
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
            One platform. Six modules.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Subscribe to WISCON once and get every module — variation orders, lead qualification, defect tracking, formal quoting, H&S reporting, and site diaries. All in WhatsApp. All under one subscription.
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
                    className="inline-block text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
                    style={{ backgroundColor: "#D1FAE5", color: "var(--color-green)" }}
                  >
                    Now in development — join the waitlist
                  </span>
                ) : (
                  <span
                    className="inline-block text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
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
