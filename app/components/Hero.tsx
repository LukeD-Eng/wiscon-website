export default function Hero() {
  return (
    <section className="px-5 sm:px-8 py-20 sm:py-28" style={{ backgroundColor: "var(--color-white)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-5"
            style={{ color: "var(--color-green)" }}
          >
            The compliance infrastructure for SA construction
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
            style={{ color: "var(--color-black)" }}
          >
            Every instruction confirmed. Every change order signed. No new app.
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed mb-10 text-gray-600">
            WISCON is the compliance infrastructure for South African construction, delivered entirely through WhatsApp. One number. Six modules. One subscription.
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
              See the platform
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
