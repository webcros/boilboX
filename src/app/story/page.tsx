export default function StoryPage() {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Our Story</h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
            BoilboX began with a simple question: why is it so hard to find
            food that&apos;s both genuinely healthy and genuinely convenient?
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 text-sm text-gray-600 dark:text-gray-300">
          <div className="md:col-span-2 space-y-4">
            <p>
              Our founders spent years watching friends and family bounce
              between crash diets, delivery apps and late-night takeout.
              Everything was either slow, expensive or secretly heavy on oil and
              additives. The options that felt good rarely fit into a normal
              weekday.
            </p>
            <p>
              The idea for BoilboX emerged in a home kitchen, experimenting with
              boiled recipes that kept flavor without relying on deep frying.
              What started as Sunday batch-cooking for a few people slowly
              turned into an obsession with repeatable, oil-free cooking
              methods.
            </p>
            <p>
              We realized that if we could standardize these recipes and pair
              them with a compact kiosk format, we could bring this style of
              eating to offices, campuses and neighborhoods everywhere.
            </p>
          </div>
          <aside className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6 flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              What we stand for
            </h2>
            <p>Three principles anchor every decision we make:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Radical transparency in ingredients and process.</li>
              <li>Nutrition that is measured, not guessed.</li>
              <li>Access to healthy food in everyday spaces.</li>
            </ul>
          </aside>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black mb-8">Milestones so far</h2>
          <div className="space-y-6 border-l border-dashed border-gray-200 dark:border-white/10 pl-6">
            <div className="relative">
              <span className="absolute -left-[14px] top-1 w-3 h-3 rounded-full bg-primary"></span>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">
                Prototype Kitchen
              </p>
              <h3 className="font-bold mb-1">From home stove to test lab</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We built our first &quot;Mother Kitchen&quot; in a small commissary space
                and invited nutritionists, chefs and everyday diners to stress
                test the menu.
              </p>
            </div>
            <div className="relative">
              <span className="absolute -left-[14px] top-1 w-3 h-3 rounded-full bg-primary"></span>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">
                First Kiosk
              </p>
              <h3 className="font-bold mb-1">Launching inside the commute</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Our first kiosk opened near a busy transit hub, serving bowls to
                people who only had 5–7 minutes between connections.
              </p>
            </div>
            <div className="relative">
              <span className="absolute -left-[14px] top-1 w-3 h-3 rounded-full bg-primary"></span>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">
                Live Kitchen
              </p>
              <h3 className="font-bold mb-1">Nothing to hide</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We wired cameras into our kitchen and made &quot;watch us cook&quot;
                part of the core product, not a marketing stunt.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-bg-dark text-white rounded-3xl p-10 md:p-12">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Where we&apos;re headed</h2>
          <p className="text-sm text-white/80 mb-4">
            BoilboX is still early. We&apos;re learning every day from guests,
            partners and operators who share our belief that food can be both
            deeply nourishing and radically convenient.
          </p>
          <p className="text-sm text-white/80 mb-4">
            Our goal is not just to open more kiosks. It&apos;s to prove that a
            new default for everyday eating is possible – one that doesn&apos;t
            depend on hidden oils, mystery sauces or opaque supply chains.
          </p>
          <p className="text-sm text-white/80">
            If that vision resonates with you – as a guest, a partner, or a
            future teammate – we&apos;d love to hear from you.
          </p>
        </section>
      </div>
    </div>
  );
}



