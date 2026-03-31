const services = [
  {
    id: "LeadSync",
    name: "LeadSync",
    tagline: "Automated Pre-Construction Qualifier",
    problem: "Tire-kickers waste 10–15 hours of your week.",
    solution:
      "Click-to-WhatsApp triggers a bot that qualifies project type, budget, and photos — then auto-books site visits or politely declines. You only talk to real leads.",
    target: "Residential contractors · Home service businesses",
    price: "From $49/month",
    icon: "🔗",
  },
  {
    id: "ChangeVerify",
    name: "ChangeVerify",
    tagline: "Formalized WhatsApp Change Orders",
    problem: "Verbal change orders are the #1 cause of construction disputes.",
    solution:
      "Send a change order via bot — client receives Approve/Decline buttons on WhatsApp — digital record created — PDF confirmation sent automatically.",
    target: "General contractors · Homeowners",
    price: "Per order or monthly subscription",
    icon: "✅",
  },
  {
    id: "SnagScribe",
    name: "SnagScribe",
    tagline: "AI-Powered Punch List Management",
    problem: "The snagging phase is chaotic — lost photos, missed items, delayed payments.",
    solution:
      "Supervisor sends a photo + voice note → AI creates a structured ticket → assigned to sub via WhatsApp → tracked to completion. No app to download.",
    target: "Site supervisors · Subcontractors · Project managers",
    price: "Per-project flat fee",
    icon: "📋",
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
            Three tools. One familiar interface.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Each WISCON service solves a specific, costly problem in construction — delivered entirely through WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
