import Link from 'next/link';
import { getImpactReports } from '@/lib/sanity-queries';
import ImpactStats from './ImpactStats';

export default async function ImpactPage() {
  const reports = await getImpactReports();

  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Social Impact</h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our latest impact reports and the metrics that guide our mission.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: 'Employment Model',
              desc: 'We hire and train local operators, creating dependable jobs with growth paths in every kiosk community.',
            },
            {
              title: 'Operator Stories',
              desc: 'Community partners run daily operations while BoilboX supports training, prep and quality assurance.',
            },
            {
              title: 'Impact Metrics',
              desc: 'We track meals served, food waste saved, and partner earnings to keep impact measurable and transparent.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-black mb-3">{item.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-surface-dark text-white rounded-3xl p-10 md:p-12 mb-16">
          <ImpactStats />
          <div className="mt-8 text-center">
            <Link
              href="/partner"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-bold"
            >
              Partner for Impact
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            {
              name: 'Asha Patel',
              role: 'Kiosk Operator, Oakland',
              story: '"BoilboX training helped me build a stable business and provide healthy meals to my community."',
              image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=400',
            },
            {
              name: 'Marcus Chen',
              role: 'Partner Lead, Seattle',
              story: '"Our campus kiosk now serves hundreds of oil-free meals daily with transparent nutrition."',
              image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=400',
            },
          ].map((story) => (
            <div key={story.name} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 flex gap-4">
              <img src={story.image} alt={story.name} className="w-20 h-20 rounded-2xl object-cover" />
              <div>
                <p className="font-black">{story.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-3">{story.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{story.story}</p>
              </div>
            </div>
          ))}
        </section>

        {reports.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl">
            <p className="text-gray-500 text-lg mb-2">No impact reports published yet</p>
            <p className="text-gray-400 text-sm">Publish an impact report in Sanity to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {reports.map((report) => (
              <article
                key={report.id}
                className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all"
              >
                <Link href={`/impact/${report.slug}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={report.coverImage}
                      alt={report.coverImageAlt || report.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </Link>
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Report {report.reportYear}</span>
                    {report.isFeatured && (
                      <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-primary">Featured</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black leading-tight">{report.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-3">{report.summary}</p>
                  <div className="flex flex-wrap gap-3">
                    {report.metrics.slice(0, 3).map((metric) => (
                      <div key={metric.title} className="px-3 py-2 rounded-2xl bg-primary/10 text-primary text-xs font-bold">
                        {metric.title}: {metric.value}
                      </div>
                    ))}
                  </div>
                  <Link href={`/impact/${report.slug}`} className="text-primary font-bold text-sm inline-flex items-center gap-2">
                    View report <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



