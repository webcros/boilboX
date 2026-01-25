import Link from 'next/link';
import { getFeaturedMeals, getTestimonials } from '@/lib/sanity-queries';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: "BoilboX - Eat Clean. Live Light.",
  description: "100% Boiled, 0% Oil. Redefining fast food with transparency, nutrient retention, and meals that heal from the inside out.",
  url: "https://boilox.com",
  type: "website"
});

export default async function Home() {
  // Fetch featured meals from Sanity (fallback to empty array if error)
  const [featuredMeals, testimonials] = await Promise.all([
    getFeaturedMeals().catch(() => []),
    getTestimonials().catch(() => []),
  ]);
  
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="px-4 md:px-10 lg:px-40 py-6">
        <div className="relative overflow-hidden rounded-[2rem] min-h-[500px] md:min-h-[650px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%), url("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1600")' }}>
          <div className="relative z-10 flex flex-col gap-6 text-center max-w-3xl px-6">
            <div className="inline-flex items-center justify-center gap-2 mx-auto px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span className="material-symbols-outlined text-primary text-sm">eco</span>
              <span className="text-white text-xs font-bold uppercase tracking-widest">100% Sustainable</span>
            </div>
            <h1 className="text-white text-4xl md:text-7xl font-black leading-tight tracking-tight">
              Eat Clean. Live Light.<br />
              <span className="text-primary">100% Boiled, 0% Oil.</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto">
              BoilboX is redefining fast food. Transparency, nutrient retention, and meals that heal from the inside out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link href="/menu" className="h-14 px-10 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark text-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center">
                Order Now
              </Link>
              <Link href="/model" className="h-14 px-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 text-lg font-bold transition-all flex items-center justify-center gap-2">
                <span>How it Works</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Meals */}
      <section className="py-16 px-4 md:px-10 lg:px-40">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-2">Featured Meals</h2>
            <p className="text-gray-500 text-lg">Handpicked dishes our guests love the most.</p>
          </div>
          <Link href="/menu" className="text-primary font-bold text-lg flex items-center gap-1 group">
            See Full Menu <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredMeals.length > 0 ? (
            featuredMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white dark:bg-surface-dark rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-2xl transition-all group"
              >
                <Link href={`/menu/${meal.slug}`} className="block">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={meal.image}
                      alt={meal.imageAlt || meal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary/15 border border-primary/30 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                      {meal.category}
                    </div>
                  </div>
                </Link>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{meal.name}</h3>
                    <span className="text-primary font-bold text-xl">${meal.price.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-300 text-sm mb-6 line-clamp-2">{meal.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/10">
                    <div className="flex gap-4 text-xs font-bold text-gray-400 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-sm">local_fire_department</span> {meal.calories} kcal
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-sm">fitness_center</span> {meal.protein} Prot
                      </span>
                    </div>
                    <Link
                      href={`/order?item=${meal.slug}`}
                      className="w-10 h-10 rounded-full bg-primary hover:bg-primary-hover text-bg-dark flex items-center justify-center transition-transform hover:rotate-90"
                      aria-label={`Add ${meal.name} to order`}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              <p>No featured meals available. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 px-4 md:px-10 lg:px-40">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Why Boiled & Oil-Free?</h2>
          <p className="text-gray-500 text-lg">Cooking without oil isn't just a trend; it's the purest way to experience food.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: 'water_drop', title: 'Zero Oil Added', desc: 'Water as our primary medium eliminates processed fats, keeping your heart light.' },
            { icon: 'health_and_safety', title: 'Max Nutrients', desc: 'Controlled boiling ensures vitamins and minerals stay in your food, not the pan.' },
            { icon: 'spa', title: 'Gut Friendly', desc: 'Easy on the stomach and quick to digest for sustained energy throughout the day.' },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-surface-dark p-10 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-4xl">{item.icon}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed text-lg text-white">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Kitchen Teaser */}
      <section className="py-24 bg-white dark:bg-[#15281e]">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live Feed
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Nothing to Hide.</h2>
            <p className="text-xl text-gray-500 leading-relaxed">
              Watch our chefs prepare meals in real-time. From vegetable washing to the final garnish—transparency is our top ingredient.
            </p>
            <ul className="space-y-4">
              {['Hospital-grade hygiene standards', 'Fresh ingredients prepped hourly', 'No hidden additives or preservatives'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-lg text-white">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/live" className="inline-block text-primary font-bold text-lg hover:underline">
              Enter Live Kitchen →
            </Link>
          </div>
          <div className="flex-1 w-full">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border-4 border-white dark:border-white/10">
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800" alt="Chef preparing meal" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center text-white scale-100 group-hover:scale-110 transition-all">
                  <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-black/60 backdrop-blur rounded-lg flex items-center gap-2 text-white font-mono text-xs">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> REC
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact Stats */}
      <section className="py-24 bg-surface-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #13ec5b 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary font-black uppercase tracking-widest text-sm mb-4 block">Our Mission</span>
          <h2 className="text-4xl md:text-6xl font-black mb-16">Meals That Matter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div>
              <div className="text-6xl md:text-8xl font-black text-primary mb-4">50k+</div>
              <p className="text-xl font-bold mb-2">Meals Donated</p>
              <p className="text-white/80 text-sm">For every 10 meals sold, we feed a child in need through local partners.</p>
            </div>
            <div>
              <div className="text-6xl md:text-8xl font-black text-primary mb-4">24</div>
              <p className="text-xl font-bold mb-2">Local Farms</p>
              <p className="text-white/80 text-sm">We source directly from small-scale organic farmers within 50 miles.</p>
            </div>
            <div>
              <div className="text-6xl md:text-8xl font-black text-primary mb-4">0%</div>
              <p className="text-xl font-bold mb-2">Food Waste</p>
              <p className="text-white/80 text-sm">Unsold ingredients are composted or donated to community kitchens daily.</p>
            </div>
          </div>
          <Link href="/impact" className="mt-20 inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-bg-dark font-black rounded-xl transition-all">
            Read Our Impact Report <span className="material-symbols-outlined">arrow_outward</span>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 md:px-10 lg:px-40">
        <h2 className="text-3xl font-black mb-16 text-center">Real Stories, Real Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.length > 0 ? (
            testimonials.map((t) => (
              <div key={t.id} className="bg-white dark:bg-surface-dark p-10 rounded-[2rem] shadow-sm relative group">
                <span className="material-symbols-outlined text-primary/10 text-[100px] absolute top-4 right-4 leading-none select-none">format_quote</span>
                <p className="text-xl font-medium leading-relaxed mb-8 relative z-10 italic text-gray-900 dark:text-white">"{t.quote}"</p>
                <div className="flex items-center gap-4 relative z-10">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full ring-2 ring-primary/20" />
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-300 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500">No testimonials available yet.</div>
          )}
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-12 px-4 md:px-10 lg:px-40 pb-24">
        <div className="bg-primary/10 rounded-[2.5rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 border border-primary/20">
          <div className="text-center md:text-left max-w-xl">
              <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-gray-900 dark:text-primary">Want to partner with us?</h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg">Open a franchise, bring a kiosk to your office, or supply fresh local produce.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link href="/partner" className="bg-bg-dark text-white px-8 py-4 rounded-xl font-black hover:bg-black transition-all shadow-xl text-center">Apply for Franchise</Link>
            <Link href="/partner" className="bg-white border border-gray-200 px-8 py-4 rounded-xl font-black text-bg-dark hover:bg-gray-50 transition-all text-center">Become a Supplier</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
