'use client';

const steps = [
  { n: '1', title: 'Browse the market', desc: 'Discover fresh produce from local and international farms, with transparent sourcing.' },
  { n: '2', title: 'Order direct',      desc: 'Buy from the farmer — no middlemen, no markup. Fair prices for growers and buyers.' },
  { n: '3', title: 'Get it fresh',      desc: 'Harvested to order and delivered within 24–48 hours, temperature-controlled.' },
];

export default function FeaturesSection() {
  return (
    <section className="py-14 lg:py-20 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl mb-10">How it works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-14">
          {steps.map((s) => (
            <div key={s.n}>
              <span className="block text-[3.5rem] leading-none mb-3 text-[var(--sage)]" style={{ fontFamily: 'var(--font-display)' }}>
                {s.n}
              </span>
              <h3 className="text-base mb-2" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--soil)' }}>
                {s.title}
              </h3>
              <p className="text-sm text-[var(--clay)] leading-relaxed m-0">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
