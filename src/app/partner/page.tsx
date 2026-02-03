import { getPartners } from '@/lib/sanity-queries';
import PartnerForm from './PartnerForm';

export default async function PartnerPage() {
  const partners = await getPartners();

  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Partner With Us</h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Whether you&apos;re a landlord, employer, operator or supplier, BoilboX
            was designed to plug neatly into the spaces and systems you already
            run.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-2 dark:text-white">Real Estate &amp; Landlords</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Activate underused corners in offices, campuses, transit hubs and
              residential communities with a compact kiosk that serves
              genuinely healthy food all day.
            </p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-2 dark:text-white">Corporate &amp; Institutions</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Offer BoilboX as an always-on option inside offices, hospitals,
              tech parks or universities – with flexible subsidy models and
              nutrition reporting.
            </p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-2 dark:text-white">Operators &amp; Franchisees</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Run a network of BoilboX kiosks with centralized support,
              standardized recipes and a data-driven playbook instead of
              guesswork.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Partnership Categories</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Corporate',
              'CSR',
              'Gyms',
              'Hospitals',
              'Universities',
              'NGOs',
            ].map((cat) => (
              <span key={cat} className="px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 text-xs font-black uppercase tracking-widest">
                {cat}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black">Featured Partners</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">Trusted organizations helping us scale clean eating.</p>
            </div>
          </div>
          {partners.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl">
              <p className="text-gray-500">No partners published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10">
                      <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{partner.name}</h3>
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">{partner.type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{partner.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {partner.website && (
                      <a
                        href={partner.website}
                        className="text-primary font-bold text-xs uppercase tracking-[0.16em]"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit Website
                      </a>
                    )}
                    {partner.socialLinks?.linkedin && (
                      <a
                        href={partner.socialLinks.linkedin}
                        className="text-primary font-bold text-xs uppercase tracking-[0.16em]"
                        target="_blank"
                        rel="noreferrer"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                  {partner.testimonials && partner.testimonials.length > 0 && (
                    <div className="mt-6 bg-primary/5 border border-primary/10 rounded-2xl p-4 text-sm text-gray-600 dark:text-gray-300">
                      <p className="font-semibold mb-2">Partner spotlight</p>
                      <p className="italic">"{partner.testimonials[0].quote}"</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mt-2">
                        {partner.testimonials[0].author}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-start">
          <div className="bg-surface-dark text-white rounded-3xl p-10">
            <h2 className="text-2xl font-black mb-4">What partners get</h2>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <span>Compact, modular kiosks with a small footprint and low utility needs.</span>
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <span>Centralized Mother Kitchen support for prep, training and quality.</span>
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <span>Real-time data on sales, product mix and peak usage hours.</span>
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <span>Brand, design and marketing support for launch and ongoing adoption.</span>
              </li>
            </ul>
          </div>
          <div className="neon-selection space-y-6 text-sm text-black dark:text-gray-300">
            <div>
              <h3 className="font-bold mb-2 text-black dark:text-gray-300">Ideal locations</h3>
              <p className="text-black dark:text-gray-300 dark:neon-text-glow">
                We look for high-flow environments where people make repeated,
                everyday food decisions: corporate offices, business parks,
                co-living spaces, colleges, hospitals and transit hubs.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-black dark:text-gray-300">Unit economics</h3>
              <p className="text-black dark:text-gray-300 dark:neon-text-glow">
                The BoilboX model is built for throughput and efficiency rather
                than large dining rooms. That means lower capex per location and
                a clearer path to profitable, multi-kiosk networks.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-black dark:text-gray-300">Local suppliers</h3>
              <p className="text-black dark:text-gray-300 dark:neon-text-glow">
                If you&apos;re a farm or producer focused on high-quality staples,
                we&apos;re always exploring new supply partnerships for specific
                regions.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-10 mb-16">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Kiosk setup details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">Footprint</p>
              <p>Compact kiosk footprint with low utility requirements and easy placement.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">Operations</p>
              <p>BoilboX provides training, daily prep supply, and remote monitoring tools.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">Launch</p>
              <p>Turnkey onboarding with branding, marketing support, and localized menus.</p>
            </div>
          </div>
        </section>

        <section className="bg-surface-dark text-white border border-gray-100 dark:border-white/10 rounded-3xl p-10 md:p-12 mb-12">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Tell us about your space</h2>
          <p className="text-sm text-white/80 mb-6">
            We keep partnerships intentionally selective so we can support each
            one properly. Share a few details and we&apos;ll get back to you with
            next steps.
          </p>
          <PartnerForm />
        </section>

        <section className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 md:p-10 mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black mb-2">Download the partner brochure</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get the full kiosk specs, partnership timeline, and deployment checklist.
              </p>
            </div>
            <a
              href="/BoilboX-Partner-Brochure.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-bold"
            >
              Download Brochure
              <span className="material-symbols-outlined text-base">download</span>
            </a>
          </div>
        </section>

        <section className="bg-surface-dark text-white rounded-3xl p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Let&apos;s build the next generation of food spaces</h2>
          <p className="text-sm text-white/80 max-w-2xl mx-auto">
            If you&apos;re excited about making clean, transparent food the new
            default in your building or city, we&apos;d love to talk.
          </p>
        </section>
      </div>
    </div>
  );
}



