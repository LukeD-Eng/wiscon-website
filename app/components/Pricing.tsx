const plans = [
  {
    name: "Solo Operator",
    activeProjects: "5",
    internalUsers: "5",
    externalCollaborators: "Included",
    price: "R999",
    cta: "Join the Waitlist",
  },
  {
    name: "Contractor",
    activeProjects: "15",
    internalUsers: "30",
    externalCollaborators: "Included",
    price: "R2,999",
    cta: "Join the Waitlist",
  },
  {
    name: "Business",
    activeProjects: "30",
    internalUsers: "100",
    externalCollaborators: "Included",
    price: "R7,999",
    cta: "Join the Waitlist",
  },
  {
    name: "Enterprise",
    activeProjects: "Custom",
    internalUsers: "Custom",
    externalCollaborators: "Custom",
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
            Choose the plan that fits your active project load and internal team. Clients, subcontractors, suppliers, consultants, architects, and engineers can collaborate without becoming paid seats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
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
                  <dt className="font-medium text-gray-500">External collaborators</dt>
                  <dd className="mt-1 font-semibold" style={{ color: "var(--color-black)" }}>
                    {plan.externalCollaborators}
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
            Flexible scaling options available for growing teams and active projects.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            External collaborators, including clients, subcontractors, suppliers, architects, engineers, and consultants, are included at no additional cost under fair usage.
          </p>
        </div>
      </div>
    </section>
  );
}
