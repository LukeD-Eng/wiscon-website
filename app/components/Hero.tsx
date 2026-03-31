export default function Hero() {
  return (
    <section className="px-5 sm:px-8 py-20 sm:py-28" style={{ backgroundColor: "var(--color-white)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-5"
            style={{ color: "var(--color-green)" }}
          >
            WhatsApp-native construction tools
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
            style={{ color: "var(--color-black)" }}
          >
            Run your construction business on the app your team already uses.
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed mb-10 text-gray-600">
            WISCON brings lead qualification, change order approval, and punch list management into WhatsApp — no new app, no training, no friction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center h-13 px-8 rounded-full text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--color-green)", height: "52px" }}
            >
              Join the Waitlist
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center h-13 px-8 rounded-full text-base font-semibold border transition-colors hover:bg-gray-50"
              style={{ borderColor: "#D1D5DB", color: "var(--color-black)", height: "52px" }}
            >
              See the services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
