'use client';

const steps = [
  {
    title: 'Browse the market',
    desc: 'Find produce from local and distant farms, with clear sourcing on every listing.',
  },
  {
    title: 'Order from the farmer',
    desc: 'Pay the grower directly. Fair prices for them — and for you.',
  },
  {
    title: 'Receive it fresh',
    desc: 'Harvested to order and delivered within a day or two, kept cool in transit.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-14 lg:py-16 bg-[var(--limewash)]" aria-labelledby="how-heading">
      <div className="container mx-auto">
        <h2 id="how-heading" className="text-xl sm:text-2xl mb-10">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {steps.map((s) => (
            <div key={s.title}>
              <h3
                className="text-base mb-2 m-0"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--ink)' }}
              >
                {s.title}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed m-0">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
