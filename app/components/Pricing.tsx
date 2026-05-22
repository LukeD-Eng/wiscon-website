const plans = [
  {
    name: "Starter",
    activeProjects: "3",
    internalUsers: "Up to 5",
    bestFor: "Basic capture + records",
    price: "R1,999",
    cta: "Join the Waitlist",
  },
  {
    name: "Contractor",
    activeProjects: "8",
    internalUsers: "Unlimited",
    bestFor: "Full core workflows",
    price: "R4,999",
    cta: "Join the Waitlist",
  },
  {
    name: "Business",
    activeProjects: "20",
    internalUsers: "Unlimited",
    bestFor: "Admin + reporting",
    price: "R9,999",
    cta: "Join the Waitlist",
  },
  {
    name: "Scale",
    activeProjects: "40",
    internalUsers: "Unlimited",
    bestFor: "Multi-team operations",
    price: "R14,999",
    cta: "Join the Waitlist",
  },
  {
    name: "Enterprise",
    activeProjects: "Custom",
    internalUsers: "Custom",
    bestFor: "Custom workflows + SLA",
    price: "Contact us",
    cta: "Talk to Us",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="px-5 sm:px-8 py-20 sm:py-24" style={{ backgroundColor: "var(--color-off-white)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-5"
            style={{ color: "var(--color-green)" }}
          >
            Pricing
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "var(--color-black)" }}
          >
            Priced by company operating scale.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Choose the plan that fits your active project load. Contractor and larger plans include unlimited internal users so the whole team can adopt WISCON without seat-count friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-6"
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-black)" }}>
                {plan.name}
              </h3>

              <div className="mb-6">
                <p className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-black)" }}>
                  {plan.price}
                </p>
                {plan.price !== "Contact us" && (
                  <p className="text-sm text-gray-500 mt-1">per month</p>
                )}
              </div>

              <dl className="space-y-4 text-sm flex-1">
                <div>
                  <dt className="font-medium text-gray-500">Active projects</dt>
                  <dd className="mt-1 font-semibold" style={{ color: "var(--color-black)" }}>
                    {plan.activeProjects}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Internal users</dt>
                  <dd className="mt-1 font-semibold" style={{ color: "var(--color-black)" }}>
                    {plan.internalUsers}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Best for</dt>
                  <dd className="mt-1 font-semibold" style={{ color: "var(--color-black)" }}>
                    {plan.bestFor}
                  </dd>
                </div>
              </dl>

              <a
                href="#waitlist"
                className="mt-8 inline-flex items-center justify-center h-11 px-5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--color-green)" }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-black)" }}>
            Additional active projects from R500/project/month.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            External collaborators, including clients, subcontractors, suppliers, architects, engineers, and consultants, are included at no additional cost. Fair usage applies to WhatsApp messages, media storage, AI usage, PDF records, audit/export packs, and support.
          </p>
        </div>
      </div>
    </section>
  );
}
