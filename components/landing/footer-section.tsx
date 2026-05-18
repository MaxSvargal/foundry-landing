"use client";

const footerLinks = {
  Product: [
    { name: "Why Foundry", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "For your team", href: "#for-your-team" },
    { name: "Pricing", href: "#pricing" },
  ],
  Resources: [
    { name: "Docs", href: "#" },
    { name: "GitHub", href: "#" },
    { name: "Changelog", href: "#" },
    { name: "Security", href: "#" },
  ],
  Company: [
    { name: "Manifesto", href: "#" },
    { name: "Hiring", href: "#", badge: "Hiring" },
    { name: "Contact", href: "#" },
  ],
};

export function FooterSection() {
  return (
    <footer className="bg-[#F5F1EA] border-t border-[#D8D2C8]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main footer */}
        <div className="py-16 lg:py-20 grid grid-cols-2 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <a href="#" className="inline-flex items-center gap-2 mb-5">
              <span className="text-xl font-display font-semibold text-[#1B1B19]">foundry</span>
              <span className="font-mono text-[10px] text-[#A4471C] tracking-widest uppercase">beta</span>
            </a>
            <p className="text-sm text-[#6B6860] leading-relaxed max-w-xs mb-8">
              Built on Ash, Elixir, and the BEAM. Open source. Made by people who've shipped distributed systems and don't want to do it the hard way again.
            </p>
            <div className="flex gap-5">
              <a href="#" className="text-sm text-[#6B6860] hover:text-[#1B1B19] transition-colors">
                Twitter
              </a>
              <a href="#" className="text-sm text-[#6B6860] hover:text-[#1B1B19] transition-colors">
                GitHub
              </a>
              <a href="#" className="text-sm text-[#6B6860] hover:text-[#1B1B19] transition-colors">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-mono text-[#6B6860] tracking-widest uppercase mb-5">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-[#1B1B19]/70 hover:text-[#1B1B19] transition-colors inline-flex items-center gap-2"
                    >
                      {link.name}
                      {"badge" in link && link.badge && (
                        <span className="font-mono text-[10px] text-[#A4471C] border border-[#A4471C]/40 px-1.5 py-0.5 tracking-wider">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[#D8D2C8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[#6B6860] font-mono">
            © 2026 Foundry. Your codebase is the spec. It never lies.
          </p>
          <p className="text-xs text-[#6B6860]/60 font-mono">
            Product · Docs · GitHub · Changelog · Security · Pricing
          </p>
        </div>
      </div>
    </footer>
  );
}
