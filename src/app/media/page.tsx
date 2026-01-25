export const metadata = {
  title: 'Media & Press | BoilboX',
  description: 'Press coverage, awards, and brand assets for BoilboX.',
};

const pressMentions = [
  { outlet: 'FoodTech Weekly', title: 'BoilboX brings transparency to fast food', year: 2025 },
  { outlet: 'Clean Eating Journal', title: 'Why boiled meals are the next wellness trend', year: 2024 },
  { outlet: 'Local Business Report', title: 'Kiosks that serve healthy meals on demand', year: 2024 },
];

const awards = [
  { name: 'Sustainable Food Startup Award', year: 2024 },
  { name: 'Healthy Cities Innovation Grant', year: 2025 },
];

export default function MediaPage() {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Media & Press</h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Highlights, awards, and resources for partners and press inquiries.
          </p>
        </header>

        <section className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-black mb-6">Press mentions</h2>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            {pressMentions.map((item) => (
              <div key={item.title} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{item.outlet}</p>
                  <p>{item.title}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-gray-400">{item.year}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-black mb-6">Awards & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            {awards.map((award) => (
              <div key={award.name} className="rounded-2xl border border-gray-100 dark:border-white/10 p-4">
                <p className="font-bold text-gray-900 dark:text-white">{award.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400">{award.year}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-dark text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black mb-2">Download brand assets</h2>
            <p className="text-sm text-white/80">Logos, imagery, and brand guidelines for approved usage.</p>
          </div>
          <a
            href="/BoilboX-Brand-Assets.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-bold"
          >
            Download Assets
            <span className="material-symbols-outlined text-base">download</span>
          </a>
        </section>
      </div>
    </div>
  );
}
