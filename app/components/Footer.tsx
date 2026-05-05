export default function Footer() {
  const legalDetails =
    "WISCON (PTY) LTD | Reg No: 2026/334498/07 | 7 Grenache Close, Zevenzicht Estate, Cape Town, Western Cape, 7580";

  return (
    <footer
      className="px-5 sm:px-8 py-12 border-t border-gray-100"
      style={{ backgroundColor: "var(--color-white)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-semibold text-lg tracking-tight mb-1" style={{ color: "var(--color-black)" }}>
            WIS<span style={{ color: "var(--color-green)" }}>C</span>ON
          </p>
          <p className="text-sm text-gray-500">WhatsApp Integrated Services in Construction</p>
          <p className="text-xs text-gray-400 mt-2 max-w-xl">{legalDetails}</p>
        </div>
        <div className="flex flex-col sm:items-end gap-1.5">
          <a
            href="mailto:hello@wiscon.co.za"
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-green)" }}
          >
            hello@wiscon.co.za
          </a>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} WISCON. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
