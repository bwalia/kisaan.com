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
    <footer className="border-t border-[var(--color-border)] py-12 bg-[var(--color-background)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
          <div className="max-w-xs">
            <p
              className="text-xl mb-2 m-0"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--color-foreground)", maxWidth: "none" }}
            >
              Kisaan
            </p>
            <p className="text-sm text-[var(--color-muted-foreground)] m-0 leading-relaxed">
              Fresh produce from independent farms, delivered to your door.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-7 gap-y-2" aria-label="Footer">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] no-underline transition-colors duration-200 cursor-pointer"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-[var(--color-border)] pt-6">
          <p className="text-xs text-[var(--color-muted-foreground)] m-0" style={{ maxWidth: "none" }}>
            &copy; {new Date().getFullYear()} Kisaan
          </p>
        </div>
      </div>
    </footer>
  );
}
