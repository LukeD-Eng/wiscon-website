const services = [
  {
    id: "LeadGate",
    name: "LeadGate",
    tagline: "Automated Lead Qualifier",
    problem: "Tire-kickers waste 10–15 hours of your week.",
    solution:
      "Click-to-WhatsApp bot qualifies project type, budget, and photos — books site visits for real leads, declines the rest. You only talk to people worth your time.",
    target: "Bakkie builders · Electricians · Plumbers · Solar installers",
    price: "R450/month",
    icon: "🔗",
  },
  {
    id: "VariProof",
    name: "VariProof",
    tagline: "WhatsApp Variation Orders",
    problem: "Verbal change orders are the #1 cause of disputes in SA construction.",
    solution:
      "Send a /change command → both parties get Approve/Decline buttons on WhatsApp → ECTA-compliant digital record + PDF audit trail generated automatically.",
    target: "GCs · Subcontractors · Architects · Engineers",
    price: "R9 per variation order",
    icon: "✅",
  },
  {
    id: "SnagTrack",
    name: "SnagTrack",
    tagline: "WhatsApp Defect Tracking",
    problem: "Defect instructions buried in noisy group chats — no audit trail, no accountability.",
    solution:
      "Supervisor sends a photo → defect routed to responsible sub via WhatsApp → completion photo received → supervisor approves → timestamped audit trail. No app to download.",
    target: "Principal contractors · Site supervisors · Subcontractors",
    price: "From R1,500/project",
    icon: "📋",
  },
  {
    id: "SiteInstruct",
    name: "SiteInstruct",
    tagline: "Digital Site Instruction Book",
    problem: "Physical site instruction books get lost, disputed, and can't be searched.",
    solution:
      "Formalise a site instruction from a WhatsApp conversation in 60 seconds → contractor taps to sign → immutable, timestamped record stored and retrievable by both parties.",
    target: "Architects · Engineers · Principal agents · Contractors",
    price: "Coming Soon",
    icon: "📄",
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
            Four tools. One familiar interface.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Each WISCON service solves a specific, costly problem in construction — delivered entirely through WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex flex-col rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-shadow"
              style={{ backgroundColor: "var(--color-off-white)" }}
            >
              <div className="text-3xl mb-5">{s.icon}</div>
              <div className="mb-1">
                <span
                  className="inline-block text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
                  style={{ backgroundColor: "#D1FAE5", color: "var(--color-green)" }}
                >
                  Coming Soon
                </span>
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
                <p className="text-xs text-gray-500 mb-1">{s.target}</p>
                <p className="text-sm font-semibold" style={{ color: "var(--color-green)" }}>{s.price}</p>
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
