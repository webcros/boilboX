export default function ImpactPage() {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Social Impact</h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
            Every bowl has a footprint. Our job is to make sure BoilboX bowls
            leave people, communities and the planet better off.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-bg-dark text-white rounded-3xl p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
              Health
            </p>
            <h2 className="text-3xl font-black mb-2">Oil-Free by Design</h2>
            <p className="text-sm text-white/80">
              By boiling instead of frying, we help guests reduce daily oil
              intake while still enjoying food that feels comforting and
              satisfying.
            </p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
              Community
            </p>
            <h2 className="text-3xl font-black mb-2">Meals That Give Back</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              For every milestone we hit in a location, we commit meals to local
              partners focused on child nutrition and food security.
            </p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
              Environment
            </p>
            <h2 className="text-3xl font-black mb-2">Less Waste, Smarter Use</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Central prep and portioning help us use ingredients fully and keep
              food waste extremely low across the system.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black mb-8">How we measure impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-surface-dark p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">
                Meals Tracked
              </p>
              <p className="text-4xl font-black text-primary mb-1">100%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Every meal is linked to prep time, ingredients and macros.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-surface-dark p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">
                Waste Goal
              </p>
              <p className="text-4xl font-black text-primary mb-1">&lt; 2%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tight forecasting and menu design to minimize unsold food.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-surface-dark p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">
                Local Sourcing
              </p>
              <p className="text-4xl font-black text-primary mb-1">50km</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Target average radius for key staples like vegetables and grains.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-surface-dark p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">
                Giveback
              </p>
              <p className="text-4xl font-black text-primary mb-1">1 in 10</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ambition to unlock a donated meal for every ten sold.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-16">
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <h2 className="text-2xl font-black mb-2">Partnerships on the ground</h2>
            <p>
              We don&apos;t believe in parachute charity. Instead, we look for
              organizations that already understand the needs of their
              communities and then ask how our kitchens and logistics can help.
            </p>
            <p>
              In practice, that looks like supporting after-school meal
              programs, community fridges and health initiatives that use food
              as a lever for long-term change.
            </p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 text-sm text-gray-600 dark:text-gray-300">
            <h3 className="font-bold mb-3">A transparent impact report</h3>
            <p className="mb-3">
              As we grow, we plan to publish a simple, numbers-first impact
              report that covers nutrition, sourcing, waste and community
              programs – in language that makes sense outside of ESG decks.
            </p>
            <p>
              Until then, this page will evolve with honest snapshots of what
              we&apos;re trying, what&apos;s working and what still needs work.
            </p>
          </div>
        </section>

        <section className="bg-bg-dark text-white rounded-3xl p-10 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Help us do this right</h2>
          <p className="text-sm text-white/80 max-w-2xl mx-auto">
            If you&apos;re a nonprofit, a public health team or a community leader
            who cares about access to healthy food, we&apos;d love to explore
            partnerships that go beyond one-time campaigns.
          </p>
        </section>
      </div>
    </div>
  );
}



