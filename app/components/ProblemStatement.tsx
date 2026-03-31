const problems = [
  {
    stat: "10–15hrs",
    label: "wasted per week",
    description: "Manually qualifying leads that go nowhere.",
  },
  {
    stat: "#1",
    label: "cause of disputes",
    description: "Verbal change orders no one wrote down.",
  },
  {
    stat: "Days",
    label: "lost at handover",
    description: "Chasing photos, punch lists, and sign-offs across WhatsApp groups.",
  },
];

export default function ProblemStatement() {
  return (
    <section className="px-5 sm:px-8 py-20 sm:py-24" style={{ backgroundColor: "var(--color-off-white)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "var(--color-black)" }}
          >
            Construction runs on WhatsApp. The tools don&apos;t.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Your team already communicates on WhatsApp — but every time something needs to be tracked, approved, or documented, you switch to a system no one uses. That gap costs you money and creates disputes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div key={p.stat} className="bg-white rounded-2xl p-8">
              <p
                className="text-4xl font-bold mb-1"
                style={{ color: "var(--color-green)" }}
              >
                {p.stat}
              </p>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                {p.label}
              </p>
              <p className="text-gray-700 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
