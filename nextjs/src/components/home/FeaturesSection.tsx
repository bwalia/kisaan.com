'use client';

const steps = [
  {
    title: 'Browse the market',
    desc: 'Discover fresh produce from local and international farms, with transparent sourcing.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M21 21l-4-4" />
      </svg>
    ),
  },
  {
    title: 'Order direct',
    desc: 'Buy from the farmer — no middlemen, no markup. Fair prices for growers and buyers.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 6h14M10 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
      </svg>
    ),
  },
  {
    title: 'Get it fresh',
    desc: 'Harvested to order and delivered within 24–48 hours, temperature-controlled.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-14 lg:py-20 bg-[var(--color-muted)]" aria-labelledby="how-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="how-heading" className="text-2xl sm:text-3xl mb-10">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((s, i) => (
            <div key={s.title} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-[var(--color-primary)]"
                style={{ background: '#DCFCE7' }}
              >
                {s.icon}
              </div>
              <h3
                className="text-base mb-2"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--color-foreground)' }}
              >
                {s.title}
              </h3>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed m-0">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
