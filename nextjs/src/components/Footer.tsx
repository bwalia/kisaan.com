import Link from "next/link";

const links = [
  { label: "Products", href: "/products" },
  { label: "Sell on Kisaan", href: "/register" },
  { label: "Seller guide", href: "/seller-guide" },
  { label: "Support", href: "/support" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10 bg-[var(--parchment)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
          <div className="max-w-xs">
            <p className="text-xl mb-2 m-0" style={{ fontFamily: 'var(--font-display)', color: 'var(--soil)', maxWidth: 'none' }}>
              Kisaan
            </p>
            <p className="text-sm text-[var(--clay)] m-0 leading-relaxed">
              Fresh produce from independent farms, delivered to your door.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-[var(--clay)] hover:text-[var(--soil)] no-underline transition-colors">{l.label}</Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-[var(--border)] pt-6">
          <p className="text-xs text-[#bbb] m-0" style={{ maxWidth: 'none' }}>&copy; {new Date().getFullYear()} Kisaan</p>
        </div>
      </div>
    </footer>
  );
}
