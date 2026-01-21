export default function ModelPage() {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Our Model</h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            BoilboX is designed to make clean, oil-free food as convenient as fast
            food – without compromising on transparency, nutrition, or unit
            economics.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-3 dark:text-white">Mother Kitchen</h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">
              We centralize prep in a single high-hygiene Mother Kitchen. Ingredients
              are washed, cut, portioned and partially cooked under tight controls,
              then sent to kiosks chilled and ready to finish.
            </p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-3 dark:text-white">Smart Kiosks</h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">
              Compact kiosks handle the final boil, assembly and handoff. This
              keeps the footprint small, operations simple, and lets us place BoilboX
              where people actually live, work and commute.
            </p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-3 dark:text-white">Digital First</h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">
              Orders are placed via app or kiosk. Every dish is tied to a nutrition
              profile, prep timestamp and batch, so guests can trust what they&apos;re
              eating – every single time.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black mb-6">How BoilboX Works Day to Day</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                Step 1
              </p>
              <h3 className="font-bold mb-2">Source</h3>
              <p>
                We partner with nearby farms and suppliers for vegetables, grains
                and proteins, prioritizing freshness and traceability over
                long-haul logistics.
              </p>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                Step 2
              </p>
              <h3 className="font-bold mb-2">Prep</h3>
              <p>
                In the Mother Kitchen we standardize cuts, portion sizes and
                spice blends so every bowl tastes the same, no matter which
                kiosk serves it.
              </p>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                Step 3
              </p>
              <h3 className="font-bold mb-2">Boil</h3>
              <p>
                At the kiosk, meals are finished by boiling to order – no oil,
                no deep fryers, and minimal equipment that&apos;s easy to keep
                spotless.
              </p>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                Step 4
              </p>
              <h3 className="font-bold mb-2">Serve &amp; Learn</h3>
              <p>
                We capture feedback and consumption data in real time to improve
                recipes, reduce waste and decide where to open the next kiosk.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="bg-surface-dark text-white rounded-3xl p-10">
            <h2 className="text-2xl font-black mb-4">Why this model matters</h2>
            <p className="text-sm text-white/80 mb-4">
              Traditional quick service formats are built around oil, heavy
              equipment and large crews. Our model flips that: low-touch ops,
              ingredient-led cooking and radical visibility into the kitchen.
            </p>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <span>Lower operating complexity per kiosk, enabling more locations closer to guests.</span>
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <span>Standardized prep that keeps nutrition consistent and verifiable.</span>
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <span>Data from every order that feeds into menu, pricing and expansion decisions.</span>
              </li>
            </ul>
          </div>
          <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="font-bold mb-2">For guests</h3>
              <p>
                Guests get predictable, fully transparent meals that fit into busy
                lives – they can see ingredients, macros and even the kitchen in
                real time.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">For operators</h3>
              <p>
                Operators run lean kiosks with less staff, lower capex and a
                playbook that is built for repeatability rather than hero chefs.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">For communities</h3>
              <p>
                Dense kiosk networks make genuinely healthy food accessible in
                workplaces, campuses, hospitals and transit hubs – not just in
                premium neighborhoods.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}



