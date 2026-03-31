const stats = [
  { value: "93.9%", label: "WhatsApp penetration in South Africa" },
  { value: "0", label: "New apps for your team to download" },
  { value: "24/7", label: "Access from any site, any phone" },
];

const reasons = [
  {
    heading: "They already use it",
    body:
      "93.9% of South African smartphone users are on WhatsApp. Your crew, your subs, your clients — they're all there. WISCON meets them where they already are.",
  },
  {
    heading: "No training required",
    body:
      "New software means training, resistance, and abandonment. WhatsApp requires none of that. Adoption is instant because your team already knows how to use it.",
  },
  {
    heading: "Works on any phone",
    body:
      "Construction sites aren't offices. Your team is using entry-level Android phones with patchy signal. WhatsApp is optimised for exactly that environment.",
  },
  {
    heading: "Built for South Africa",
    body:
      "WISCON is designed for the local construction market — the pricing, the workflows, and the communication style reflect how South African contractors actually operate.",
  },
];

export default function WhyWhatsApp() {
  return (
    <section
      id="why-whatsapp"
      className="px-5 sm:px-8 py-20 sm:py-24"
      style={{ backgroundColor: "var(--color-off-white)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "var(--color-black)" }}
          >
            Why WhatsApp? Why South Africa?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We didn&apos;t pick WhatsApp because it&apos;s trendy. We picked it because it&apos;s already on every phone on every construction site in the country.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {stats.map((s) => (
            <div
              key={s.value}
              className="bg-white rounded-2xl p-8 text-center"
            >
              <p
                className="text-4xl font-bold mb-2"
                style={{ color: "var(--color-green)" }}
              >
                {s.value}
              </p>
              <p className="text-sm text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reasons.map((r) => (
            <div key={r.heading} className="bg-white rounded-2xl p-8">
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: "var(--color-black)" }}
              >
                {r.heading}
              </h3>
              <p className="text-gray-600 leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
